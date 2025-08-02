#!/usr/bin/env python
"""
Deployment script for production setup
"""
import os
import subprocess
import sys
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return None

def create_directories():
    """Create necessary directories"""
    directories = ['logs', 'media', 'staticfiles']
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ Created directory: {directory}")

def setup_environment():
    """Setup environment variables"""
    env_file = Path('.env')
    if not env_file.exists():
        print("⚠️  .env file not found. Please create one based on env.example")
        return False
    return True

def collect_static():
    """Collect static files"""
    return run_command(
        "python manage.py collectstatic --noinput",
        "Collecting static files"
    )

def run_migrations():
    """Run database migrations"""
    return run_command(
        "python manage.py migrate",
        "Running database migrations"
    )

def create_superuser():
    """Create superuser if needed"""
    print("\n👤 Do you want to create a superuser? (y/n): ", end="")
    response = input().lower()
    if response == 'y':
        run_command(
            "python manage.py createsuperuser",
            "Creating superuser"
        )

def check_security():
    """Check security settings"""
    print("\n🔒 Security Checklist:")
    print("1. ✅ Ensure DEBUG=False in production")
    print("2. ✅ Change SECRET_KEY in .env file")
    print("3. ✅ Set proper ALLOWED_HOSTS")
    print("4. ✅ Configure database settings")
    print("5. ✅ Set up proper CORS settings")
    print("6. ✅ Configure email settings if needed")

def main():
    """Main deployment function"""
    print("🚀 Starting production deployment...")
    
    # Check if we're in the right directory
    if not Path('manage.py').exists():
        print("❌ Please run this script from the Django project root directory")
        sys.exit(1)
    
    # Setup environment
    if not setup_environment():
        print("❌ Environment setup failed")
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Run migrations
    if not run_migrations():
        print("❌ Migration failed")
        sys.exit(1)
    
    # Collect static files
    if not collect_static():
        print("❌ Static file collection failed")
        sys.exit(1)
    
    # Create superuser
    create_superuser()
    
    # Security checklist
    check_security()
    
    print("\n🎉 Deployment setup completed!")
    print("\n📋 Next steps:")
    print("1. Configure your web server (nginx, apache)")
    print("2. Set up WSGI server (gunicorn, uwsgi)")
    print("3. Configure SSL certificates")
    print("4. Set up monitoring and logging")
    print("5. Test the application thoroughly")

if __name__ == '__main__':
    main() 