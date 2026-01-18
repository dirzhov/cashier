import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './sequelize'
import { Product } from './product.dal'

/**
 * ===============================
 * Types
 * ===============================
 */

export interface SaleAttributes {
  id: number
  productId: number
  quantity: number
  price: number
  total: number
  createdAt?: Date
}

export type SaleCreationAttributes = Optional<SaleAttributes, 'id' | 'total'>

/**
 * ===============================
 * Model
 * ===============================
 */

export class Sale
  extends Model<SaleAttributes, SaleCreationAttributes>
  implements SaleAttributes
{
  public id!: number
  public productId!: number
  public quantity!: number
  public price!: number
  public total!: number

  public readonly createdAt!: Date
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    total: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    sequelize: sequelize(),
    tableName: 'Sale',
    timestamps: true,
    updatedAt: false
  }
)

/**
 * ===============================
 * Relations
 * ===============================
 */

Sale.belongsTo(Product, { foreignKey: 'productId' })

/**
 * ===============================
 * DAL
 * ===============================
 */

export class SalesDAL {

  async create(productId: number, quantity = 1) {
    const product = await Product.findByPk(productId)
    if (!product) throw new Error('Product not found')

    const price = product.price
    const total = price * quantity

    return Sale.create({
      productId,
      quantity,
      price,
      total
    })
  }


  async getAll() {
    return Sale.findAll({ order: [['createdAt', 'DESC']] })
  }

  /**
   * For period (for reports/charts)
   */
  async getBetween(from: Date, to: Date) {
    return Sale.findAll({
      where: {
        createdAt: {
          // @ts-ignore
          $between: [from, to]
        }
      }
    })
  }


  async getTotalRevenue() {
    const rows = await Sale.findAll()

    return rows.reduce((sum, s) => sum + s.total, 0)
  }


  async truncate() {
    await Sale.destroy({ where: {}, truncate: true, cascade: true })
  }


  async seedFakeSales(productId: number, count = 10) {
    for (let i = 0; i < count; i++) {
      await this.create(productId, Math.floor(Math.random() * 3) + 1)
    }
  }
}


export const salesDAL = new SalesDAL()
