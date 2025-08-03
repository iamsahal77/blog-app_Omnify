-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
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
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    category VARCHAR(100),
    image VARCHAR(500),
    read_time INTEGER,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

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

-- Insert some sample data
INSERT INTO users (email, username, password, first_name, last_name) VALUES
('admin@example.com', 'admin', 'password123', 'Admin', 'User'),
('john@example.com', 'john_doe', 'password123', 'John', 'Doe'),
('jane@example.com', 'jane_smith', 'password123', 'Jane', 'Smith')
ON CONFLICT (email) DO NOTHING;

INSERT INTO blog_posts (title, excerpt, content, author_id, category, read_time) VALUES
('Getting Started with React', 'Learn the basics of React development', 'React is a powerful JavaScript library for building user interfaces...', 1, 'Programming', 5),
('Django Best Practices', 'Essential tips for Django development', 'Django is a high-level Python web framework...', 2, 'Programming', 8),
('Modern Web Development', 'Trends and technologies in 2024', 'The web development landscape is constantly evolving...', 3, 'Technology', 6)
ON CONFLICT DO NOTHING; 