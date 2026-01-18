# postgres
DATABASE_URL=postgresql://pos:pos@localhost:5432/pos


cd backend
npm install
npx prisma migrate dev
npm run dev

cd ..

cd frontend
npm install
npm run dev
