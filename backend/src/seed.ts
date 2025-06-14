import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      name: '田中太郎',
      email: 'tanaka@example.com',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: '佐藤花子',
      email: 'sato@example.com',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: '鈴木一郎',
      email: 'suzuki@example.com',
    },
  })

  console.log('✅ Created users:', { user1, user2, user3 })

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      title: 'フルスタックアプリケーションの開発について',
      content: 'React、Node.js、Prismaを使用したフルスタックアプリケーションの開発は非常に効率的です。型安全性を保ちながら、迅速な開発が可能になります。',
      authorId: user1.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'TypeScriptの利点',
      content: 'TypeScriptを使用することで、開発時にエラーを早期に発見でき、コードの品質が向上します。また、IDEのサポートも充実しており、開発効率が大幅に向上します。',
      authorId: user2.id,
    },
  })

  const post3 = await prisma.post.create({
    data: {
      title: 'Prismaを使ったデータベース操作',
      content: 'Prismaは型安全なORMとして、データベース操作を簡単かつ安全に行うことができます。マイグレーション機能も充実しており、データベーススキーマの管理が容易です。',
      authorId: user3.id,
    },
  })

  const post4 = await prisma.post.create({
    data: {
      title: 'Reactでのコンポーネント設計',
      content: 'Reactでは再利用可能なコンポーネントを作成することで、保守性の高いアプリケーションを構築できます。Hooksを活用することで、状態管理もシンプルになります。',
      authorId: user1.id,
    },
  })

  console.log('✅ Created posts:', { post1, post2, post3, post4 })

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
