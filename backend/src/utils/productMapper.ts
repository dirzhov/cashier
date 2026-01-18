import { Product } from '@prisma/client'
import { FastifyRequest } from 'fastify'
import { getBaseUrl } from './url'

export function mapProduct(
  product: Product,
  req: FastifyRequest
) {
  const baseUrl = getBaseUrl(req)

  return {
    ...product,
    image: product.image
      ? `${baseUrl}${product.image}`
      : null
  }
}
