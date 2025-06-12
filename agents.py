"""
agents.py

SearchAgent:
    – Tavily Search API を呼び出し、Web ドキュメント一覧を取得する。
SummaryAgent:
    – SearchAgent を利用してドキュメントを集め、
      OpenAI ChatCompletion API で回答を要約生成する。
"""

from __future__ import annotations

import os
import time
import json
from typing import Dict, List

import openai
import requests
from requests.exceptions import RequestException, HTTPError

# API キー設定（環境変数）
openai.api_key = os.getenv("OPENAI_API_KEY")


class SearchAgent:
    """Tavily API を使って Web 検索を行うエージェント"""

    ENDPOINT = "https://api.tavily.com/search"

    def __init__(self, api_key: str | None = None, retries: int = 3, backoff: float = 1.5) -> None:
        self.api_key = api_key or os.getenv("TAVILY_API_KEY")
        if not self.api_key:
            raise ValueError("TAVILY_API_KEY が設定されていません")
        self.retries = retries
        self.backoff = backoff

    def search(self, query: str, k: int = 5) -> List[Dict]:
        """Tavily で検索し、上位 k 件を返す"""
        payload = {"api_key": self.api_key, "query": query, "num_results": k}

        for attempt in range(1, self.retries + 1):
            try:
                resp = requests.post(self.ENDPOINT, json=payload, timeout=10)
                resp.raise_for_status()
                data = resp.json()
                return data.get("results", [])
            except (RequestException, HTTPError) as err:
                if attempt == self.retries:
                    raise RuntimeError(f"Tavily search failed after {self.retries} attempts") from err
                time.sleep(self.backoff * attempt)

        # この行に到達することはないはず
        return []


class SummaryAgent:
    """検索結果を要約してユーザーへ返すエージェント"""

    def __init__(self, model: str | None = None, temperature: float = 0.3):
        self.model = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        self.temperature = temperature
        self.search_agent = SearchAgent()

    def _compose_prompt(self, question: str, docs: List[Dict]) -> List[Dict]:
        """OpenAI ChatCompletion 用メッセージを組み立てる"""
        doc_section = "\n\n".join(
            f"[{idx+1}] {doc['title']} ({doc['url']}):\n{doc['content']}"
            for idx, doc in enumerate(docs)
        )

        system_msg = (
            "You are a research assistant. Using ONLY the provided web documents, "
            "answer the user's question. Insert markdown citations like [1] next to each fact."
        )
        user_msg = f"### Question\n{question}\n\n### Documents\n{doc_section}\n\n### Answer"

        return [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ]

    def summarize(self, question: str, k: int = 5) -> str:
        """
        質問を受け取り、OpenAI の function calling 機能を利用して
        SearchAgent を「ツール」として呼び出しつつ要約を生成する。
        質問内容に応じて search_web 関数が複数回呼び出される場合は、
        すべて逐次実行し、その結果をモデルに渡して最終回答を取得する。
        """
        # 1. ユーザメッセージをセットアップ
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a research assistant. "
                    "If you can answer the question from your general knowledge, do so directly **without** using any tool. "
                    "Only when additional information is required, call the search_web tool to gather web documents. "
                    "Cite sources like [1] in markdown when you reference searched documents."
                ),
            },
            {"role": "user", "content": question},
        ]

        # 2. SearchAgent を tool として定義
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "search_web",
                    "description": "Perform a web search and return documents.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {"type": "string", "description": "Search query"},
                            "k": {
                                "type": "integer",
                                "description": "Number of search results",
                                "default": k,
                            },
                        },
                        "required": ["query"],
                    },
                },
            }
        ]

        # 3. モデルに質問を投げ、tool 呼び出しを自動選択させる
        queries: List[str] = []  # どんな検索クエリを投げたか記録
        response = openai.chat.completions.create(
            model=self.model,
            messages=messages,
            tools=tools,
            tool_choice="auto",
            temperature=self.temperature,
        )

        # 4. tool 呼び出しが返ってくる限りループ
        while response.choices[0].finish_reason == "tool_calls":
            # モデルが出力した tool_calls を履歴に追加
            assistant_msg = response.choices[0].message
            messages.append(assistant_msg)

            for call in assistant_msg.tool_calls:
                name = call.function.name
                args = json.loads(call.function.arguments)

                if name == "search_web":
                    query = args["query"]
                    k_arg = args.get("k", k)
                    docs = self.search_agent.search(query, k=k_arg)
                    queries.append(query)  # クエリを記録
                    # SearchAgent の結果をモデルへ渡す
                    messages.append(
                        {
                            "role": "tool",
                            "tool_call_id": call.id,
                            "name": name,
                            "content": json.dumps(docs, ensure_ascii=False),
                        }
                    )

            # 5. 追加メッセージを含めて再度 ChatCompletion
            response = openai.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=tools,
                temperature=self.temperature,
            )

        # 6. 最終回答を返す（クエリ一覧を併記）
        final_answer = response.choices[0].message.content.strip()
        query_report = "### Search queries used ({0})\n{1}".format(
            len(queries),
            "\n".join(f"{idx+1}. {q}" for idx, q in enumerate(queries)),
        )
        return f"{query_report}\n\n{final_answer}"
