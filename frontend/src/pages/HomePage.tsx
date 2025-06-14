const HomePage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          フルスタックアプリケーションへようこそ
        </h1>
        <p className="text-gray-600 text-lg">
          このアプリケーションは、React + TypeScript（フロントエンド）、
          Node.js + Express + TypeScript（バックエンド）、
          Prisma（ORM）、PostgreSQL（データベース）を使用したフルスタック構成です。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            フロントエンド機能
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• React 18 + TypeScript</li>
            <li>• Vite（高速開発サーバー）</li>
            <li>• Tailwind CSS（スタイリング）</li>
            <li>• React Router（ルーティング）</li>
            <li>• React Query（データフェッチング）</li>
            <li>• React Hook Form（フォーム管理）</li>
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            バックエンド機能
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Node.js + Express + TypeScript</li>
            <li>• Prisma ORM（型安全なDB操作）</li>
            <li>• PostgreSQL（本番）/ SQLite（開発）</li>
            <li>• JWT認証</li>
            <li>• CORS設定</li>
            <li>• 環境変数管理</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">
          開発を始める
        </h2>
        <div className="space-y-2 text-blue-800">
          <p>1. <code className="bg-blue-100 px-2 py-1 rounded">npm run setup</code> - 依存関係をインストール</p>
          <p>2. <code className="bg-blue-100 px-2 py-1 rounded">cp .env.example .env</code> - 環境変数ファイルを作成</p>
          <p>3. <code className="bg-blue-100 px-2 py-1 rounded">npm run db:migrate</code> - データベースをセットアップ</p>
          <p>4. <code className="bg-blue-100 px-2 py-1 rounded">npm run dev</code> - 開発サーバーを起動</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
