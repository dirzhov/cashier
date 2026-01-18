-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CASHIER');

-- CreateTable
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'CASHIER',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NULL
);

-- CreateTable
CREATE TABLE "Product" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NULL
);

-- CreateTable
CREATE TABLE "Sale" (
  "id" SERIAL PRIMARY KEY,
  "total" DOUBLE PRECISION NOT NULL,
  "userId" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT "Sale_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "User"("id")
    ON DELETE RESTRICT
);

-- CreateTable
CREATE TABLE "SaleItem" (
  "id" SERIAL PRIMARY KEY,
  "saleId" INTEGER NOT NULL,
  "productId" INTEGER NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "qty" INTEGER NOT NULL,

  CONSTRAINT "SaleItem_saleId_fkey"
    FOREIGN KEY ("saleId")
    REFERENCES "Sale"("id")
    ON DELETE CASCADE,

  CONSTRAINT "SaleItem_productId_fkey"
    FOREIGN KEY ("productId")
    REFERENCES "Product"("id")
    ON DELETE RESTRICT
);
