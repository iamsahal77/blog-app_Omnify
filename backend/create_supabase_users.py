#!/usr/bin/env python3
"""
Helper script to safely create users and blog posts in Supabase
This ensures no foreign key constraint errors occur
"""

import os
import sys
import django
from django.conf import settings
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_backend.settings')
django.setup()

# Supabase connection details (update these with your actual values)
SUPABASE_HOST = os.getenv('SUPABASE_HOST', 'your-project.supabase.co')
SUPABASE_DB = os.getenv('SUPABASE_DB', 'postgres')
SUPABASE_USER = os.getenv('SUPABASE_USER', 'postgres')
SUPABASE_PASSWORD = os.getenv('SUPABASE_PASSWORD', 'your-password')
SUPABASE_PORT = os.getenv('SUPABASE_PORT', '5432')

def get_supabase_connection():
    """Get connection to Supabase database"""
    try:
        connection = psycopg2.connect(
            host=SUPABASE_HOST,
            database=SUPABASE_DB,
            user=SUPABASE_USER,
            password=SUPABASE_PASSWORD,
            port=SUPABASE_PORT
        )
        return connection
    except Exception as e:
        print(f"Error connecting to Supabase: {e}")
        return None

def create_user_safe(connection, email, username, password, first_name, last_name):
    """Safely create a user in Supabase"""
    try:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            # Check if user already exists
            cursor.execute(
                "SELECT id FROM auth_users WHERE email = %s",
                (email,)
            )
            existing_user = cursor.fetchone()
            
            if existing_user:
                print(f"User {email} already exists with ID: {existing_user['id']}")
                return existing_user['id']
            
            # Create new user with specific UUID
            user_id = str(uuid.uuid4())
            cursor.execute(
                """
                INSERT INTO auth_users (id, email, username, password, first_name, last_name)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (user_id, email, username, password, first_name, last_name)
            )
            
            new_user = cursor.fetchone()
            connection.commit()
            print(f"Created user {email} with ID: {new_user['id']}")
            return new_user['id']
            
    except Exception as e:
        connection.rollback()
        print(f"Error creating user {email}: {e}")
        return None

def create_blog_post_safe(connection, title, content, excerpt, author_email, category, read_time=None):
    """Safely create a blog post in Supabase"""
    try:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            # Get author ID
            cursor.execute(
                "SELECT id FROM auth_users WHERE email = %s",
                (author_email,)
            )
            author = cursor.fetchone()
            
            if not author:
                print(f"Error: User {author_email} does not exist")
                return None
            
            # Check if blog post already exists
            cursor.execute(
                "SELECT id FROM blog_posts WHERE title = %s AND author_id = %s",
                (title, author['id'])
            )
            existing_post = cursor.fetchone()
            
            if existing_post:
                print(f"Blog post '{title}' already exists with ID: {existing_post['id']}")
                return existing_post['id']
            
            # Create new blog post
            cursor.execute(
                """
                INSERT INTO blog_posts (title, content, excerpt, author_id, category, read_time)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (title, content, excerpt, author['id'], category, read_time)
            )
            
            new_post = cursor.fetchone()
            connection.commit()
            print(f"Created blog post '{title}' with ID: {new_post['id']}")
            return new_post['id']
            
    except Exception as e:
        connection.rollback()
        print(f"Error creating blog post '{title}': {e}")
        return None

def main():
    """Main function to set up users and blog posts"""
    print("Setting up Supabase users and blog posts...")
    
    # Get database connection
    connection = get_supabase_connection()
    if not connection:
        print("Failed to connect to Supabase. Please check your connection details.")
        return
    
    try:
        # Create sample users
        users_data = [
            {
                'email': 'admin@example.com',
                'username': 'admin',
                'password': 'password123',
                'first_name': 'Admin',
                'last_name': 'User'
            },
            {
                'email': 'john@example.com',
                'username': 'john_doe',
                'password': 'password123',
                'first_name': 'John',
                'last_name': 'Doe'
            },
            {
                'email': 'jane@example.com',
                'username': 'jane_smith',
                'password': 'password123',
                'first_name': 'Jane',
                'last_name': 'Smith'
            }
        ]
        
        user_ids = {}
        for user_data in users_data:
            user_id = create_user_safe(
                connection,
                user_data['email'],
                user_data['username'],
                user_data['password'],
                user_data['first_name'],
                user_data['last_name']
            )
            if user_id:
                user_ids[user_data['email']] = user_id
        
        # Create sample blog posts
        blog_posts_data = [
            {
                'title': 'Getting Started with React',
                'excerpt': 'Learn the basics of React development',
                'content': 'React is a powerful JavaScript library for building user interfaces. It allows you to create reusable UI components and manage state efficiently. In this tutorial, we will cover the fundamentals of React including components, props, state, and lifecycle methods.',
                'author_email': 'admin@example.com',
                'category': 'Programming',
                'read_time': 5
            },
            {
                'title': 'Django Best Practices',
                'excerpt': 'Essential tips for Django development',
                'content': 'Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. This article covers best practices for Django development including project structure, security considerations, and performance optimization techniques.',
                'author_email': 'john@example.com',
                'category': 'Programming',
                'read_time': 8
            },
            {
                'title': 'Modern Web Development',
                'excerpt': 'Trends and technologies in 2024',
                'content': 'The web development landscape is constantly evolving with new frameworks, tools, and methodologies emerging regularly. This comprehensive guide explores the latest trends in web development including serverless architecture, microservices, and modern frontend frameworks.',
                'author_email': 'jane@example.com',
                'category': 'Technology',
                'read_time': 6
            }
        ]
        
        for post_data in blog_posts_data:
            create_blog_post_safe(
                connection,
                post_data['title'],
                post_data['content'],
                post_data['excerpt'],
                post_data['author_email'],
                post_data['category'],
                post_data['read_time']
            )
        
        print("\nSetup completed successfully!")
        print(f"Created {len(user_ids)} users and {len(blog_posts_data)} blog posts")
        
    except Exception as e:
        print(f"Error during setup: {e}")
    finally:
        connection.close()

if __name__ == "__main__":
    main() 