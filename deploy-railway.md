# 🚀 Railway Deployment Guide (Easiest Option)

## 📋 Prerequisites
- GitHub account
- Railway account (free tier available)
- Domain name (optional)

## 🔧 Step-by-Step Deployment

### 1. Prepare Your Repository
Your code is already on GitHub, so we're ready!

### 2. Deploy to Railway

#### Backend Deployment:
1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository: `iamsahal77/blog-app_Omnify`
5. Select the `production-ready` branch
6. Set the root directory to `backend`
7. Add environment variables:
   ```
   SECRET_KEY=your-super-secret-production-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-app-name.railway.app
   DATABASE_URL=postgresql://... (Railway will provide this)
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```
8. Deploy!

#### Frontend Deployment:
1. Create another Railway project
2. Select the same repository but set root directory to `frontend`
3. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-domain.railway.app/api
   ```
4. Deploy!

### 3. Database Setup
Railway will automatically create a PostgreSQL database for you.

### 4. Run Migrations
In Railway dashboard:
1. Go to your backend project
2. Click "Deployments" → "Latest"
3. Click "View Logs"
4. Run these commands:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py collectstatic --noinput
   ```

### 5. Custom Domain (Optional)
1. In Railway dashboard, go to "Settings"
2. Click "Domains"
3. Add your custom domain
4. Update CORS settings with your domain

## ✅ Success Checklist
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database migrations completed
- [ ] Superuser created
- [ ] Static files collected
- [ ] API endpoints working
- [ ] Frontend can communicate with backend

## 🔗 Your URLs
- Backend: `https://your-app-name.railway.app`
- Frontend: `https://your-frontend-app.railway.app`
- API: `https://your-app-name.railway.app/api`
- Admin: `https://your-app-name.railway.app/admin`

## 💰 Cost
- Railway free tier: $5/month credit
- Perfect for small to medium applications
- Auto-scales based on usage 