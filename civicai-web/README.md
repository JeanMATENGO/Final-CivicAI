# CivicAI Web - Deployment Guide

## Prerequisites
- Node.js (v18+)

## Environment Variables
Create a `.env.local` or set these in your hosting provider (e.g., Vercel):

```env
NEXT_PUBLIC_API_URL="https://your-api-domain.railway.app/api"
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
```

## Deployment Steps
1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Start the project: `npm start`
