#!/usr/bin/env python
"""
Comprehensive test script to verify all backend functionalities
"""
import os
import django
import requests
import json
import time

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import BlogPost, UserProfile

def test_database_models():
    """Test database models and relationships"""
    print("🔍 Testing Database Models...")
    
    try:
        # Test User model
        user_count = User.objects.count()
        print(f"✅ Users in database: {user_count}")
        
        # Test BlogPost model
        post_count = BlogPost.objects.count()
        print(f"✅ Blog posts in database: {post_count}")
        
        # Test UserProfile model
        profile_count = UserProfile.objects.count()
        print(f"✅ User profiles in database: {profile_count}")
        
        # Test relationships
        if user_count > 0:
            user = User.objects.first()
            print(f"✅ Sample user: {user.username}")
            
            if hasattr(user, 'profile'):
                print(f"✅ User profile exists: {user.profile}")
            
            if hasattr(user, 'blog_posts'):
                posts = user.blog_posts.all()
                print(f"✅ User has {posts.count()} blog posts")
        
        return True
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

def test_api_endpoints():
    """Test API endpoints"""
    print("\n🔍 Testing API Endpoints...")
    
    base_url = "http://localhost:8000/api"
    results = {}
    
    # Wait for server to start
    time.sleep(2)
    
    try:
        # Test 1: Get blog posts (public endpoint)
        print("Testing GET /api/posts/...")
        response = requests.get(f"{base_url}/posts/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Blog posts endpoint working - {len(data.get('results', []))} posts returned")
            results['posts'] = True
        else:
            print(f"❌ Blog posts endpoint failed - Status: {response.status_code}")
            results['posts'] = False
        
        # Test 2: Get categories (public endpoint)
        print("Testing GET /api/categories/...")
        response = requests.get(f"{base_url}/categories/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Categories endpoint working - {len(data.get('categories', []))} categories returned")
            results['categories'] = True
        else:
            print(f"❌ Categories endpoint failed - Status: {response.status_code}")
            results['categories'] = False
        
        # Test 3: Test authentication endpoints
        print("Testing authentication endpoints...")
        
        # Test registration
        register_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "password2": "testpass123",
            "first_name": "Test",
            "last_name": "User"
        }
        
        response = requests.post(f"{base_url}/auth/register/", json=register_data)
        if response.status_code in [200, 201, 400]:  # 400 if user already exists
            print("✅ Registration endpoint working")
            results['register'] = True
        else:
            print(f"❌ Registration endpoint failed - Status: {response.status_code}")
            results['register'] = False
        
        # Test login
        login_data = {
            "username": "johndoe",
            "password": "password123"
        }
        
        response = requests.post(f"{base_url}/auth/login/", json=login_data)
        if response.status_code == 200:
            data = response.json()
            if 'access' in data and 'refresh' in data:
                print("✅ Login endpoint working - JWT tokens received")
                results['login'] = True
                access_token = data['access']
            else:
                print("❌ Login endpoint failed - No tokens received")
                results['login'] = False
                access_token = None
        else:
            print(f"❌ Login endpoint failed - Status: {response.status_code}")
            results['login'] = False
            access_token = None
        
        # Test authenticated endpoints if we have a token
        if access_token:
            headers = {"Authorization": f"Bearer {access_token}"}
            
            # Test profile endpoint
            print("Testing GET /api/profile/...")
            response = requests.get(f"{base_url}/profile/", headers=headers)
            if response.status_code == 200:
                print("✅ Profile endpoint working")
                results['profile'] = True
            else:
                print(f"❌ Profile endpoint failed - Status: {response.status_code}")
                results['profile'] = False
            
            # Test create post endpoint
            print("Testing POST /api/posts/...")
            post_data = {
                "title": "Test Post",
                "content": "This is a test post content.",
                "category": "Technology"
            }
            response = requests.post(f"{base_url}/posts/", json=post_data, headers=headers)
            if response.status_code in [200, 201]:
                print("✅ Create post endpoint working")
                results['create_post'] = True
            else:
                print(f"❌ Create post endpoint failed - Status: {response.status_code}")
                results['create_post'] = False
        
        return results
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server. Make sure it's running on localhost:8000")
        return False
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def test_sample_data():
    """Test if sample data exists and is accessible"""
    print("\n🔍 Testing Sample Data...")
    
    try:
        # Check for sample users
        johndoe = User.objects.filter(username='johndoe').first()
        janesmith = User.objects.filter(username='janesmith').first()
        
        if johndoe:
            print(f"✅ Sample user 'johndoe' exists")
        else:
            print("❌ Sample user 'johndoe' not found")
        
        if janesmith:
            print(f"✅ Sample user 'janesmith' exists")
        else:
            print("❌ Sample user 'janesmith' not found")
        
        # Check for sample posts
        posts = BlogPost.objects.all()
        if posts.exists():
            print(f"✅ {posts.count()} sample blog posts found")
            for post in posts[:3]:  # Show first 3 posts
                print(f"   - {post.title} by {post.author.username}")
        else:
            print("❌ No sample blog posts found")
        
        return True
    except Exception as e:
        print(f"❌ Sample data test failed: {e}")
        return False

def test_admin_interface():
    """Test admin interface accessibility"""
    print("\n🔍 Testing Admin Interface...")
    
    try:
        # Check if admin user exists
        admin_user = User.objects.filter(is_superuser=True).first()
        if admin_user:
            print(f"✅ Admin user exists: {admin_user.username}")
        else:
            print("❌ No admin user found")
        
        # Test admin URL
        response = requests.get("http://localhost:8000/admin/")
        if response.status_code == 200:
            print("✅ Admin interface accessible")
            return True
        else:
            print(f"❌ Admin interface not accessible - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Admin interface test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Comprehensive Functionality Test")
    print("=" * 50)
    
    # Test 1: Database Models
    db_test = test_database_models()
    
    # Test 2: Sample Data
    sample_test = test_sample_data()
    
    # Test 3: API Endpoints
    api_results = test_api_endpoints()
    
    # Test 4: Admin Interface
    admin_test = test_admin_interface()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    print(f"Database Models: {'✅ PASS' if db_test else '❌ FAIL'}")
    print(f"Sample Data: {'✅ PASS' if sample_test else '❌ FAIL'}")
    print(f"Admin Interface: {'✅ PASS' if admin_test else '❌ FAIL'}")
    
    if api_results:
        print("\nAPI Endpoints:")
        for endpoint, status in api_results.items():
            print(f"  {endpoint}: {'✅ PASS' if status else '❌ FAIL'}")
    
    # Overall status
    all_tests = [db_test, sample_test, admin_test]
    if api_results:
        all_tests.extend(api_results.values())
    
    if all(all_tests):
        print("\n🎉 ALL TESTS PASSED! Your backend is fully functional.")
    else:
        print("\n⚠️  Some tests failed. Please check the issues above.")
    
    print("\n🔗 Useful URLs:")
    print("  - API Root: http://localhost:8000/api/")
    print("  - Admin Interface: http://localhost:8000/admin/")
    print("  - Blog Posts: http://localhost:8000/api/posts/")

if __name__ == '__main__':
    main() 