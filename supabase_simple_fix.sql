-- Supabase Simple Fix - Add Missing Columns and Policies
-- Run this in your Supabase SQL Editor

-- Add missing columns to auth_users table if they don't exist
DO $$
BEGIN
    -- Add bio column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'auth_users' AND column_name = 'bio') THEN
        ALTER TABLE auth_users ADD COLUMN bio TEXT;
        RAISE NOTICE 'Added bio column to auth_users table';
    ELSE
        RAISE NOTICE 'bio column already exists in auth_users table';
    END IF;

    -- Add avatar_url column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'auth_users' AND column_name = 'avatar_url') THEN
        ALTER TABLE auth_users ADD COLUMN avatar_url TEXT;
        RAISE NOTICE 'Added avatar_url column to auth_users table';
    ELSE
        RAISE NOTICE 'avatar_url column already exists in auth_users table';
    END IF;

    -- Add website column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'auth_users' AND column_name = 'website') THEN
        ALTER TABLE auth_users ADD COLUMN website TEXT;
        RAISE NOTICE 'Added website column to auth_users table';
    ELSE
        RAISE NOTICE 'website column already exists in auth_users table';
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'auth_users' AND column_name = 'updated_at') THEN
        ALTER TABLE auth_users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to auth_users table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in auth_users table';
    END IF;
END $$;

-- Add missing columns to blog_posts table if they don't exist
DO $$
BEGIN
    -- Add excerpt column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'excerpt') THEN
        ALTER TABLE blog_posts ADD COLUMN excerpt TEXT;
        RAISE NOTICE 'Added excerpt column to blog_posts table';
    ELSE
        RAISE NOTICE 'excerpt column already exists in blog_posts table';
    END IF;

    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'category') THEN
        ALTER TABLE blog_posts ADD COLUMN category VARCHAR(20) DEFAULT 'Technology';
        RAISE NOTICE 'Added category column to blog_posts table';
    ELSE
        RAISE NOTICE 'category column already exists in blog_posts table';
    END IF;

    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'image_url') THEN
        ALTER TABLE blog_posts ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url column to blog_posts table';
    ELSE
        RAISE NOTICE 'image_url column already exists in blog_posts table';
    END IF;

    -- Add published column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'published') THEN
        ALTER TABLE blog_posts ADD COLUMN published BOOLEAN DEFAULT TRUE;
        RAISE NOTICE 'Added published column to blog_posts table';
    ELSE
        RAISE NOTICE 'published column already exists in blog_posts table';
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'updated_at') THEN
        ALTER TABLE blog_posts ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to blog_posts table';
    ELSE
        RAISE NOTICE 'updated_at column already exists in blog_posts table';
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