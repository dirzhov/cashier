import { FastifyInstance } from 'fastify'

export type JwtUserPayload = {
  id: number
  email: string
  role: 'ADMIN' | 'CASHIER'
}

/**
 * Генерация JWT
 */
export const signJwt = async (
  app: FastifyInstance,
  payload: JwtUserPayload
): Promise<string> => {
  return app.jwt.sign(payload, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  })
}

/**
 * Валидация JWT (вне request lifecycle)
 * Полезно для тестов, cron, internal calls
 */
export const verifyJwt = async (
  app: FastifyInstance,
  token: string
): Promise<JwtUserPayload> => {
  return app.jwt.verify<JwtUserPayload>(token)
}
