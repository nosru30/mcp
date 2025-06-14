import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/users')
    return response.data
  },

  async getById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const response = await api.post('/users', userData)
    return response.data
  },

  async update(id: number, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}
