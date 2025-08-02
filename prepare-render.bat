@echo off
REM 🚀 Render Deployment Preparation Script
REM This script prepares your blog app for Render deployment

echo 🚀 Preparing for Render deployment...

REM Check if we're in the right directory
if not exist "backend\manage.py" (
    echo [ERROR] Please run this script from the blog_app root directory
    pause
    exit /b 1
)

echo [INFO] Preparing backend for Render...

REM Backend preparation
cd backend

REM Create production environment file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating .env file from template...
    copy env.example .env
    echo [WARNING] Please edit .env file with your production values
) else (
    echo [SUCCESS] .env file already exists
)

REM Install production dependencies
echo [INFO] Installing production dependencies...
pip install -r requirements_production.txt

REM Run migrations
echo [INFO] Running database migrations...
python manage.py migrate

REM Collect static files
echo [INFO] Collecting static files...
python manage.py collectstatic --noinput

echo [SUCCESS] Backend preparation completed!

REM Frontend preparation
echo [INFO] Preparing frontend for Render...

cd ..\frontend

REM Install dependencies
echo [INFO] Installing frontend dependencies...
npm install

REM Build for production
echo [INFO] Building frontend for production...
npm run build

echo [SUCCESS] Frontend preparation completed!

cd ..

echo [SUCCESS] Render deployment preparation completed!
echo.
echo 🎯 Next Steps for Render Deployment:
echo.
echo 1. Go to https://render.com and sign up
echo 2. Create a new Web Service for backend:
echo    - Repository: iamsahal77/blog-app_Omnify
echo    - Branch: production-ready
echo    - Root Directory: backend
echo    - Build Command: pip install -r requirements_production.txt
echo    - Start Command: gunicorn blog_backend.wsgi:application
echo.
echo 3. Create a PostgreSQL database in Render
echo.
echo 4. Create a Static Site for frontend:
echo    - Repository: iamsahal77/blog-app_Omnify
echo    - Branch: production-ready
echo    - Root Directory: frontend
echo    - Build Command: npm install && npm run build
echo    - Publish Directory: dist
echo.
echo 5. Configure environment variables (see RENDER_DEPLOYMENT_GUIDE.md)
echo.
echo 6. Run database migrations in Render shell
echo.
echo 📚 Check RENDER_DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause 