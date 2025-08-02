import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_backend.settings')
django.setup()

from django.contrib.auth.models import User

def check_users():
    print("=== EXISTING USERS IN DATABASE ===")
    users = User.objects.all()
    
    if not users.exists():
        print("No users found in database!")
        return
    
    for user in users:
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"First Name: {user.first_name}")
        print(f"Last Name: {user.last_name}")
        print(f"Date Joined: {user.date_joined}")
        print(f"Is Staff: {user.is_staff}")
        print(f"Is Superuser: {user.is_superuser}")
        print("-" * 40)
    
    print("\n=== LOGIN CREDENTIALS ===")
    print("Use these credentials to login:")
    print("1. johndoe / password123")
    print("2. janesmith / password123")
    print("3. admin / password123 (if admin user exists)")
    
    # Check if admin user exists
    admin_user = User.objects.filter(username='admin').first()
    if admin_user:
        print("✅ Admin user exists")
    else:
        print("❌ Admin user does not exist")

if __name__ == "__main__":
    check_users() 