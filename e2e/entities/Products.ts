import { Product } from "./Models";

export enum SortField { name = 'name', price = 'price', stock = 'stock' }

export const product1: Product = { id: 1, name: 'Кофе', price: 150, stock: 100 }
export const product2: Product = { id: 2, name: 'Чай', price: 100, stock: 80 }
export const product3: Product = { id: 3, name: 'Сэндвич', price: 250, stock: 40 }
export const product4: Product = { id: 4, name: 'Пирожок', price: 90, stock: 60 }
