# Supabase Quick Start Guide

## 🚀 Quick Setup to Fix Foreign Key Constraint Errors

### 1. Environment Setup

Create a `.env` file in your `backend/` directory:

```bash
# Supabase Database Connection
SUPABASE_HOST=your-project.supabase.co
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-actual-password
SUPABASE_PORT=5432

# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 2. Run the SQL Setup

Execute the `supabase_setup.sql` file in your Supabase SQL editor:

```bash
# Copy the contents of supabase_setup.sql and run it in Supabase
```

This will:
- ✅ Create `auth_users` table with UUID primary keys
- ✅ Create `blog_posts` table with proper foreign key constraints
- ✅ Insert sample users with valid UUIDs
- ✅ Insert sample blog posts with correct author references
- ✅ Create helper functions for safe operations

### 3. Test Your Connection

Run the test script to verify everything is working:

```bash
cd backend
python test_supabase_connection.py
```

Expected output:
```
============================================================
SUPABASE CONNECTION AND FOREIGN KEY CONSTRAINT TEST
============================================================
Attempting to connect to Supabase...
Host: your-project.supabase.co
Database: postgres
User: postgres
Port: 5432
✅ Successfully connected to Supabase!
✅ Found 2 tables: ['auth_users', 'blog_posts']
✅ Found 3 users in auth_users table
✅ Found 3 blog posts in blog_posts table
✅ Found 1 foreign key constraints on blog_posts table
   - author_id -> auth_users.id

🧪 Testing safe insert function...
✅ Successfully created test post with ID: 4
✅ Cleaned up test post

🎉 All tests passed! Your Supabase setup is working correctly.

✅ Your Supabase setup is ready to use!
You can now run your application without foreign key constraint errors.
```

### 4. Use Safe Operations

#### Option A: Use the Helper Script
```bash
cd backend
python create_supabase_users.py
```

#### Option B: Use SQL Functions
```sql
-- Create a user safely
INSERT INTO auth_users (email, username, password, first_name, last_name)
VALUES ('newuser@example.com', 'newuser', 'password123', 'New', 'User')
ON CONFLICT (email) DO NOTHING;

-- Create a blog post safely
SELECT insert_blog_post_safe(
    'My New Post',
    'This is the content of my new blog post...',
    'A brief excerpt of the post...',
    'newuser@example.com',
    'Technology',
    5
);
```

#### Option C: Use Python Functions
```python
from create_supabase_users import create_user_safe, create_blog_post_safe, get_supabase_connection

# Connect to Supabase
conn = get_supabase_connection()

# Create a user
user_id = create_user_safe(
    conn, 
    'test@example.com', 
    'testuser', 
    'password123', 
    'Test', 
    'User'
)

# Create a blog post
post_id = create_blog_post_safe(
    conn,
    'Test Post',
    'This is a test post content...',
    'Test excerpt...',
    'test@example.com',
    'Technology',
    3
)

conn.close()
```

### 5. Integration with Django

Update your Django settings to use Supabase:

```python
# settings.py
import os
from decouple import config

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('SUPABASE_DB', default='postgres'),
        'USER': config('SUPABASE_USER', default='postgres'),
        'PASSWORD': config('SUPABASE_PASSWORD'),
        'HOST': config('SUPABASE_HOST'),
        'PORT': config('SUPABASE_PORT', default='5432'),
    }
}
```

### 6. Troubleshooting

#### If you get connection errors:
1. Check your `.env` file has correct values
2. Verify your Supabase project is active
3. Check if your IP is whitelisted in Supabase

#### If you get foreign key errors:
1. Run the test script: `python test_supabase_connection.py`
2. Check existing users: `SELECT id, email FROM auth_users;`
3. Check existing posts: `SELECT id, title, author_id FROM blog_posts;`

#### If tables don't exist:
1. Run the `supabase_setup.sql` script again
2. Check for any SQL errors in the Supabase console

### 7. Best Practices

✅ **Always do this:**
- Use the safe functions provided
- Validate user existence before creating posts
- Use transactions for multiple operations
- Check for existing records before inserting

❌ **Never do this:**
- Insert blog posts without valid author IDs
- Use hardcoded UUIDs that don't exist
- Skip validation steps
- Ignore error messages

### 8. Verification Checklist

Before running your application, ensure:

- [ ] `.env` file is created with correct Supabase credentials
- [ ] `supabase_setup.sql` has been executed successfully
- [ ] `python test_supabase_connection.py` passes all tests
- [ ] At least 3 users exist in `auth_users` table
- [ ] At least 3 blog posts exist in `blog_posts` table
- [ ] Foreign key constraint is properly set up
- [ ] Safe insert function works correctly

### 9. Next Steps

Once everything is working:

1. **Start your Django server:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start your React frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test your application:**
   - Create new users
   - Create new blog posts
   - Verify no foreign key constraint errors occur

## 🎉 Success!

You should now be able to run your blog application without encountering the foreign key constraint error:

```
ERROR: 23503: insert or update on table "blog_posts" violates foreign key constraint "blog_posts_author_id_fkey"
```

The system now ensures that all blog posts have valid author references and all operations are performed safely. 