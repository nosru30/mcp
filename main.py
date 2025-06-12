#!/usr/bin/env python
"""
CLI entry point for the search + summary agent system.

Usage:
    python main.py "調べたい質問"
    python main.py "質問" --topk 10

環境変数:
    OPENAI_API_KEY   OpenAI API キー
    TAVILY_API_KEY   Tavily API キー
    OPENAI_MODEL     (任意) 使用するモデル名
"""

from __future__ import annotations

import argparse
import textwrap

from agents import SummaryAgent


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="検索 + 要約エージェント CLI",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument("question", type=str, help="調べたい質問文")
    parser.add_argument(
        "-k",
        "--topk",
        type=int,
        default=5,
        help="検索結果件数 (default: 5)",
    )
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    agent = SummaryAgent()
    answer = agent.summarize(args.question, k=args.topk)
    print(textwrap.dedent(answer))


if __name__ == "__main__":
    main()
