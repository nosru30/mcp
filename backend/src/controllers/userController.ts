import { Request, Response } from 'express'
import { prisma } from '../index'
import { z } from 'zod'

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
})

const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
})

export const userController = {
  // GET /api/users
  async getAllUsers(req: Request, res: Response): Promise<Response | void> {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { posts: true }
          }
        }
      })
      res.json(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      res.status(500).json({ error: 'Failed to fetch users' })
    }
  },

  // GET /api/users/:id
  async getUserById(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params
      const userId = parseInt(id)

      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          posts: {
            orderBy: { createdAt: 'desc' }
          }
        }
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json(user)
    } catch (error) {
      console.error('Error fetching user:', error)
      res.status(500).json({ error: 'Failed to fetch user' })
    }
  },

  // POST /api/users
  async createUser(req: Request, res: Response): Promise<Response | void> {
    try {
      const validatedData = createUserSchema.parse(req.body)

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })

      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' })
      }

      const user = await prisma.user.create({
        data: validatedData
      })

      res.status(201).json(user)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.errors 
        })
      }
      console.error('Error creating user:', error)
      res.status(500).json({ error: 'Failed to create user' })
    }
  },

  // PUT /api/users/:id
  async updateUser(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params
      const userId = parseInt(id)

      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' })
      }

      const validatedData = updateUserSchema.parse(req.body)

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Check if email already exists (if email is being updated)
      if (validatedData.email && validatedData.email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email: validatedData.email }
        })

        if (emailExists) {
          return res.status(400).json({ error: 'Email already exists' })
        }
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: validatedData
      })

      res.json(user)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.errors 
        })
      }
      console.error('Error updating user:', error)
      res.status(500).json({ error: 'Failed to update user' })
    }
  },

  // DELETE /api/users/:id
  async deleteUser(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params
      const userId = parseInt(id)

      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' })
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' })
      }

      await prisma.user.delete({
        where: { id: userId }
      })

      res.status(204).send()
    } catch (error) {
      console.error('Error deleting user:', error)
      res.status(500).json({ error: 'Failed to delete user' })
    }
  }
}
