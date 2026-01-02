# Deploying Grip CRM to Railway

This guide walks you through deploying the Grip CRM application to [Railway.app](https://railway.app).

## Prerequisites

- Railway account (sign up at https://railway.app)
- GitHub repository with your Grip CRM code
- Git installed locally

## Step 1: Prepare Your Repository

### 1.1 Update .gitignore

Ensure your `.gitignore` excludes sensitive files:

```
node_modules/
dist/
.env
.env.local
.env.*.local
uploads/
backups/
```

### 1.2 Create Production Environment Files

Create `backend/.env.production` (don't commit this, use Railway's environment variables instead):

```
NODE_ENV=production
PORT=5000
```

The rest of the environment variables will be set in Railway's dashboard.

### 1.3 Ensure Procfile Exists (Optional but Recommended)

Create a `Procfile` in the root directory:

```
web: npm run start
```

This tells Railway how to start your application.

## Step 2: Set Up Railway Project

### 2.1 Create a New Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize Railway to access your GitHub account
5. Select your Grip CRM repository

### 2.2 Add PostgreSQL Database

1. In your Railway project, click "Add Service"
2. Select "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance

## Step 3: Configure Environment Variables

### 3.1 Set Backend Environment Variables

In the Railway dashboard, go to your project and set these variables for the backend service:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=<generate-a-secure-random-string>
JWT_EXPIRES_IN=7d

# Database (Railway auto-generates these, but you can reference them)
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email@gmail.com>
SMTP_PASS=<your-app-password>
FROM_EMAIL=noreply@grip-crm.com

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# CORS - Update with your frontend URL
FRONTEND_URL=${{Railway.FRONTEND_URL}}
```

### 3.2 Generate JWT Secret

Generate a secure random string for JWT_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.3 Email Configuration

For Gmail:
1. Enable 2-factor authentication on your Gmail account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the app password in `SMTP_PASS`

## Step 4: Configure Build and Start Commands

### 4.1 Set Build Command

In Railway's service settings, set the build command:

```bash
npm install && npm run build
```

### 4.2 Set Start Command

Set the start command:

```bash
npm run start
```

## Step 5: Deploy Frontend

### 5.1 Create a Separate Service for Frontend

1. In your Railway project, click "Add Service"
2. Select "GitHub" and choose your repository again
3. Configure this service for the frontend

### 5.2 Frontend Environment Variables

Set these variables for the frontend service:

```
VITE_API_URL=${{Railway.BACKEND_URL}}
```

### 5.3 Frontend Build and Start Commands

Build command:
```bash
npm install && npm run build --workspace=frontend
```

Start command (for serving the built frontend):
```bash
npm install -g serve && serve -s frontend/dist -l 3000
```

Or use a simple Node.js server. Create `frontend-server.js`:

```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(3000, () => {
  console.log('Frontend server running on port 3000');
});
```

Then set start command to:
```bash
node frontend-server.js
```

## Step 6: Database Migrations

### 6.1 Run Migrations on Deploy

If you have database migrations, add a deployment hook:

1. In Railway dashboard, go to your backend service
2. Add a deployment command that runs migrations before starting:

```bash
npm run migrate && npm run start
```

Or if migrations are automatic via TypeORM, they'll run on startup.

## Step 7: Configure Networking

### 7.1 Connect Services

1. In Railway dashboard, click on your backend service
2. Go to "Variables"
3. Add a reference to your PostgreSQL service:
   - Railway automatically provides `${{Postgres.DATABASE_URL}}`

### 7.2 Set Frontend API URL

In your frontend service variables, set:
```
VITE_API_URL=https://<your-backend-railway-url>
```

You can find your backend URL in the Railway dashboard under the service's "Networking" tab.

## Step 8: Deploy

### 8.1 Trigger Deployment

1. Push your code to GitHub
2. Railway will automatically detect the push and start building
3. Monitor the deployment in the Railway dashboard

### 8.2 Monitor Logs

Click on each service to view real-time logs and debug any issues.

## Step 9: Post-Deployment

### 9.1 Verify Services

1. Visit your frontend URL
2. Test login functionality
3. Verify database connectivity
4. Test file uploads

### 9.2 Set Up Custom Domain (Optional)

1. In Railway dashboard, go to your frontend service
2. Click "Networking"
3. Add a custom domain
4. Update DNS records with your domain provider

### 9.3 Enable HTTPS

Railway automatically provides HTTPS for Railway domains. For custom domains, SSL is also automatic.

## Troubleshooting

### Build Fails

Check the build logs in Railway dashboard. Common issues:
- Missing environment variables
- TypeScript compilation errors
- Missing dependencies

### Database Connection Issues

1. Verify `DATABASE_URL` is set correctly
2. Check PostgreSQL service is running
3. Ensure database migrations have run

### Frontend Can't Connect to Backend

1. Verify `VITE_API_URL` is set to the correct backend URL
2. Check CORS configuration in backend
3. Ensure `FRONTEND_URL` environment variable matches your frontend URL

### File Upload Issues

1. Railway uses ephemeral storage - files are deleted on redeploy
2. Consider using cloud storage (AWS S3, Cloudinary, etc.)
3. Update `ExportService` and `BackupService` to use cloud storage

## Production Recommendations

1. **Use Cloud Storage**: Replace local file uploads with S3 or similar
2. **Enable Backups**: Set up PostgreSQL automated backups in Railway
3. **Monitor Performance**: Use Railway's metrics dashboard
4. **Set Up Alerts**: Configure notifications for deployment failures
5. **Use Environment-Specific Configs**: Keep production secrets secure
6. **Enable HTTPS**: Already done by Railway
7. **Rate Limiting**: Add rate limiting middleware to prevent abuse
8. **Database Backups**: Enable automatic backups in Railway PostgreSQL settings

## Scaling

As your app grows:

1. **Vertical Scaling**: Increase Railway service resources
2. **Horizontal Scaling**: Add multiple backend instances with load balancing
3. **Database Optimization**: Add indexes, optimize queries
4. **Caching**: Implement Redis for session/data caching

## Cost Optimization

- Railway charges per resource usage (CPU, memory, storage)
- Start with minimal resources and scale as needed
- Use Railway's free tier for development/testing
- Monitor usage in the Railway dashboard

## Support

- Railway Docs: https://docs.railway.app
- Railway Community: https://railway.app/community
- Grip CRM Issues: Check your repository's issue tracker
