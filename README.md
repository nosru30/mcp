# フルスタックアプリケーション テンプレート

このプロジェクトは、React + TypeScript（フロントエンド）、Node.js + Express + TypeScript（バックエンド）、Prisma（ORM）、PostgreSQL/SQLite（データベース）を使用したフルスタックアプリケーションのテンプレートです。

## 🚀 特徴

### フロントエンド
- **React 18** + **TypeScript** - モダンなUI開発
- **Vite** - 高速な開発サーバーとビルドツール
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
- **React Router** - クライアントサイドルーティング
- **React Query** - サーバー状態管理とデータフェッチング
- **React Hook Form** - 効率的なフォーム管理
- **Lucide React** - 美しいアイコンライブラリ

### バックエンド
- **Node.js** + **Express** + **TypeScript** - 型安全なサーバー開発
- **Prisma** - 次世代のTypeScript ORM
- **Zod** - スキーマバリデーション
- **JWT** - 認証機能（準備済み）
- **CORS** - クロスオリジンリクエスト対応
- **Helmet** - セキュリティヘッダー
- **Morgan** - HTTPリクエストロガー

### データベース
- **SQLite** (開発環境) / **PostgreSQL** (本番環境)
- **Prisma Migrate** - データベーススキーマ管理
- **Prisma Studio** - データベースGUI

### 開発環境
- **Docker** + **Docker Compose** - コンテナ化された開発環境
- **TypeScript** - 型安全性
- **ESLint** + **Prettier** - コード品質とフォーマット
- **Hot Reload** - 開発時の自動リロード

## 📁 プロジェクト構造

```
fullstack-app/
├── frontend/                 # Reactフロントエンド
│   ├── src/
│   │   ├── components/      # 再利用可能なコンポーネント
│   │   ├── pages/          # ページコンポーネント
│   │   ├── services/       # API通信サービス
│   │   └── ...
│   ├── package.json
│   └── Dockerfile.dev
├── backend/                 # Node.jsバックエンド
│   ├── src/
│   │   ├── controllers/    # リクエストハンドラー
│   │   ├── routes/         # APIルート定義
│   │   ├── index.ts        # サーバーエントリーポイント
│   │   └── seed.ts         # データベースシード
│   ├── prisma/
│   │   └── schema.prisma   # データベーススキーマ
│   ├── package.json
│   └── Dockerfile.dev
├── docker-compose.yml       # Docker設定
├── package.json            # ルートパッケージ設定
└── README.md
```

## 🛠️ セットアップ

### 前提条件
- Node.js 18以上
- Docker & Docker Compose（推奨）
- Git

### 1. プロジェクトのクローン
```bash
git clone <repository-url>
cd fullstack-app
```

### 2. 依存関係のインストール
```bash
# ルートディレクトリで全ての依存関係をインストール
npm run setup
```

### 3. 環境変数の設定
```bash
# 環境変数ファイルをコピー
cp .env.example .env
```

### 4. データベースのセットアップ
```bash
# Prismaクライアントの生成
npm run db:generate

# データベースマイグレーション
npm run db:migrate

# サンプルデータの投入
npm run db:seed
```

### 5. 開発サーバーの起動

#### Docker Composeを使用（推奨）
```bash
# 全サービスを起動
docker-compose up

# バックグラウンドで起動
docker-compose up -d
```

#### 個別に起動
```bash
# バックエンド（ターミナル1）
cd backend
npm run dev

# フロントエンド（ターミナル2）
cd frontend
npm run dev
```

## 🌐 アクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **Prisma Studio**: `npm run db:studio`

## 📝 API エンドポイント

### ユーザー管理
- `GET /api/users` - 全ユーザー取得
- `GET /api/users/:id` - 特定ユーザー取得
- `POST /api/users` - ユーザー作成
- `PUT /api/users/:id` - ユーザー更新
- `DELETE /api/users/:id` - ユーザー削除

### 投稿管理
- `GET /api/posts` - 全投稿取得
- `GET /api/posts/:id` - 特定投稿取得
- `POST /api/posts` - 投稿作成
- `PUT /api/posts/:id` - 投稿更新
- `DELETE /api/posts/:id` - 投稿削除

## 🔧 開発用コマンド

```bash
# 全体
npm run setup          # 全依存関係のインストール
npm run dev           # 開発サーバー起動（Docker Compose）
npm run build         # 本番ビルド

# データベース
npm run db:generate   # Prismaクライアント生成
npm run db:migrate    # マイグレーション実行
npm run db:studio     # Prisma Studio起動
npm run db:seed       # サンプルデータ投入

# フロントエンド
cd frontend
npm run dev           # 開発サーバー
npm run build         # ビルド
npm run preview       # ビルド結果のプレビュー

# バックエンド
cd backend
npm run dev           # 開発サーバー
npm run build         # TypeScriptコンパイル
npm start             # 本番サーバー起動
```

## 🎯 カスタマイズガイド

### 新しいページの追加
1. `frontend/src/pages/` に新しいページコンポーネントを作成
2. `frontend/src/App.tsx` にルートを追加

### 新しいAPIエンドポイントの追加
1. `backend/prisma/schema.prisma` にデータモデルを定義
2. `backend/src/controllers/` にコントローラーを作成
3. `backend/src/routes/` にルートを定義
4. `backend/src/index.ts` にルートを登録

### データベーススキーマの変更
1. `backend/prisma/schema.prisma` を編集
2. `npm run db:migrate` でマイグレーション実行

## 🚀 本番デプロイ

### 環境変数の設定
本番環境では以下の環境変数を適切に設定してください：

```bash
# データベース
DATABASE_URL="postgresql://user:password@host:port/database"

# サーバー
NODE_ENV=production
PORT=3001

# セキュリティ
JWT_SECRET="your-super-secure-jwt-secret"
CORS_ORIGIN="https://your-frontend-domain.com"
```

### Docker本番ビルド
```bash
# 本番用Dockerfileを作成し、以下のコマンドでビルド
docker build -t fullstack-app-frontend ./frontend
docker build -t fullstack-app-backend ./backend
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🆘 トラブルシューティング

### よくある問題

**1. ポートが既に使用されている**
```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :3001

# プロセスを終了
kill -9 <PID>
```

**2. Prismaクライアントが見つからない**
```bash
# Prismaクライアントを再生成
npm run db:generate
```

**3. データベース接続エラー**
```bash
# データベースファイルの権限を確認
ls -la backend/prisma/

# マイグレーションを再実行
npm run db:migrate
```

**4. Docker関連の問題**
```bash
# コンテナとイメージをクリーンアップ
docker-compose down
docker system prune -a

# 再ビルド
docker-compose up --build
```

## 📚 参考資料

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
