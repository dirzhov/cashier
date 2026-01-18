import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './sequelize'


export type Role = 'ADMIN' | 'CASHIER'

export interface UserAttributes {
  id: number
  email: string
  password: string
  role: Role
  // createdAt?: Date
  // updatedAt?: Date
}

export type UserCreationAttributes = Optional<UserAttributes, 'id'>


export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number
  public email!: string
  public password!: string
  public role!: 'ADMIN' | 'CASHIER'

  // public readonly createdAt!: Date
  // public readonly updatedAt!: Date
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: sequelize(),
    tableName: 'User',
    timestamps: true
  }
)

/**
 * ===============================
 * DAL
 * ===============================
 */

export class UserDAL {
  /**
   * Создать пользователя
   */
  async create(data: Partial<UserCreationAttributes> = {}) {
    return User.create({
      email: `user_${Date.now()}@test.local`,
      password: 'password',
      role: 'CASHIER',
      ...data
    })
  }


  async getById(id: number) {
    const user = await User.findByPk(id)
    if (!user) throw new Error('User not found')
    return user
  }


  async getByEmail(email: string) {
    return User.findOne({ where: { email } })
  }


  async update(id: number, patch: Partial<UserAttributes>) {
    const user = await this.getById(id)
    await user.update(patch)
    return user
  }


  async delete(id: number) {
    const user = await this.getById(id)
    await user.destroy()
  }


  async truncate() {
    await User.destroy({ where: {}, truncate: true, cascade: true })
  }


  async createAdmin() {
    return this.create({
      email: `admin_${Date.now()}@test.local`,
      role: 'ADMIN'
    })
  }

  async createCashier() {
    return this.create({
      email: `cashier_${Date.now()}@test.local`,
      role: 'CASHIER'
    })
  }
}


export const userDAL = new UserDAL()
