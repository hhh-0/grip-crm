# 🔒 Security Configuration Guide

## ⚠️ IMPORTANT: Before Running in Production

This application contains placeholder credentials that MUST be changed before deployment.

### 1. Environment Variables Setup

#### Backend (.env file)
Copy the `.env.example` to `.env` and update these critical values:

```bash
# 🔴 CHANGE THESE VALUES:
DB_PASSWORD=CHANGE_THIS_PASSWORD
JWT_SECRET=CHANGE_THIS_TO_A_SECURE_RANDOM_STRING_IN_PRODUCTION
SMTP_USER=CHANGE_THIS_TO_YOUR_EMAIL
SMTP_PASS=CHANGE_THIS_TO_YOUR_APP_PASSWORD
```

#### Generate Secure Values:

**JWT Secret (minimum 32 characters):**
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Database Password:**
- Use a strong password with at least 12 characters
- Include uppercase, lowercase, numbers, and special characters
- Never use default passwords like "password123"

### 2. Production Security Checklist

- [ ] Change all default passwords
- [ ] Generate secure JWT secret
- [ ] Configure proper SMTP credentials
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Configure proper logging
- [ ] Set up monitoring

### 3. Files to Never Commit

The following files are already in `.gitignore` but double-check:

```
.env
.env.local
.env.production
*.log
uploads/
backups/
```

### 4. Development vs Production

**Development:**
- Uses placeholder credentials (safe for local development)
- Detailed error messages
- CORS allows localhost

**Production:**
- Must use real, secure credentials
- Generic error messages
- Restricted CORS origins
- HTTPS only
- Rate limiting enabled

### 5. Security Features Already Implemented

✅ **Password Hashing**: bcryptjs with salt rounds
✅ **JWT Authentication**: Secure token-based auth
✅ **Input Validation**: Server-side validation
✅ **CORS Protection**: Configurable origins
✅ **Helmet Security**: Security headers
✅ **Environment Variables**: Sensitive data in .env
✅ **SQL Injection Protection**: TypeORM parameterized queries

### 6. Additional Security Recommendations

1. **Rate Limiting**: Add express-rate-limit for API endpoints
2. **HTTPS**: Use SSL certificates in production
3. **Database Security**: Use connection pooling and read replicas
4. **Monitoring**: Set up error tracking (Sentry, etc.)
5. **Backups**: Automated database backups
6. **Updates**: Keep dependencies updated

## 🚨 Emergency Response

If credentials are accidentally committed:
1. Immediately rotate all affected credentials
2. Remove from git history: `git filter-branch` or BFG Repo-Cleaner
3. Force push to remote repository
4. Notify team members to pull latest changes