import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from './sequelize'

/**
 * ===============================
 * Types
 * ===============================
 */

export interface ProductAttributes {
  id: number
  name: string
  price: number
  stock: number
  image: string | null

  createdAt?: Date
  updatedAt?: Date

}

export type ProductCreationAttributes = Optional<
  ProductAttributes,
  'id' | 'image'
>

/**
 * ===============================
 * Sequelize Model
 * ===============================
 */

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number
  public name!: string
  public price!: number
  public stock!: number
  public image!: string | null

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize: sequelize(),
    tableName: 'Product',
    timestamps: true
  }
)

/**
 * ===============================
 * DAL
 * ===============================
 */

export class ProductDAL {
  /**
   * Create product (default fabric)
   */
  async create(data: Partial<ProductCreationAttributes> = {}) {
    return Product.create({
      name: `Product ${Date.now()}`,
      price: 100,
      stock: 10,
      image: null,
      ...data
    })
  }


  async getById(id: number) {
    const product = await Product.findByPk(id)
    if (!product) throw new Error(`Product with id=${id} not found`)
    return product
  }

  async getByName(name: string) {
    const product = await Product.findOne({ where: { name: `${name}` } })
    if (!product) throw new Error(`Product with name '${name}' not found`)
    return product
  }


  async getAll() {
    return await Product.findAll({ order: [['id', 'ASC']] })
  }


  async update(id: number, patch: Partial<ProductAttributes>) {
    const product = await this.getById(id)
    if (product) {
      await product.update(patch)
    }
    return product
  }


  async delete(id: number) {
    const product = await this.getById(id)
    await product.destroy()
  }

  /**
   * Clear table (for beforeEach)
   */
  async truncate() {
    await Product.destroy({ where: {}, truncate: true, cascade: true })
  }

  async bulk(count = 5) {
    const items = []

    for (let i = 0; i < count; i++) {
      items.push({
        name: `Product ${i}`,
        price: 10 + i,
        stock: 5 + i,
        image: null
      })
    }

    return Product.bulkCreate(items)
  }

  /**
   * Create product with specific name
   */
  async createWithName(name: string) {
    return this.create({ name })
  }

  /**
   * Create product with specific photo
   */
  async createWithImage(path: string) {
    return this.create({ image: path })
  }
}


export const productDAL = new ProductDAL()
