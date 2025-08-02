@echo off
REM 🚀 Blog App Deployment Preparation Script for Windows
REM This script prepares your application for production deployment

echo 🚀 Starting deployment preparation...

REM Check if we're in the right directory
if not exist "backend\manage.py" (
    echo [ERROR] Please run this script from the blog_app root directory
    pause
    exit /b 1
)

echo [INFO] Preparing backend for deployment...

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

REM Create media directory
echo [INFO] Creating media directory...
if not exist "media" mkdir media

echo [SUCCESS] Backend preparation completed!

REM Frontend preparation
echo [INFO] Preparing frontend for deployment...

cd ..\frontend

REM Install dependencies
echo [INFO] Installing frontend dependencies...
npm install

REM Build for production
echo [INFO] Building frontend for production...
npm run build

echo [SUCCESS] Frontend preparation completed!

cd ..

echo [SUCCESS] Deployment preparation completed!
echo.
echo 🎯 Next Steps:
echo 1. Edit backend\.env with your production values
echo 2. Choose your deployment platform
echo 3. Follow the deployment guide for your chosen platform
echo 4. Test your deployed application
echo.
echo 📚 Available guides:
echo - deploy-railway.md (Easiest)
echo - PRODUCTION_README.md (Advanced)
echo - DEPLOYMENT_CHECKLIST.md (Checklist)
echo.
pause 