# 🚀 Production Deployment Guide

## 📋 Overview
This guide provides step-by-step instructions for deploying the Blog Application to production.

## 🔧 Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL database
- Web server (nginx/apache)
- SSL certificate
- Domain name

## 🏗️ Backend Deployment

### 1. Environment Setup
```bash
# Copy environment template
cp backend/env.example backend/.env

# Edit .env file with your production values
nano backend/.env
```

**Required Environment Variables:**
```env
SECRET_KEY=your-super-secret-production-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DB_NAME=blog_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=https://your-domain.com
```

### 2. Database Setup
```bash
# Install PostgreSQL dependencies
pip install -r backend/requirements_production.txt

# Create database
createdb blog_db

# Run migrations
cd backend
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 3. Static Files
```bash
# Collect static files
python manage.py collectstatic --noinput

# Set up media directory
mkdir -p media
chmod 755 media
```

### 4. Production Server Setup
```bash
# Install Gunicorn
pip install gunicorn

# Test Gunicorn
gunicorn --bind 0.0.0.0:8000 blog_backend.wsgi:application
```

### 5. Nginx Configuration
Create `/etc/nginx/sites-available/blog-app`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Static files
    location /static/ {
        alias /path/to/your/project/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /path/to/your/project/media/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin interface
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Systemd Service
Create `/etc/systemd/system/blog-app.service`:
```ini
[Unit]
Description=Blog Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/your/project/backend
Environment="PATH=/path/to/your/venv/bin"
ExecStart=/path/to/your/venv/bin/gunicorn --workers 3 --bind unix:/path/to/your/project/backend/blog-app.sock blog_backend.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
```

## 🎨 Frontend Deployment

### 1. Build Production Version
```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
export REACT_APP_API_URL=https://your-domain.com/api

# Build for production
npm run build
```

### 2. Deploy to Web Server
```bash
# Copy build files to web server
sudo cp -r dist/* /var/www/html/

# Set permissions
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

### 3. Nginx Frontend Configuration
Add to your nginx configuration:
```nginx
# Frontend
location / {
    try_files $uri $uri/ /index.html;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🔒 Security Checklist

### ✅ Backend Security
- [ ] DEBUG=False in production
- [ ] SECRET_KEY changed from default
- [ ] ALLOWED_HOSTS configured
- [ ] CORS settings properly configured
- [ ] Database credentials secured
- [ ] SSL/TLS enabled
- [ ] Security headers configured
- [ ] Input validation implemented
- [ ] JWT tokens properly configured

### ✅ Frontend Security
- [ ] Environment variables configured
- [ ] API URLs use HTTPS
- [ ] No sensitive data in client-side code
- [ ] CORS properly configured
- [ ] Content Security Policy implemented

### ✅ Infrastructure Security
- [ ] Firewall configured
- [ ] SSH key-based authentication
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Monitoring and logging set up

## 📊 Monitoring and Logging

### 1. Application Logs
```bash
# View application logs
sudo journalctl -u blog-app -f

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. Database Monitoring
```bash
# Check database connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Monitor database performance
sudo -u postgres psql -c "SELECT * FROM pg_stat_database;"
```

## 🔄 Maintenance

### Regular Tasks
- [ ] Database backups (daily)
- [ ] Security updates (weekly)
- [ ] Log rotation (weekly)
- [ ] Performance monitoring (continuous)
- [ ] SSL certificate renewal (before expiry)

### Backup Script
Create `/usr/local/bin/backup-blog.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backups/blog"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump blog_db > $BACKUP_DIR/db_backup_$DATE.sql

# Media files backup
tar -czf $BACKUP_DIR/media_backup_$DATE.tar.gz /path/to/your/project/media/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

## 🚨 Troubleshooting

### Common Issues
1. **500 Internal Server Error**
   - Check application logs
   - Verify database connection
   - Check file permissions

2. **CORS Errors**
   - Verify CORS_ALLOWED_ORIGINS
   - Check nginx configuration
   - Ensure HTTPS is used

3. **Static Files Not Loading**
   - Run collectstatic
   - Check nginx static file configuration
   - Verify file permissions

4. **Database Connection Issues**
   - Check database service status
   - Verify connection credentials
   - Check firewall settings

## 📞 Support
For deployment issues, check:
1. Application logs
2. Nginx error logs
3. System logs
4. Database logs

## 🎉 Success Criteria
Your deployment is successful when:
- [ ] Application accessible via HTTPS
- [ ] All API endpoints working
- [ ] Frontend loads correctly
- [ ] Database operations working
- [ ] File uploads working
- [ ] Authentication working
- [ ] Admin interface accessible
- [ ] Monitoring and logging active 