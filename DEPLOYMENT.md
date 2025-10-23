# Railway Deployment Guide

## Environment Variables Required

För att deploya på Railway behöver du ställa in följande environment variables:

### Required Variables:
- `MONGODB_URI` - Din MongoDB connection string
- `DB_NAME` - Namn på din databas
- `JWT_SECRET` - En säker secret för JWT tokens

### Optional Variables:
- `PORT` - Port för servern (Railway sätter automatiskt)
- `NODE_ENV` - Sätt till "production" för production

## Railway Setup

1. **Connect your repository to Railway**
   - Gå till Railway dashboard
   - Klicka "New Project"
   - Välj "Deploy from GitHub repo"
   - Välj din trullo-backend repository

2. **Set Environment Variables**
   - Gå till din Railway project settings
   - Lägg till alla required environment variables

3. **Deploy**
   - Railway kommer automatiskt bygga och deploya när du pushar till main branch
   - Build command: `npm run build`
   - Start command: `npm start`

## Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Kontrollera att alla TypeScript imports är korrekta
2. **Database connection fails**: Verifiera MONGODB_URI och DB_NAME
3. **JWT errors**: Kontrollera att JWT_SECRET är satt

### Railway Logs:
- Gå till din Railway project dashboard
- Klicka på "Deployments" tab
- Välj din deployment för att se logs
