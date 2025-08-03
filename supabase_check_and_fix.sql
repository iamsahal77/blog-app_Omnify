-- Supabase Database Check and Fix
-- Run this in your Supabase SQL Editor to check and fix any missing components

-- Check if tables exist and create them if they don't
DO $$
BEGIN
    -- Check if auth_users table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'auth_users') THEN
        CREATE TABLE auth_users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(100) UNIQUE,
            password VARCHAR(255),
            bio TEXT,
            avatar_url TEXT,
            website TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created auth_users table';
    ELSE
        RAISE NOTICE 'auth_users table already exists';
    END IF;

    -- Check if blog_posts table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_posts') THEN
        CREATE TABLE blog_posts (
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
        RAISE NOTICE 'Created blog_posts table';
    ELSE
        RAISE NOTICE 'blog_posts table already exists';
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
    -- Check and create blog_posts policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Allow public read access to published posts') THEN
        CREATE POLICY "Allow public read access to published posts" ON blog_posts
            FOR SELECT USING (published = true);
        RAISE NOTICE 'Created blog_posts read policy';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Allow authenticated users to create posts') THEN
        CREATE POLICY "Allow authenticated users to create posts" ON blog_posts
            FOR INSERT WITH CHECK (true);
        RAISE NOTICE 'Created blog_posts insert policy';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Allow authors to update their own posts') THEN
        CREATE POLICY "Allow authors to update their own posts" ON blog_posts
            FOR UPDATE USING (true);
        RAISE NOTICE 'Created blog_posts update policy';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Allow authors to delete their own posts') THEN
        CREATE POLICY "Allow authors to delete their own posts" ON blog_posts
            FOR DELETE USING (true);
        RAISE NOTICE 'Created blog_posts delete policy';
    END IF;

    -- Check and create auth_users policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'auth_users' AND policyname = 'Allow public read access to user profiles') THEN
        CREATE POLICY "Allow public read access to user profiles" ON auth_users
            FOR SELECT USING (true);
        RAISE NOTICE 'Created auth_users read policy';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'auth_users' AND policyname = 'Allow users to update their own profile') THEN
        CREATE POLICY "Allow users to update their own profile" ON auth_users
            FOR UPDATE USING (true);
        RAISE NOTICE 'Created auth_users update policy';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'auth_users' AND policyname = 'Allow users to insert their own profile') THEN
        CREATE POLICY "Allow users to insert their own profile" ON auth_users
            FOR INSERT WITH CHECK (true);
        RAISE NOTICE 'Created auth_users insert policy';
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);

-- Create sample user if it doesn't exist
INSERT INTO auth_users (email, username, password, bio) 
VALUES ('admin@blog.com', 'admin', 'password123', 'Administrator of the blog')
ON CONFLICT (email) DO NOTHING;

-- Create sample posts if they don't exist
DO $$
DECLARE
    sample_user_id UUID;
    post_count INTEGER;
BEGIN
    -- Get the sample user's ID
    SELECT id INTO sample_user_id FROM auth_users WHERE email = 'admin@blog.com';
    
    -- Check if sample posts already exist
    SELECT COUNT(*) INTO post_count FROM blog_posts WHERE title = 'Welcome to Our Blog';
    
    IF post_count = 0 AND sample_user_id IS NOT NULL THEN
        -- Insert sample blog posts
        INSERT INTO blog_posts (title, content, excerpt, category, author_id, published) VALUES
        (
            'Welcome to Our Blog',
            'This is a sample blog post to get you started. The API might be unavailable or the database might be empty.',
            'This is a sample blog post to get you started.',
            'Technology',
            sample_user_id,
            true
        ),
        (
            'Getting Started with Blogging',
            'Creating your first blog post is easy. Just click the "Create Blog" button and start writing!',
            'Learn how to create your first blog post.',
            'Programming',
            sample_user_id,
            true
        );
        RAISE NOTICE 'Created sample blog posts';
    ELSE
        RAISE NOTICE 'Sample posts already exist or no sample user found';
    END IF;
END $$;

-- Create function and triggers if they don't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_auth_users_updated_at ON auth_users;
CREATE TRIGGER update_auth_users_updated_at 
    BEFORE UPDATE ON auth_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Show current status
SELECT 
    'Tables' as type,
    table_name as name,
    'exists' as status
FROM information_schema.tables 
WHERE table_name IN ('auth_users', 'blog_posts')
UNION ALL
SELECT 
    'Policies' as type,
    policyname as name,
    'exists' as status
FROM pg_policies 
WHERE tablename IN ('auth_users', 'blog_posts'); 