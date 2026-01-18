docker compose up postgres -d
docker compose run backend npx prisma migrate dev
