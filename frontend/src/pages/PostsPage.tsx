import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { postService } from '../services/postService'
import PostForm from '../components/PostForm'

interface Post {
  id: number
  title: string
  content: string
  authorId: number
  author?: {
    name: string
  }
  createdAt: string
}

const PostsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const queryClient = useQueryClient()

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: postService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: postService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setIsFormOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Post> }) =>
      postService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setEditingPost(null)
      setIsFormOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: postService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setIsFormOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('この投稿を削除しますか？')) {
      deleteMutation.mutate(id)
    }
  }

  const handleFormSubmit = (data: Omit<Post, 'id' | 'createdAt' | 'author'>) => {
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingPost(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">エラーが発生しました: {(error as Error).message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">投稿管理</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>新規投稿</span>
        </button>
      </div>

      <div className="grid gap-6">
        {posts?.map((post: Post) => (
          <div key={post.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500">
                  作成者: {post.author?.name || '不明'} | 
                  作成日: {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-gray-700">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>
        ))}
      </div>

      {posts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">投稿がありません</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            最初の投稿を作成
          </button>
        </div>
      )}

      {isFormOpen && (
        <PostForm
          post={editingPost}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
        />
      )}
    </div>
  )
}

export default PostsPage
