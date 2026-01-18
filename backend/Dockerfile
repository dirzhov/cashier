# ---------- build stage ----------
FROM node:24-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

# deps
COPY package*.json ./
RUN npm ci

# prisma
COPY prisma ./prisma

# source
COPY tsconfig.json ./
COPY src ./src

# build
RUN npx prisma generate
RUN npm run build


# ---------- runtime stage ----------
FROM node:24-alpine

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

# deps (only prod)
COPY package*.json ./
RUN npm ci --omit=dev

# prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# build output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate

# uploads directory
RUN mkdir -p /app/uploads

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "dist/server.js"]