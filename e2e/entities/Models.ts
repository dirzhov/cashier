type Role = 'ADMIN' | 'CASHIER'


interface User {
    email: string;
    password: string;
    role: Role;
}

interface Product {
    id: number;
    image?: string;
    name: string;
    price: number;
    stock: number;
}

interface CashItem {
    id: number
    name: string
    price: number
    qty: number
}


export { User, Role, Product, CashItem }