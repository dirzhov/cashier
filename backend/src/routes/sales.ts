import { FastifyInstance } from 'fastify'
import { cashierOnly } from '../middlewares/rbac'

export default async function salesRoutes(app: FastifyInstance) {
  /**
   * Создание продажи (чека)
   */
  app.post(
    '/sales',
    { preHandler: cashierOnly },
    async (request, reply) => {
      const user = request.user
      const { items } = request.body as {
        items: { productId: number; qty: number }[]
      }

      if (!items || items.length === 0) {
        return reply.code(400).send({ message: 'Empty sale' })
      }

      const products = await app.prisma.product.findMany({
        where: {
          id: { in: items.map(i => i.productId) }
        }
      })

      let total = 0

      const saleItemsData = items.map(i => {
        const product = products.find(p => p.id === i.productId)
        if (!product) {
          throw new Error(`Product ${i.productId} not found`)
        }

        if (product.stock < i.qty) {
          throw new Error(`Not enough stock for ${product.name}`)
        }

        total += product.price * i.qty

        return {
          productId: product.id,
          price: product.price,
          qty: i.qty
        }
      })

      const sale = await app.prisma.$transaction(async (tx) => {
        const createdSale = await tx.sale.create({
          data: {
            total,
            userId: user.id,
            items: {
              create: saleItemsData
            }
          }
        })

        for (const item of saleItemsData) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.qty }
            }
          })
        }

        return createdSale
      })

      return sale
    }
  )

  /**
   * Получение списка продаж
   */
  app.get(
    '/sales',
    { preHandler: cashierOnly },
    async () => {
      return app.prisma.sale.findMany({
        include: {
          user: { select: { email: true } },
          items: true
        },
        orderBy: { createdAt: 'desc' }
      })
    }
  )
}
