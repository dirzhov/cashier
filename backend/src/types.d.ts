import '@fastify/jwt'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    authenticate: any
  }

  interface FastifyRequest {
    user: {
      id: number
      email: string
      role: 'ADMIN' | 'CASHIER'
    }
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: number
      email: string
      role: 'ADMIN' | 'CASHIER'
    }
    user: {
      id: number
      email: string
      role: 'ADMIN' | 'CASHIER'
    }
  }
}
