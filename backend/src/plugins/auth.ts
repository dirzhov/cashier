import fp from 'fastify-plugin'


export default fp(async (app) => {
app.register(import('@fastify/jwt'), {
secret: 'supersecret'
})


app.decorate('auth', async (req: any) => {
await req.jwtVerify()
})
})
