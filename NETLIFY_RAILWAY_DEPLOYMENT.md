# 🚀 Netlify + Railway Deployment (Completely Free)

## 🎯 **Why This Combo?**
- ✅ **Netlify**: Free hosting for frontend (React)
- ✅ **Railway**: Free backend hosting with database
- ✅ **No credit card required** for either service
- ✅ **Automatic deployments** from GitHub
- ✅ **SSL certificates** automatically

## 📋 **Prerequisites**
- GitHub account (you already have this)
- Netlify account (free)
- Railway account (free)

## 🔧 **Step-by-Step Deployment**

### **Step 1: Deploy Backend to Railway**

#### **1.1 Sign Up for Railway**
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub (no credit card required)
3. Create new project from GitHub repo: `iamsahal77/blog-app_Omnify`
4. Set root directory to: `backend`
5. Deploy

#### **1.2 Add PostgreSQL Database**
1. In Railway dashboard, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway will automatically provide `DATABASE_URL`
3. Your backend will automatically use this database

#### **1.3 Configure Backend Environment**
Add these environment variables in Railway:
```
SECRET_KEY=django-insecure-your-super-secret-key
DEBUG=False
ALLOWED_HOSTS=your-app-name.railway.app
CORS_ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
```

### **Step 2: Deploy Frontend to Netlify**

#### **2.1 Sign Up for Netlify**
1. Go to [Netlify.com](https://netlify.com)
2. Sign up with GitHub (free tier)
3. Click **"New site from Git"**

#### **2.2 Configure Frontend**
1. Connect your repository: `iamsahal77/blog-app_Omnify`
2. Set **Base directory** to: `frontend`
3. Set **Build command** to: `npm install && npm run build`
4. Set **Publish directory** to: `dist`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend.railway.app/api
   ```
6. Deploy

### **Step 3: Setup Database**

#### **3.1 Run Migrations**
In Railway shell:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

### **Step 4: Test Your Application**

#### **4.1 Test Backend**
- Visit: `https://your-railway-backend.railway.app`
- Test API: `https://your-railway-backend.railway.app/api/`

#### **4.2 Test Frontend**
- Visit: `https://your-netlify-app.netlify.app`
- Test all features

## 🔗 **Your URLs**
- **Frontend**: `https://your-netlify-app.netlify.app`
- **Backend**: `https://your-railway-backend.railway.app`
- **API**: `https://your-railway-backend.railway.app/api`
- **Admin**: `https://your-railway-backend.railway.app/admin`

## 💰 **Cost: FREE!**
- **Netlify**: Free tier for frontend
- **Railway**: $5/month free credit for backend + database
- **No credit card required** for either service

## 🎉 **Success Checklist**
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Netlify
- [ ] Database connected (Railway PostgreSQL)
- [ ] Environment variables configured
- [ ] API endpoints working
- [ ] All features tested

**This combo is completely free and reliable!** 🚀 