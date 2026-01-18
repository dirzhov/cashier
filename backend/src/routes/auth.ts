import { FastifyInstance } from 'fastify'
import { comparePassword } from '../utils/password'
import { signJwt } from '../utils/jwt'

export default async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string
      password: string
    }

    const user = await app.prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' })
    }

    const valid = await comparePassword(password, user.password)

    if (!valid) {
      return reply.code(401).send({ message: 'Invalid credentials' })
    }

    const token = await signJwt(app, {
      id: user.id,
      email: user.email,
      role: user.role
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    }
  })
}
