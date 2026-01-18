import { buildServer } from '../src/server'

describe('Sales', () => {
  it('reject empty sale', async () => {
    const app = await buildServer()

    const login = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'cashier@pos.local',
        password: 'cashier123'
      }
    })

    const token = JSON.parse(login.body).token

    const res = await app.inject({
      method: 'POST',
      url: '/sales',
      headers: {
        authorization: `Bearer ${token}`
      },
      payload: { items: [] }
    })

    expect(res.statusCode).toBe(400)
  })
})
