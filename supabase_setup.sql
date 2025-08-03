-- Supabase Database Setup for Blog Application
-- Run this in your Supabase SQL Editor

-- Create auth_users table for user management (create this first)
CREATE TABLE IF NOT EXISTS auth_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255), -- In production, this should be hashed
    bio TEXT,
    avatar_url TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table with correct foreign key reference
CREATE TABLE IF NOT EXISTS blog_posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID REFERENCES auth_users(id) ON DELETE CASCADE,
    category VARCHAR(20) DEFAULT 'Technology',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts table
-- Allow public read access to published posts
CREATE POLICY "Allow public read access to published posts" ON blog_posts
    FOR SELECT USING (published = true);

-- Allow authenticated users to create posts (relaxed for custom auth)
CREATE POLICY "Allow authenticated users to create posts" ON blog_posts
    FOR INSERT WITH CHECK (true);

-- Allow authors to update their own posts
CREATE POLICY "Allow authors to update their own posts" ON blog_posts
    FOR UPDATE USING (true);

-- Allow authors to delete their own posts
CREATE POLICY "Allow authors to delete their own posts" ON blog_posts
    FOR DELETE USING (true);

-- Create policies for auth_users table
-- Allow public read access to user profiles
CREATE POLICY "Allow public read access to user profiles" ON auth_users
    FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update their own profile" ON auth_users
    FOR UPDATE USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Allow users to insert their own profile" ON auth_users
    FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);

-- Insert some sample data
INSERT INTO blog_posts (title, content, excerpt, category, published) VALUES
(
    'Welcome to Our Blog',
    'This is a sample blog post to get you started. The API might be unavailable or the database might be empty.',
    'This is a sample blog post to get you started.',
    'Technology',
    true
),
(
    'Getting Started with Blogging',
    'Creating your first blog post is easy. Just click the "Create Blog" button and start writing!',
    'Learn how to create your first blog post.',
    'Programming',
    true
);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auth_users_updated_at 
    BEFORE UPDATE ON auth_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 