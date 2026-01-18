declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    authenticate: any
  }
}

import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import path from 'path'

import { PrismaClient } from '@prisma/client'

import authRoutes from './routes/auth'
import productRoutes from './routes/products'
import salesRoutes from './routes/sales'
import reportsRoutes from './routes/reports'


export async function buildServer() {
  const prisma = new PrismaClient()

  const app = Fastify({
    logger: true
  })

  /* -------------------- Plugins -------------------- */

  await app.register(cors, {
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'secret'
  })

  await app.register(multipart)

  /* -------------------- Decorators -------------------- */

  app.decorate('prisma', prisma)

  app.decorate(
    'authenticate',
    async (request: any, reply: any) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  )


  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
    decorateReply: false
  })


  /* -------------------- Healthcheck -------------------- */

  app.get('/health', async () => ({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }))

  /* -------------------- Routes -------------------- */

  app.register(authRoutes)
  app.register(productRoutes)
  app.register(salesRoutes)
  app.register(reportsRoutes)

  return app
}

const start = async () => {
  const app = await buildServer()
  await app.listen({
    port: Number(process.env.PORT) || 3000,
    host: '0.0.0.0'
  })
}

start()
