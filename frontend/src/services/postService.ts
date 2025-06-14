import axios from 'axios'

const API_BASE_URL = __API_BASE_URL__

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Post {
  id: number
  title: string
  content: string
  authorId: number
  author?: {
    name: string
  }
  createdAt: string
}

export const postService = {
  async getAll(): Promise<Post[]> {
    const response = await api.get('/posts')
    return response.data
  },

  async getById(id: number): Promise<Post> {
    const response = await api.get(`/posts/${id}`)
    return response.data
  },

  async create(postData: Omit<Post, 'id' | 'createdAt' | 'author'>): Promise<Post> {
    const response = await api.post('/posts', postData)
    return response.data
  },

  async update(id: number, postData: Partial<Post>): Promise<Post> {
    const response = await api.put(`/posts/${id}`, postData)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/posts/${id}`)
  },
}
