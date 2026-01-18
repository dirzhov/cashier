# POS Backend

Backend для системы учёта и продажи товаров.

## 🚀 Стек
- Node.js 20
- TypeScript
- Fastify
- Prisma
- PostgreSQL
- JWT (RBAC)
- Docker
- CI/CD (GitHub Actions)

## 📁 Структура
- `src/server.ts` — сборка приложения
- `src/main.ts` — запуск сервера
- `src/routes` — роуты API
- `src/middlewares` — RBAC / auth
- `prisma` — схема, миграции, seed

## 🧪 Dev
```bash
npm install
npm run dev
