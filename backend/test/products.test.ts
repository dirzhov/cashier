import { buildServer } from '../src/server'

describe('Products', () => {
  it('forbidden without token', async () => {
    const app = await buildServer()

    const res = await app.inject({
      method: 'GET',
      url: '/products'
    })

    expect(res.statusCode).toBe(401)
  })
})
