import { FastifyInstance } from 'fastify'
import { adminOnly } from '../middlewares/rbac'

export default async function reportsRoutes(app: FastifyInstance) {
  /**
   * Сводка
   */
  app.get(
    '/reports/summary',
    { preHandler: adminOnly },
    async () => {
      const totalSales = await app.prisma.sale.aggregate({
        _sum: { total: true },
        _count: { id: true }
      })

      const productsCount = await app.prisma.product.count()
      const usersCount = await app.prisma.user.count()

      return {
        revenue: totalSales._sum.total || 0,
        salesCount: totalSales._count.id,
        productsCount,
        usersCount
      }
    }
  )

  /**
   * Продажи по дням (для графиков)
   */
  app.get(
    '/reports/sales-by-day',
    { preHandler: adminOnly },
    async () => {
      const result = await app.prisma.$queryRaw<
        { day: string; total: number }[]
      >`
        SELECT
          DATE("createdAt") AS day,
          SUM(total)::float AS total
        FROM "Sale"
        GROUP BY day
        ORDER BY day
      `

      return result
    }
  )

  /**
   * Топ товаров
   */
  app.get(
    '/reports/top-products',
    { preHandler: adminOnly },
    async () => {
      const result = await app.prisma.$queryRaw<
        { name: string; qty: number }[]
      >`
        SELECT
          p.name,
          SUM(si.qty)::int AS qty
        FROM "SaleItem" si
        JOIN "Product" p ON p.id = si."productId"
        GROUP BY p.name
        ORDER BY qty DESC
        LIMIT 10
      `

      return result
    }
  )
}
