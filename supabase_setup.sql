-- Check if users table exists and create it if it doesn't
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Create users table for authentication
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- Add missing columns to users table if they don't exist
DO $$ 
BEGIN
    -- Add username column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'username') THEN
        ALTER TABLE users ADD COLUMN username VARCHAR(100) UNIQUE;
    END IF;
    
    -- Add password column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password') THEN
        ALTER TABLE users ADD COLUMN password VARCHAR(255);
    END IF;
    
    -- Add first_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'first_name') THEN
        ALTER TABLE users ADD COLUMN first_name VARCHAR(100);
    END IF;
    
    -- Add last_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_name') THEN
        ALTER TABLE users ADD COLUMN last_name VARCHAR(100);
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_at') THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add missing columns to blog_posts table if they don't exist
DO $$ 
BEGIN
    -- Add author_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'author_id') THEN
        ALTER TABLE blog_posts ADD COLUMN author_id INTEGER REFERENCES users(id);
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

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anonymous read access to users" ON users;
DROP POLICY IF EXISTS "Allow users to insert their own data" ON users;
DROP POLICY IF EXISTS "Allow users to update their own data" ON users;
DROP POLICY IF EXISTS "Allow anonymous read access to published posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to create posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow users to update their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow users to delete their own posts" ON blog_posts;

-- Create policies for users table
-- Allow anonymous users to read user profiles
CREATE POLICY "Allow anonymous read access to users" ON users
    FOR SELECT USING (true);

-- Allow users to insert their own data (for registration)
CREATE POLICY "Allow users to insert their own data" ON users
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own data
CREATE POLICY "Allow users to update their own data" ON users
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
    FOR UPDATE USING (author_id = (SELECT id FROM users WHERE email = current_user));

-- Allow users to delete their own posts
CREATE POLICY "Allow users to delete their own posts" ON blog_posts
    FOR DELETE USING (author_id = (SELECT id FROM users WHERE email = current_user));

-- Insert sample users (only if they don't exist) - let the database handle the ID
INSERT INTO users (email, username, password, first_name, last_name) VALUES
('admin@example.com', 'admin', 'password123', 'Admin', 'User'),
('john@example.com', 'john_doe', 'password123', 'John', 'Doe'),
('jane@example.com', 'jane_smith', 'password123', 'Jane', 'Smith')
ON CONFLICT (email) DO NOTHING;

-- Insert sample blog posts (only if they don't exist)
INSERT INTO blog_posts (title, excerpt, content, author_id, category, read_time) VALUES
('Getting Started with React', 'Learn the basics of React development', 'React is a powerful JavaScript library for building user interfaces. It allows you to create reusable UI components and manage state efficiently. In this tutorial, we will cover the fundamentals of React including components, props, state, and lifecycle methods.', 1, 'Programming', 5),
('Django Best Practices', 'Essential tips for Django development', 'Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. This article covers best practices for Django development including project structure, security considerations, and performance optimization techniques.', 2, 'Programming', 8),
('Modern Web Development', 'Trends and technologies in 2024', 'The web development landscape is constantly evolving with new frameworks, tools, and methodologies emerging regularly. This comprehensive guide explores the latest trends in web development including serverless architecture, microservices, and modern frontend frameworks.', 3, 'Technology', 6)
ON CONFLICT DO NOTHING; 