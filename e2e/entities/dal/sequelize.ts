import { Sequelize } from 'sequelize'

export const sequelize = () : Sequelize => new Sequelize(
  process.env.DATABASE_URL ||
    'postgres://pos:pos@postgres:5432/pos',
  {
    dialect: 'postgres',
    logging: false
  }
)
