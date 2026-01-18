import { sequelize } from './entities/dal/sequelize'
import fs from 'fs'

const seq = sequelize()


async function waitForDB(retries = 3, delay = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      await seq.authenticate()
      console.log('✅ Postgres connected')
      return
    } catch (err) {
      console.log(`⏳ Waiting for DB... (${i + 1}/${retries})`)
      await new Promise((r) => setTimeout(r, delay))
    }
  }

  throw new Error('❌ Cannot connect to Postgres')
}

export default async () => {
  console.log('\n🔵 Global setup started')

  await waitForDB();

  fs.rmSync('.nyc_output', { recursive: true, force: true });
  fs.mkdirSync('.nyc_output', { recursive: true });

  console.log('🚀 Global setup finished\n')
}
