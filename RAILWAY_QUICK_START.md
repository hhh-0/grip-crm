# Railway Deployment Quick Start

## TL;DR - 5 Minute Setup

### 1. Prepare Your Code
```bash
# Make sure everything is committed to GitHub
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Create Railway Project
- Go to https://railway.app/dashboard
- Click "New Project" → "Deploy from GitHub"
- Select your grip-crm repository
- Authorize Railway

### 3. Add PostgreSQL
- Click "Add Service" → "PostgreSQL"
- Railway creates it automatically

### 4. Set Environment Variables

In Railway dashboard, click on your backend service and add these variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" locally>
JWT_EXPIRES_IN=7d
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@grip-crm.com
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
FRONTEND_URL=https://your-frontend-railway-url.railway.app
```

### 5. Configure Build & Start

In Railway backend service settings:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run start
```

### 6. Deploy Frontend (Separate Service)

Add another service from your GitHub repo, configure for frontend:

**Build Command:**
```bash
npm install && npm run build --workspace=frontend
```

**Start Command:**
```bash
npm install -g serve && serve -s frontend/dist -l 3000
```

### 7. Connect Frontend to Backend

In frontend service variables, add:
```
VITE_API_URL=https://your-backend-railway-url.railway.app
```

### 8. Done!

Railway automatically deploys on every GitHub push. Check the logs in the dashboard.

## Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check Railway logs - usually missing env vars or TypeScript errors |
| Can't connect to DB | Verify `DATABASE_URL` is set and PostgreSQL service is running |
| Frontend shows blank page | Check `VITE_API_URL` is correct and backend is running |
| File uploads fail | Railway uses ephemeral storage - use S3 or similar for production |

## Get Your URLs

After deployment:
1. Click backend service → "Networking" → copy the URL
2. Click frontend service → "Networking" → copy the URL
3. Update `VITE_API_URL` in frontend with backend URL

## Next Steps

- Read full guide: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
- Set up custom domain (optional)
- Configure backups
- Monitor performance in Railway dashboard
