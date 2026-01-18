import { buildServer } from '../src/server'

describe('Auth', () => {
  it('login success', async () => {
    const app = await buildServer()

    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'admin@pos.local',
        password: 'admin123'
      }
    })

    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).token).toBeDefined()
  })
})
