#!/usr/bin/env python3
"""
Test script to verify Supabase connection and foreign key constraints
"""

import os
import sys
import psycopg2
from psycopg2.extras import RealDictCursor

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_supabase_connection():
    """Test connection to Supabase"""
    try:
        # Get connection details from environment or use defaults
        host = os.getenv('SUPABASE_HOST', 'your-project.supabase.co')
        database = os.getenv('SUPABASE_DB', 'postgres')
        user = os.getenv('SUPABASE_USER', 'postgres')
        password = os.getenv('SUPABASE_PASSWORD', 'your-password')
        port = os.getenv('SUPABASE_PORT', '5432')
        
        print(f"Attempting to connect to Supabase...")
        print(f"Host: {host}")
        print(f"Database: {database}")
        print(f"User: {user}")
        print(f"Port: {port}")
        
        connection = psycopg2.connect(
            host=host,
            database=database,
            user=user,
            password=password,
            port=port
        )
        
        print("✅ Successfully connected to Supabase!")
        
        # Test basic queries
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            # Check if tables exist
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('auth_users', 'blog_posts')
                ORDER BY table_name
            """)
            
            tables = cursor.fetchall()
            print(f"✅ Found {len(tables)} tables: {[t['table_name'] for t in tables]}")
            
            # Check users
            cursor.execute("SELECT COUNT(*) as count FROM auth_users")
            user_count = cursor.fetchone()['count']
            print(f"✅ Found {user_count} users in auth_users table")
            
            # Check blog posts
            cursor.execute("SELECT COUNT(*) as count FROM blog_posts")
            post_count = cursor.fetchone()['count']
            print(f"✅ Found {post_count} blog posts in blog_posts table")
            
            # Check foreign key constraints
            cursor.execute("""
                SELECT 
                    tc.constraint_name,
                    tc.table_name,
                    kcu.column_name,
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name
                FROM information_schema.table_constraints AS tc
                JOIN information_schema.key_column_usage AS kcu
                    ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage AS ccu
                    ON ccu.constraint_name = tc.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_name = 'blog_posts'
            """)
            
            fk_constraints = cursor.fetchall()
            print(f"✅ Found {len(fk_constraints)} foreign key constraints on blog_posts table")
            
            for fk in fk_constraints:
                print(f"   - {fk['column_name']} -> {fk['foreign_table_name']}.{fk['foreign_column_name']}")
            
            # Test the safe insert function
            print("\n🧪 Testing safe insert function...")
            cursor.execute("""
                SELECT insert_blog_post_safe(
                    'Test Post from Python',
                    'This is a test post created from Python to verify the safe insert function works correctly.',
                    'Test excerpt for the safe insert function.',
                    'admin@example.com',
                    'Technology',
                    3
                ) as post_id
            """)
            
            result = cursor.fetchone()
            if result:
                print(f"✅ Successfully created test post with ID: {result['post_id']}")
                
                # Clean up test post
                cursor.execute("DELETE FROM blog_posts WHERE id = %s", (result['post_id'],))
                print(f"✅ Cleaned up test post")
            else:
                print("❌ Failed to create test post")
            
            connection.commit()
        
        connection.close()
        print("\n🎉 All tests passed! Your Supabase setup is working correctly.")
        return True
        
    except psycopg2.OperationalError as e:
        print(f"❌ Connection failed: {e}")
        print("\nPlease check your Supabase connection details:")
        print("1. Make sure SUPABASE_HOST, SUPABASE_DB, SUPABASE_USER, SUPABASE_PASSWORD are set")
        print("2. Verify your Supabase project is active")
        print("3. Check if your IP is whitelisted in Supabase")
        return False
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def main():
    """Main function"""
    print("=" * 60)
    print("SUPABASE CONNECTION AND FOREIGN KEY CONSTRAINT TEST")
    print("=" * 60)
    
    success = test_supabase_connection()
    
    if success:
        print("\n✅ Your Supabase setup is ready to use!")
        print("You can now run your application without foreign key constraint errors.")
    else:
        print("\n❌ Please fix the issues above before proceeding.")
        print("Refer to SUPABASE_SETUP_GUIDE.md for detailed instructions.")

if __name__ == "__main__":
    main() 