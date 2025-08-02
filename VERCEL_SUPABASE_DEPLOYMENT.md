# 🚀 Vercel + Supabase Deployment (Completely Free)

## 🎯 **Why This Combo?**
- ✅ **Vercel**: Free hosting for frontend (React)
- ✅ **Supabase**: Free PostgreSQL database
- ✅ **Railway**: Free backend hosting
- ✅ **No credit card required** for any service
- ✅ **Automatic deployments**

## 📋 **Prerequisites**
- GitHub account (you already have this)
- Vercel account (free)
- Railway account (free)
- Supabase account (free)

## 🔧 **Step-by-Step Deployment**

### **Step 1: Deploy Backend to Railway**

#### **1.1 Sign Up for Railway**
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub (no credit card required)
3. Create new project from GitHub repo: `iamsahal77/blog-app_Omnify`
4. Set root directory to: `backend`
5. Deploy

#### **1.2 Configure Backend Environment**
Add these environment variables in Railway:
```
SECRET_KEY=django-insecure-your-super-secret-key
DEBUG=False
ALLOWED_HOSTS=your-app-name.railway.app
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### **Step 2: Setup Database with Supabase**

#### **2.1 Create Supabase Project**
1. Go to [Supabase.com](https://supabase.com)
2. Sign up with GitHub (free tier)
3. Create new project
4. Get your database URL

#### **2.2 Connect Database to Railway**
Add this environment variable to Railway backend:
```
DATABASE_URL=postgresql://postgres:password@host:port/postgres
```
(Use the URL from Supabase)

### **Step 3: Deploy Frontend to Vercel**

#### **3.1 Sign Up for Vercel**
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub (free tier)
3. Import your repository: `iamsahal77/blog-app_Omnify`

#### **3.2 Configure Frontend**
1. Set **Root Directory** to: `frontend`
2. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend.railway.app/api
   ```
3. Deploy

### **Step 4: Setup Database**

#### **4.1 Run Migrations**
In Railway shell:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

### **Step 5: Test Your Application**

#### **5.1 Test Backend**
- Visit: `https://your-railway-backend.railway.app`
- Test API: `https://your-railway-backend.railway.app/api/`

#### **5.2 Test Frontend**
- Visit: `https://your-vercel-app.vercel.app`
- Test all features

## 🔗 **Your URLs**
- **Frontend**: `https://your-vercel-app.vercel.app`
- **Backend**: `https://your-railway-backend.railway.app`
- **API**: `https://your-railway-backend.railway.app/api`
- **Admin**: `https://your-railway-backend.railway.app/admin`

## 💰 **Cost: FREE!**
- **Vercel**: Free tier for frontend
- **Railway**: $5/month free credit for backend
- **Supabase**: Free tier for database
- **No credit card required** for any service

## 🎉 **Success Checklist**
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] Database connected (Supabase)
- [ ] Environment variables configured
- [ ] API endpoints working
- [ ] All features tested

**This combo gives you the best of all worlds - completely free!** 🚀 