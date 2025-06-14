# フルスタックアプリケーション アーキテクチャガイド

このドキュメントでは、フルスタックアプリケーションのひな形における「固定部分」と「カスタマイズ部分」を明確に分離し、開発者がどこを変更すべきかを示します。

## 🔒 固定部分（基本的に変更不要）

これらのファイルは、フレームワークの基盤となる部分で、基本的に変更する必要がありません。

### 📦 設定ファイル・環境構築
```
├── package.json                    # ルートパッケージ設定
├── docker-compose.yml              # Docker構成
├── .env.example                    # 環境変数テンプレート
├── frontend/
│   ├── package.json               # フロントエンド依存関係
│   ├── vite.config.ts             # Vite設定
│   ├── tsconfig.json              # TypeScript設定
│   ├── tsconfig.node.json         # Node.js用TypeScript設定
│   ├── tailwind.config.js         # Tailwind CSS設定
│   ├── postcss.config.js          # PostCSS設定
│   ├── index.html                 # HTMLテンプレート
│   ├── Dockerfile.dev             # 開発用Docker設定
│   └── src/
│       ├── main.tsx               # Reactエントリーポイント
│       └── index.css              # グローバルスタイル
└── backend/
    ├── package.json               # バックエンド依存関係
    ├── tsconfig.json              # TypeScript設定
    ├── Dockerfile.dev             # 開発用Docker設定
    └── src/
        └── index.ts               # サーバーエントリーポイント
```

### 🏗️ フレームワーク基盤
```
frontend/src/
├── components/
│   └── Layout.tsx                 # 基本レイアウトコンポーネント
└── services/
    └── [基本的なHTTPクライアント設定]

backend/src/
├── index.ts                       # Express サーバー設定
└── [ミドルウェア、エラーハンドリング設定]
```

## 🎯 カスタマイズ部分（プロジェクトごとに変更）

これらの部分は、具体的なアプリケーションの要件に応じて変更・拡張します。

### 1. 📊 データベーススキーマ（最重要）
```
backend/prisma/schema.prisma       # データモデル定義
```

**変更内容:**
- モデル定義（User, Post以外の新しいエンティティ）
- フィールド追加・変更
- リレーション定義
- インデックス設定

**例:**
```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Decimal
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("products")
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  products Product[]
  
  @@map("categories")
}
```

### 2. 🔌 バックエンドAPI（ビジネスロジック）
```
backend/src/
├── controllers/                   # ビジネスロジック
│   ├── userController.ts         # 参考実装
│   ├── postController.ts         # 参考実装
│   └── [新しいコントローラー]
├── routes/                       # APIルート定義
│   ├── userRoutes.ts            # 参考実装
│   ├── postRoutes.ts            # 参考実装
│   └── [新しいルート]
└── seed.ts                      # サンプルデータ
```

**変更内容:**
- 新しいコントローラーの追加
- バリデーションスキーマの定義
- ビジネスロジックの実装
- 認証・認可の追加

**例:**
```typescript
// controllers/productController.ts
export const productController = {
  async getAllProducts(req: Request, res: Response) {
    const products = await prisma.product.findMany({
      include: { category: true }
    })
    res.json(products)
  },
  // ... その他のCRUD操作
}
```

### 3. 🎨 フロントエンドUI（画面・機能）
```
frontend/src/
├── pages/                        # ページコンポーネント
│   ├── HomePage.tsx             # 参考実装
│   ├── UsersPage.tsx            # 参考実装
│   ├── PostsPage.tsx            # 参考実装
│   └── [新しいページ]
├── components/                   # 再利用コンポーネント
│   ├── UserForm.tsx             # 参考実装
│   ├── PostForm.tsx             # 参考実装
│   └── [新しいコンポーネント]
├── services/                     # API通信
│   ├── userService.ts           # 参考実装
│   ├── postService.ts           # 参考実装
│   └── [新しいサービス]
└── App.tsx                      # ルーティング設定
```

**変更内容:**
- 新しいページの追加
- フォームコンポーネントの作成
- APIサービスの実装
- ルーティングの設定

## 🔄 開発フロー

### 新機能追加の手順

1. **データモデル設計**
   ```bash
   # 1. schema.prismaを編集
   # 2. マイグレーション実行
   npm run db:migrate
   ```

2. **バックエンドAPI実装**
   ```bash
   # 1. コントローラー作成
   backend/src/controllers/newController.ts
   
   # 2. ルート定義
   backend/src/routes/newRoutes.ts
   
   # 3. メインサーバーに登録
   # backend/src/index.ts に追加
   ```

3. **フロントエンド実装**
   ```bash
   # 1. APIサービス作成
   frontend/src/services/newService.ts
   
   # 2. ページコンポーネント作成
   frontend/src/pages/NewPage.tsx
   
   # 3. フォームコンポーネント作成（必要に応じて）
   frontend/src/components/NewForm.tsx
   
   # 4. ルーティング追加
   # frontend/src/App.tsx に追加
   ```

## 📋 具体的なカスタマイズ例

### 例1: 商品管理機能の追加

1. **データモデル**
   ```prisma
   model Product {
     id          Int      @id @default(autoincrement())
     name        String
     price       Decimal
     description String?
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```

2. **バックエンド**
   - `backend/src/controllers/productController.ts`
   - `backend/src/routes/productRoutes.ts`

3. **フロントエンド**
   - `frontend/src/services/productService.ts`
   - `frontend/src/pages/ProductsPage.tsx`
   - `frontend/src/components/ProductForm.tsx`

### 例2: 認証機能の追加

1. **データモデル拡張**
   ```prisma
   model User {
     // 既存フィールド
     password String
     role     Role   @default(USER)
   }
   
   enum Role {
     USER
     ADMIN
   }
   ```

2. **バックエンド**
   - `backend/src/controllers/authController.ts`
   - `backend/src/middleware/auth.ts`
   - `backend/src/routes/authRoutes.ts`

3. **フロントエンド**
   - `frontend/src/services/authService.ts`
   - `frontend/src/pages/LoginPage.tsx`
   - `frontend/src/components/ProtectedRoute.tsx`

## 🎯 カスタマイズのポイント

### ✅ 推奨される変更
- データモデルの追加・拡張
- 新しいAPIエンドポイントの追加
- UIコンポーネントの作成・カスタマイズ
- ビジネスロジックの実装
- バリデーションルールの追加

### ⚠️ 注意が必要な変更
- 基本的なサーバー設定の変更
- TypeScript設定の大幅な変更
- ビルド設定の変更
- Docker設定の変更

### ❌ 避けるべき変更
- フレームワークの基本構造の変更
- 依存関係の大幅な変更
- 設定ファイルの不必要な変更

## 📚 参考実装

現在のひな形には以下の参考実装が含まれています：

- **User管理**: 基本的なCRUD操作
- **Post管理**: リレーションを含むCRUD操作
- **フォーム処理**: バリデーション付きフォーム
- **エラーハンドリング**: 統一されたエラー処理
- **型安全性**: TypeScriptによる型定義

これらを参考に、新しい機能を実装してください。

## 🔧 開発時のベストプラクティス

1. **データモデル優先**: まずPrismaスキーマを設計
2. **API設計**: RESTfulな設計を心がける
3. **型安全性**: TypeScriptの型を活用
4. **コンポーネント分割**: 再利用可能なコンポーネントを作成
5. **エラーハンドリング**: 適切なエラー処理を実装
6. **バリデーション**: フロントエンド・バックエンド両方でバリデーション

このアーキテクチャに従うことで、保守性が高く拡張しやすいアプリケーションを構築できます。
