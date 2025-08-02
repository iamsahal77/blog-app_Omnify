#!/bin/bash

# 🚀 Blog App Deployment Preparation Script
# This script prepares your application for production deployment

echo "🚀 Starting deployment preparation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "backend/manage.py" ]; then
    print_error "Please run this script from the blog_app root directory"
    exit 1
fi

print_status "Preparing backend for deployment..."

# Backend preparation
cd backend

# Create production environment file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cp env.example .env
    print_warning "Please edit .env file with your production values"
else
    print_success ".env file already exists"
fi

# Install production dependencies
print_status "Installing production dependencies..."
pip install -r requirements_production.txt

# Run migrations
print_status "Running database migrations..."
python manage.py migrate

# Collect static files
print_status "Collecting static files..."
python manage.py collectstatic --noinput

# Create media directory
print_status "Creating media directory..."
mkdir -p media
chmod 755 media

print_success "Backend preparation completed!"

# Frontend preparation
print_status "Preparing frontend for deployment..."

cd ../frontend

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

# Build for production
print_status "Building frontend for production..."
npm run build

print_success "Frontend preparation completed!"

# Generate deployment checklist
cd ..
print_status "Generating deployment checklist..."

cat > DEPLOYMENT_CHECKLIST.md << 'EOF'
# 📋 Deployment Checklist

## ✅ Pre-Deployment Checklist
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Database migrations completed
- [ ] Static files collected
- [ ] Frontend built for production
- [ ] Environment variables configured
- [ ] .env file created and configured

## 🔧 Environment Variables to Configure

### Backend (.env file)
```
SECRET_KEY=your-super-secret-production-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=postgresql://user:password@host:port/dbname
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Frontend (Environment variables)
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## 🚀 Deployment Options

### Option 1: Railway (Recommended for beginners)
1. Follow deploy-railway.md guide
2. Deploy backend first
3. Deploy frontend second
4. Configure environment variables

### Option 2: Render
1. Create Render account
2. Connect GitHub repository
3. Configure build settings
4. Set environment variables

### Option 3: Heroku
1. Create Heroku account
2. Install Heroku CLI
3. Create apps for backend and frontend
4. Deploy using git push

### Option 4: VPS/Server
1. Follow PRODUCTION_README.md guide
2. Set up server with nginx
3. Configure SSL certificates
4. Deploy manually

## 🔍 Post-Deployment Testing
- [ ] Backend API accessible
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Blog creation works
- [ ] Blog viewing works
- [ ] Admin interface accessible
- [ ] File uploads work
- [ ] CORS issues resolved
- [ ] SSL/HTTPS working

## 🛠️ Troubleshooting
- Check application logs
- Verify environment variables
- Test database connection
- Check CORS settings
- Verify API endpoints
EOF

print_success "Deployment preparation completed!"
print_success "Check DEPLOYMENT_CHECKLIST.md for next steps"

echo ""
echo "🎯 Next Steps:"
echo "1. Edit backend/.env with your production values"
echo "2. Choose your deployment platform"
echo "3. Follow the deployment guide for your chosen platform"
echo "4. Test your deployed application"
echo ""
echo "📚 Available guides:"
echo "- deploy-railway.md (Easiest)"
echo "- PRODUCTION_README.md (Advanced)"
echo "- DEPLOYMENT_CHECKLIST.md (Checklist)" 