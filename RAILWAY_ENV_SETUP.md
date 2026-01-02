# Railway Environment Variables Setup

Your backend crashed because the database environment variables weren't set. Here's how to fix it:

## Step 1: Generate Required Secrets

Before setting variables in Railway, generate these locally:

### JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output - you'll need this.

## Step 2: Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your **backend service**
3. Go to the **"Variables"** tab
4. Add these variables exactly as shown:

### Database Variables (Railway Auto-Provides These)
```
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
```

### Application Variables
```
NODE_ENV=production
PORT=5000
JWT_SECRET=<paste-the-secret-you-generated-above>
JWT_EXPIRES_IN=7d
```

### Email Configuration (Optional but Recommended)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@grip-crm.com
```

### CORS Configuration
```
FRONTEND_URL=https://your-frontend-railway-url.railway.app
```

## Step 3: Verify PostgreSQL Service

1. In your Railway project, make sure you have a **PostgreSQL** service
2. Click on it to verify it's running
3. The service should show connection details

## Step 4: Redeploy

1. Go back to your backend service
2. Click **"Deployments"**
3. Click the three dots on the latest deployment
4. Select **"Redeploy"**

The backend should now connect to the database successfully.

## Troubleshooting

### Still Getting ECONNREFUSED?

1. **Check PostgreSQL is running**: Click on the Postgres service in Railway - it should show "Running"
2. **Verify variables are set**: Go to backend service → Variables, make sure all DB_* variables are there
3. **Check the logs**: Click Deployments → click the deployment → Logs, look for the actual error

### Common Issues

| Error | Solution |
|-------|----------|
| `ECONNREFUSED 127.0.0.1:5432` | DB_HOST is not set correctly. Use `${{Postgres.PGHOST}}` |
| `password authentication failed` | DB_PASSWORD is wrong. Copy from Postgres service variables |
| `database "grip_crm" does not exist` | DB_NAME is wrong. Check Postgres service for correct name |

## Getting Postgres Connection Details

If you need to see what Railway generated for your Postgres:

1. Click on the **PostgreSQL** service in your Railway project
2. Go to **"Variables"** tab
3. You'll see all the connection details:
   - `PGHOST` - the hostname
   - `PGPORT` - the port (usually 5432)
   - `PGUSER` - the username
   - `PGPASSWORD` - the password
   - `PGDATABASE` - the database name

These are what you reference with `${{Postgres.PGHOST}}` etc. in your backend service.

## After Successful Connection

Once the backend connects successfully:

1. The logs should show: `✅ Database connection established`
2. You should see: `🚀 Server running on port 5000`
3. Visit your backend URL + `/api/health` - should return `{"status":"ok",...}`

Then your frontend can connect to the backend!
