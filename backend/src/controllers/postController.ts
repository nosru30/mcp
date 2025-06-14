import { Request, Response } from 'express'
import { prisma } from '../index'
import { z } from 'zod'

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  authorId: z.number().int().positive('Author ID must be a positive integer'),
})

const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  authorId: z.number().int().positive('Author ID must be a positive integer').optional(),
})

export const postController = {
  // GET /api/posts
  async getAllPosts(req: Request, res: Response): Promise<Response | void> {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
      res.json(posts)
    } catch (error) {
      console.error('Error fetching posts:', error)
      res.status(500).json({ error: 'Failed to fetch posts' })
    }
  },

  // GET /api/posts/:id
  async getPostById(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params
      const postId = parseInt(id)

      if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' })
      }

      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      if (!post) {
        return res.status(404).json({ error: 'Post not found' })
      }

      res.json(post)
    } catch (error) {
      console.error('Error fetching post:', error)
      res.status(500).json({ error: 'Failed to fetch post' })
    }
  },

  // POST /api/posts
  async createPost(req: Request, res: Response): Promise<Response | void> {
    try {
      const validatedData = createPostSchema.parse(req.body)

      // Check if author exists
      const author = await prisma.user.findUnique({
        where: { id: validatedData.authorId }
      })

      if (!author) {
        return res.status(400).json({ error: 'Author not found' })
      }

      const post = await prisma.post.create({
        data: validatedData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      res.status(201).json(post)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.errors 
        })
      }
      console.error('Error creating post:', error)
      res.status(500).json({ error: 'Failed to create post' })
    }
  },

  // PUT /api/posts/:id
  async updatePost(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params
      const postId = parseInt(id)

      if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' })
      }

      const validatedData = updatePostSchema.parse(req.body)

      // Check if post exists
      const existingPost = await prisma.post.findUnique({
        where: { id: postId }
      })

      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' })
      }

      // Check if author exists (if authorId is being updated)
      if (validatedData.authorId) {
        const author = await prisma.user.findUnique({
          where: { id: validatedData.authorId }
        })

        if (!author) {
          return res.status(400).json({ error: 'Author not found' })
        }
      }

      const post = await prisma.post.update({
        where: { id: postId },
        data: validatedData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      res.json(post)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.errors 
        })
      }
      console.error('Error updating post:', error)
      res.status(500).json({ error: 'Failed to update post' })
    }
  },

  // DELETE /api/posts/:id
  async deletePost(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params
      const postId = parseInt(id)

      if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' })
      }

      // Check if post exists
      const existingPost = await prisma.post.findUnique({
        where: { id: postId }
      })

      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' })
      }

      await prisma.post.delete({
        where: { id: postId }
      })

      res.status(204).send()
    } catch (error) {
      console.error('Error deleting post:', error)
      res.status(500).json({ error: 'Failed to delete post' })
    }
  }
}
