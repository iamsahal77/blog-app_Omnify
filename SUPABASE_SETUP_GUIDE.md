# Supabase Setup Guide - Preventing Foreign Key Constraint Errors

## Problem
You encountered this error:
```
ERROR: 23503: insert or update on table "blog_posts" violates foreign key constraint "blog_posts_author_id_fkey"
DETAIL: Key (author_id)=(22568b21-7658-42e8-86a4-7e88d16c51e7) is not present in table "users".
```

This happens when trying to insert a blog post with an `author_id` that doesn't exist in the `auth_users` table.

## Solution

### 1. Run the Updated SQL Setup

First, execute the updated `supabase_setup.sql` file:

```sql
-- This will create the proper table structure and sample data
-- Run this in your Supabase SQL editor
```

The updated script:
- Creates `auth_users` table with UUID primary keys
- Creates `blog_posts` table with proper foreign key constraints
- Inserts sample users with specific UUIDs
- Inserts sample blog posts using valid author IDs
- Creates helper functions for safe operations

### 2. Use the Helper Script

Run the Python helper script to safely create users and blog posts:

```bash
cd backend
python create_supabase_users.py
```

This script:
- Safely creates users without duplicates
- Validates author existence before creating blog posts
- Provides detailed error messages
- Uses transactions for data consistency

### 3. Environment Variables

Set up your Supabase connection details:

```bash
# Create a .env file in the backend directory
SUPABASE_HOST=your-project.supabase.co
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-password
SUPABASE_PORT=5432
```

### 4. Best Practices to Prevent Future Errors

#### When Creating Blog Posts:

1. **Always validate user existence first:**
```sql
-- Check if user exists before inserting blog post
SELECT id FROM auth_users WHERE email = 'user@example.com';
```

2. **Use the helper function:**
```sql
-- Use the safe insert function
SELECT insert_blog_post_safe(
    'Post Title',
    'Post content...',
    'Post excerpt...',
    'user@example.com',
    'Technology',
    5
);
```

3. **Use transactions:**
```sql
BEGIN;
-- Your insert operations here
COMMIT;
```

#### When Creating Users:

1. **Check for existing users:**
```sql
INSERT INTO auth_users (email, username, password, first_name, last_name)
VALUES ('user@example.com', 'username', 'password', 'First', 'Last')
ON CONFLICT (email) DO NOTHING;
```

2. **Use specific UUIDs for consistency:**
```sql
INSERT INTO auth_users (id, email, username, password, first_name, last_name)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'user@example.com',
    'username',
    'password',
    'First',
    'Last'
);
```

### 5. Database Schema

The correct schema structure:

```sql
-- Users table
CREATE TABLE auth_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID REFERENCES auth_users(id) ON DELETE CASCADE,
    category VARCHAR(100),
    image VARCHAR(500),
    read_time INTEGER,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Troubleshooting

#### If you still get foreign key errors:

1. **Check existing users:**
```sql
SELECT id, email FROM auth_users;
```

2. **Check existing blog posts:**
```sql
SELECT id, title, author_id FROM blog_posts;
```

3. **Find orphaned blog posts:**
```sql
SELECT bp.id, bp.title, bp.author_id 
FROM blog_posts bp 
LEFT JOIN auth_users au ON bp.author_id = au.id 
WHERE au.id IS NULL;
```

4. **Clean up orphaned posts:**
```sql
DELETE FROM blog_posts 
WHERE author_id NOT IN (SELECT id FROM auth_users);
```

### 7. Integration with Django

If you're using Django with Supabase:

1. **Update your Django settings to use Supabase:**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('SUPABASE_DB'),
        'USER': os.getenv('SUPABASE_USER'),
        'PASSWORD': os.getenv('SUPABASE_PASSWORD'),
        'HOST': os.getenv('SUPABASE_HOST'),
        'PORT': os.getenv('SUPABASE_PORT'),
    }
}
```

2. **Create custom user model or use the auth_users table:**
```python
# In your Django models, reference the auth_users table
class BlogPost(models.Model):
    author = models.ForeignKey(
        'auth_users',  # Reference the Supabase table
        on_delete=models.CASCADE,
        related_name='blog_posts'
    )
    # ... other fields
```

### 8. Testing

Test your setup:

```bash
# Test user creation
python -c "
from create_supabase_users import create_user_safe, get_supabase_connection
conn = get_supabase_connection()
if conn:
    user_id = create_user_safe(conn, 'test@example.com', 'testuser', 'password', 'Test', 'User')
    print(f'Created user: {user_id}')
    conn.close()
"

# Test blog post creation
python -c "
from create_supabase_users import create_blog_post_safe, get_supabase_connection
conn = get_supabase_connection()
if conn:
    post_id = create_blog_post_safe(conn, 'Test Post', 'Test content', 'Test excerpt', 'test@example.com', 'Technology', 3)
    print(f'Created post: {post_id}')
    conn.close()
"
```

## Summary

The key to preventing foreign key constraint errors is:
1. **Always ensure users exist before creating blog posts**
2. **Use the provided helper functions and scripts**
3. **Validate data before insertion**
4. **Use transactions for data consistency**
5. **Check for existing records before inserting**

Follow these guidelines and you should never encounter the foreign key constraint error again! 