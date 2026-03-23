# CivicAI API - Deployment Guide

## Prerequisites
- Node.js (v18+)
- Prisma
- A hosted database (PostgreSQL recommended)

## Environment Variables
Create a `.env` file on your hosting provider with the following:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@host:port/dbname" # Change if using Postgres
JWT_SECRET="your-very-secure-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FRONTEND_URL="https://your-frontend-domain.vercel.app"
```

## Deployment Steps
1. Install dependencies: `npm install`
2. Generate Prisma client: `npx prisma generate`
3. Run migrations: `npx prisma migrate deploy`
4. Build the project: `npm run build`
5. Start the server: `npm start`
