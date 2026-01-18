import { FastifyRequest } from 'fastify'

export function getBaseUrl(req: FastifyRequest): string {
  const proto =
    (req.headers['x-forwarded-proto'] as string) ||
    req.protocol

  const host =
    (req.headers['x-forwarded-host'] as string) ||
    req.headers.host

  return `${proto}://${host}`
}
