import { FastifyReply, FastifyRequest } from 'fastify'

type Role = 'ADMIN' | 'CASHIER'

export const requireRole =
  (roles: Role[]) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify()

    const user = request.user as { role: Role }

    if (!roles.includes(user.role)) {
      reply.code(403).send({ message: 'Forbidden' })
    }
  }

export const adminOnly = requireRole(['ADMIN'])
export const cashierOnly = requireRole(['CASHIER', 'ADMIN'])
