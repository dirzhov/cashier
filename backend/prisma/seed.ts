import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/password'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await hashPassword('admin123')
  const cashierPassword = await hashPassword('cashier123')

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@pos.local',
        password: adminPassword,
        role: 'ADMIN'
      },
      {
        email: 'admin2@pos.local',
        password: adminPassword,
        role: 'ADMIN'
      },
      {
        email: 'cashier@pos.local',
        password: cashierPassword,
        role: 'CASHIER'
      },
      {
        email: 'cashier2@pos.local',
        password: cashierPassword,
        role: 'CASHIER'
      }
    ]
  })

  await prisma.product.createMany({
    data: [
      { name: 'Кофе', price: 150, stock: 100 },
      { name: 'Чай', price: 100, stock: 80 },
      { name: 'Сэндвич', price: 250, stock: 40 },
      { name: 'Пирожок', price: 90, stock: 60 }
    ]
  })

  console.log('✅ Seed completed')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
