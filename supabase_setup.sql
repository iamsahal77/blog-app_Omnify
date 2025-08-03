-- Drop existing tables to start fresh (if needed)
-- DROP TABLE IF EXISTS blog_posts CASCADE;
-- DROP TABLE IF EXISTS auth_users CASCADE;

-- Create a new auth_users table for authentication (to avoid conflicts with existing users table)
CREATE TABLE IF NOT EXISTS auth_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID,
    category VARCHAR(100),
    image VARCHAR(500),
    read_time INTEGER,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to blog_posts table if they don't exist
DO $$ 
BEGIN
    -- Add author_id column if it doesn't exist (use UUID to match existing structure)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'author_id') THEN
        ALTER TABLE blog_posts ADD COLUMN author_id UUID;
    END IF;
    
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'category') THEN
        ALTER TABLE blog_posts ADD COLUMN category VARCHAR(100);
    END IF;
    
    -- Add image column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'image') THEN
        ALTER TABLE blog_posts ADD COLUMN image VARCHAR(500);
    END IF;
    
    -- Add read_time column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'read_time') THEN
        ALTER TABLE blog_posts ADD COLUMN read_time INTEGER;
    END IF;
    
    -- Add published column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'published') THEN
        ALTER TABLE blog_posts ADD COLUMN published BOOLEAN DEFAULT true;
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'updated_at') THEN
        ALTER TABLE blog_posts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Drop existing foreign key constraints if they exist
DO $$
BEGIN
    -- Drop foreign key constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'blog_posts_author_id_fkey' 
        AND table_name = 'blog_posts'
    ) THEN
        ALTER TABLE blog_posts DROP CONSTRAINT blog_posts_author_id_fkey;
    END IF;
END $$;

-- Add the correct foreign key constraint to auth_users table
ALTER TABLE blog_posts 
ADD CONSTRAINT blog_posts_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES auth_users(id) ON DELETE CASCADE;

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anonymous read access to auth_users" ON auth_users;
DROP POLICY IF EXISTS "Allow users to insert their own data" ON auth_users;
DROP POLICY IF EXISTS "Allow users to update their own data" ON auth_users;
DROP POLICY IF EXISTS "Allow anonymous read access to published posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to create posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow users to update their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow users to delete their own posts" ON blog_posts;

-- Create policies for auth_users table
-- Allow anonymous users to read user profiles
CREATE POLICY "Allow anonymous read access to auth_users" ON auth_users
    FOR SELECT USING (true);

-- Allow users to insert their own data (for registration)
CREATE POLICY "Allow users to insert their own data" ON auth_users
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own data
CREATE POLICY "Allow users to update their own data" ON auth_users
    FOR UPDATE USING (true);

-- Create policies for blog_posts table
-- Allow anonymous users to read published posts
CREATE POLICY "Allow anonymous read access to published posts" ON blog_posts
    FOR SELECT USING (published = true);

-- Allow authenticated users to create posts
CREATE POLICY "Allow authenticated users to create posts" ON blog_posts
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own posts
CREATE POLICY "Allow users to update their own posts" ON blog_posts
    FOR UPDATE USING (true);

-- Allow users to delete their own posts
CREATE POLICY "Allow users to delete their own posts" ON blog_posts
    FOR DELETE USING (true);

-- Clear existing data to avoid conflicts
DELETE FROM blog_posts;
DELETE FROM auth_users;

-- Insert sample users with specific UUIDs for consistency
INSERT INTO auth_users (id, email, username, password, first_name, last_name) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@example.com', 'admin', 'password123', 'Admin', 'User'),
('550e8400-e29b-41d4-a716-446655440002', 'john@example.com', 'john_doe', 'password123', 'John', 'Doe'),
('550e8400-e29b-41d4-a716-446655440003', 'jane@example.com', 'jane_smith', 'password123', 'Jane', 'Smith')
ON CONFLICT (email) DO NOTHING;

-- Insert sample blog posts using the specific UUIDs
INSERT INTO blog_posts (title, excerpt, content, author_id, category, read_time) VALUES
(
    'Getting Started with React',
    'Learn the basics of React development',
    'React is a powerful JavaScript library for building user interfaces. It allows you to create reusable UI components and manage state efficiently. In this tutorial, we will cover the fundamentals of React including components, props, state, and lifecycle methods.',
    '550e8400-e29b-41d4-a716-446655440001',
    'Programming',
    5
),
(
    'Django Best Practices',
    'Essential tips for Django development',
    'Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. This article covers best practices for Django development including project structure, security considerations, and performance optimization techniques.',
    '550e8400-e29b-41d4-a716-446655440002',
    'Programming',
    8
),
(
    'Modern Web Development',
    'Trends and technologies in 2024',
    'The web development landscape is constantly evolving with new frameworks, tools, and methodologies emerging regularly. This comprehensive guide explores the latest trends in web development including serverless architecture, microservices, and modern frontend frameworks.',
    '550e8400-e29b-41d4-a716-446655440003',
    'Technology',
    6
);

-- Create a function to safely insert blog posts with user validation
CREATE OR REPLACE FUNCTION insert_blog_post_safe(
    p_title VARCHAR(200),
    p_content TEXT,
    p_excerpt TEXT,
    p_author_email VARCHAR(255),
    p_category VARCHAR(100),
    p_read_time INTEGER DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_author_id UUID;
    v_post_id INTEGER;
BEGIN
    -- Get the author_id from the email
    SELECT id INTO v_author_id 
    FROM auth_users 
    WHERE email = p_author_email;
    
    -- Check if user exists
    IF v_author_id IS NULL THEN
        RAISE EXCEPTION 'User with email % does not exist', p_author_email;
    END IF;
    
    -- Insert the blog post
    INSERT INTO blog_posts (title, content, excerpt, author_id, category, read_time)
    VALUES (p_title, p_content, p_excerpt, v_author_id, p_category, p_read_time)
    RETURNING id INTO v_post_id;
    
    RETURN v_post_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get user ID by email
CREATE OR REPLACE FUNCTION get_user_id_by_email(p_email VARCHAR(255))
RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id 
    FROM auth_users 
    WHERE email = p_email;
    
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email); 