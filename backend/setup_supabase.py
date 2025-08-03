#!/usr/bin/env python3
"""
Simple Supabase Setup Script
This script guides you through setting up Supabase to prevent foreign key constraint errors
"""

import os
import sys
import subprocess

def print_header():
    """Print the setup header"""
    print("=" * 70)
    print("🚀 SUPABASE SETUP WIZARD")
    print("=" * 70)
    print("This script will help you set up Supabase to prevent foreign key constraint errors")
    print("=" * 70)

def check_env_file():
    """Check if .env file exists and guide user to create it"""
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    
    if os.path.exists(env_file):
        print("✅ .env file found!")
        return True
    else:
        print("❌ .env file not found!")
        print("\n📝 Please create a .env file in the backend directory with the following content:")
        print("-" * 50)
        print("""# Supabase Database Connection
SUPABASE_HOST=your-project.supabase.co
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-actual-password
SUPABASE_PORT=5432

# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1""")
        print("-" * 50)
        print("\n💡 Replace the placeholder values with your actual Supabase credentials")
        print("   You can find these in your Supabase project dashboard under Settings > Database")
        
        response = input("\n🤔 Have you created the .env file? (y/n): ").lower().strip()
        if response == 'y':
            return True
        else:
            print("❌ Please create the .env file first and run this script again")
            return False

def run_sql_setup():
    """Guide user to run SQL setup"""
    print("\n📋 STEP 2: Run SQL Setup")
    print("-" * 30)
    print("You need to execute the supabase_setup.sql file in your Supabase SQL editor")
    print("\n📝 Instructions:")
    print("1. Go to your Supabase project dashboard")
    print("2. Navigate to SQL Editor")
    print("3. Copy the contents of supabase_setup.sql")
    print("4. Paste and execute the SQL")
    
    response = input("\n🤔 Have you executed the SQL setup? (y/n): ").lower().strip()
    return response == 'y'

def test_connection():
    """Test the Supabase connection"""
    print("\n🧪 STEP 3: Test Connection")
    print("-" * 30)
    
    try:
        # Try to import and run the test
        sys.path.append(os.path.dirname(__file__))
        from test_supabase_connection import test_supabase_connection
        
        print("Running connection test...")
        success = test_supabase_connection()
        
        if success:
            print("\n✅ Connection test passed!")
            return True
        else:
            print("\n❌ Connection test failed!")
            return False
            
    except ImportError as e:
        print(f"❌ Error importing test module: {e}")
        print("Make sure you have installed the required dependencies:")
        print("pip install psycopg2-binary python-decouple")
        return False
    except Exception as e:
        print(f"❌ Error during connection test: {e}")
        return False

def run_helper_script():
    """Run the helper script to create users and posts"""
    print("\n👥 STEP 4: Create Sample Data")
    print("-" * 30)
    
    try:
        print("Running helper script to create sample users and blog posts...")
        result = subprocess.run([sys.executable, 'create_supabase_users.py'], 
                              capture_output=True, text=True, cwd=os.path.dirname(__file__))
        
        if result.returncode == 0:
            print("✅ Sample data created successfully!")
            print(result.stdout)
            return True
        else:
            print("❌ Error creating sample data:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error running helper script: {e}")
        return False

def final_verification():
    """Final verification step"""
    print("\n🎯 STEP 5: Final Verification")
    print("-" * 30)
    
    print("Let's run one final test to make sure everything is working...")
    
    try:
        from test_supabase_connection import test_supabase_connection
        success = test_supabase_connection()
        
        if success:
            print("\n🎉 CONGRATULATIONS!")
            print("=" * 50)
            print("Your Supabase setup is complete and working correctly!")
            print("You should no longer encounter foreign key constraint errors.")
            print("\n📋 Next steps:")
            print("1. Start your Django server: python manage.py runserver")
            print("2. Start your React frontend: npm run dev")
            print("3. Test your application functionality")
            print("\n📚 For more information, see:")
            print("- SUPABASE_QUICK_START.md")
            print("- SUPABASE_SETUP_GUIDE.md")
            return True
        else:
            print("\n❌ Final verification failed!")
            print("Please check the error messages above and try again.")
            return False
            
    except Exception as e:
        print(f"❌ Error during final verification: {e}")
        return False

def main():
    """Main setup function"""
    print_header()
    
    # Step 1: Check environment file
    if not check_env_file():
        return
    
    # Step 2: Run SQL setup
    if not run_sql_setup():
        print("❌ Please complete the SQL setup and run this script again")
        return
    
    # Step 3: Test connection
    if not test_connection():
        print("❌ Connection test failed. Please check your .env file and try again")
        return
    
    # Step 4: Create sample data
    if not run_helper_script():
        print("❌ Failed to create sample data. Please check the error messages above")
        return
    
    # Step 5: Final verification
    if not final_verification():
        print("❌ Final verification failed. Please check the setup and try again")
        return
    
    print("\n🎉 Setup completed successfully!")

if __name__ == "__main__":
    main() 