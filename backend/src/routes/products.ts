import { FastifyInstance } from 'fastify'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import { adminOnly } from '../middlewares/rbac'
import { getBaseUrl } from '../utils/url'
import { mapProduct } from '../utils/productMapper'


export default async function productRoutes(app: FastifyInstance) {
  const uploadDir = path.join(process.cwd(), 'uploads')
  fs.mkdirSync(uploadDir, { recursive: true })

  app.get('/', async () => {
    return app.prisma.product.findMany()
  })

  /* ----------- GET all ----------- */
  app.get(
    '/products',
    { preHandler: app.authenticate },
    async (req, reply) => {
      const baseUrl = getBaseUrl(req)

      const products = await app.prisma.product.findMany()

      reply.send(
        products.map(p => mapProduct(p, req))
      )
    }
  )

  /* ----------- CREATE ----------- */
  app.post(
    '/products',
    { preHandler: adminOnly },
    async (request) => {
      const { name, price, stock } = request.body as {
        name: string
        price: number
        stock: number
      }

      return app.prisma.product.create({
        data: { name, price, stock }
      })
    }
  )

  /* ----------- UPDATE ----------- */
  app.put(
    '/products/:id',
    { preHandler: adminOnly },
    async (request) => {
      const id = Number((request.params as any).id)
      const { name, price, stock } = request.body as {
        name: string
        price: number
        stock: number
      }

      return app.prisma.product.update({
        where: { id },
        data: { name, price, stock }
      })
    }
  )

  /* ----------- DELETE ----------- */
  app.delete(
    '/products/:id',
    { preHandler: adminOnly },
    async (request, reply) => {
      const id = Number((request.params as any).id)

      await app.prisma.product.delete({
        where: { id }
      })

      reply.code(204).send()
    }
  )

  /* ----------- UPLOAD IMAGE ----------- */
  app.post(
    '/products/:id/image',
    { preHandler: adminOnly },
    async (req, reply) => {
      const baseUrl = getBaseUrl(req)
      const id = Number((req.params as any).id)
      const file = await req.file()

      if (!file) {
        throw new Error('No file')
      }

      const filename = `${id}-${Date.now()}-${file.filename}`
      const filepath = path.join(uploadDir, filename)

      await pipeline(file.file, fs.createWriteStream(filepath))

      const product = await app.prisma.product.update({
        where: { id },
        data: {
          image: `/uploads/${filename}`
        }
      })

      reply.send(mapProduct(product, req))
    }
  )

}
