// API service for communicating with backend
import axios from 'axios';

// Check if we're using Supabase (production) or Django (development)
const cleanApiUrl = process.env.REACT_APP_API_URL ? 
    process.env.REACT_APP_API_URL.replace(/^["']+|["']+$/g, '') : null;
const isSupabase = !!cleanApiUrl && cleanApiUrl.includes('supabase');

// Get API base URL
const getApiBaseUrl = () => {
    if (cleanApiUrl) {
        return cleanApiUrl;
    }
    
    return process.env.NODE_ENV === 'production' 
        ? 'https://qyqqhtwrtbjdcupvawbs.supabase.co/rest/v1'
        : 'http://localhost:8000/api';
};

// Add some sample data for when API is unavailable
const samplePosts = [
    {
        id: 1,
        title: "Welcome to Our Blog",
        excerpt: "This is a sample blog post to get you started.",
        content: "This is a sample blog post content. The API might be unavailable or the database might be empty.",
        author_id: "sample-user-id",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 2,
        title: "Getting Started with Blogging",
        excerpt: "Learn how to create your first blog post.",
        content: "Creating your first blog post is easy. Just click the 'Create Blog' button and start writing!",
        author_id: "sample-user-id",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

// Create axios instance with base configuration
const API_BASE_URL = getApiBaseUrl();

// Debug Supabase configuration
if (isSupabase) {
    console.log('🔧 Supabase Configuration:', {
        baseURL: API_BASE_URL,
        hasApiKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
        apiKeyLength: process.env.REACT_APP_SUPABASE_ANON_KEY?.length || 0
    });
}

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        ...(isSupabase && {
            'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY || ''}`
        })
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// Blog posts API - handles both Django and Supabase formats
export const blogAPI = {
    // Get all blog posts with pagination
    getPosts: async (params = {}) => {
        try {
            if (isSupabase) {
                // Supabase format
                console.log('🔍 Fetching posts from Supabase...');
                
                // Try to fetch posts from Supabase
                console.log('🔍 Making request to:', `${API_BASE_URL}/blog_posts`);
                console.log('🔍 Headers:', {
                    'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
                    'Authorization': process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
                });
                
                // Check if we have a valid API key
                if (!process.env.REACT_APP_SUPABASE_ANON_KEY) {
                    console.error('❌ No Supabase API key found');
                    throw new Error('No Supabase API key configured');
                }
                
                const response = await api.get('/blog_posts', { 
                    params: {
                        select: '*',
                        order: 'created_at.desc',
                        ...params
                    }
                });
                
                console.log('📦 Supabase response received');
                
                // Check if we got HTML instead of JSON (API error)
                if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
                    console.error('❌ API returned HTML instead of JSON - likely authentication issue');
                    throw new Error('API authentication failed - returned HTML');
                }
                
                // Ensure we always return an array
                const posts = Array.isArray(response.data) ? response.data : [];
                
                if (posts.length === 0) {
                    console.log('📝 No posts found in database, using sample data...');
                    return {
                        data: {
                            results: samplePosts,
                            count: samplePosts.length
                        }
                    };
                }
                
                return {
                    data: {
                        results: posts,
                        count: posts.length
                    }
                };
            } else {
                // Django format
                const response = await api.get('/posts/', { params });
                return response;
            }
        } catch (error) {
            console.error('❌ Error fetching posts:', error);
            console.error('❌ Error response:', error.response);
            console.error('❌ Error status:', error.response?.status);
            console.error('❌ Error data:', error.response?.data);
            
            // 401 error usually means authentication issue
            if (error.response?.status === 401) {
                console.error('🔐 401 Error - Authentication failed. Possible causes:');
                console.error('   - Supabase API key is invalid or expired');
                console.error('   - Row Level Security (RLS) is blocking access');
                console.error('   - Table permissions are not set correctly');
                console.error('   - Supabase project settings have changed');
            }
            
            console.log('🔄 Using sample data as fallback...');
            return {
                data: {
                    results: samplePosts,
                    count: samplePosts.length
                }
            };
        }
    },
    
    // Get single blog post
    getPost: async (id) => {
        try {
            if (isSupabase) {
                const response = await api.get(`/blog_posts?id=eq.${id}&select=*`);
                return {
                    data: response.data?.[0] || null
                };
            } else {
                const response = await api.get(`/posts/${id}/`);
                return response;
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            return { data: null };
        }
    },
    
    // Create new blog post
    createPost: (postData) => {
        if (isSupabase) {
            return api.post('/blog_posts', postData);
        } else {
            return api.post('/posts/', postData);
        }
    },
    
    // Update blog post
    updatePost: (id, postData) => {
        if (isSupabase) {
            return api.patch(`/blog_posts?id=eq.${id}`, postData);
        } else {
            return api.put(`/posts/${id}/`, postData);
        }
    },
    
    // Delete blog post
    deletePost: (id) => {
        if (isSupabase) {
            return api.delete(`/blog_posts?id=eq.${id}`);
        } else {
            return api.delete(`/posts/${id}/`);
        }
    },
    
    // Get user's posts
    getMyPosts: async () => {
        try {
            if (isSupabase) {
                const response = await api.get('/blog_posts', {
                    params: {
                        select: '*',
                        order: 'created_at.desc'
                    }
                });
                return {
                    data: {
                        results: response.data || [],
                        count: response.data?.length || 0
                    }
                };
            } else {
                const response = await api.get('/posts/my/');
                return response;
            }
        } catch (error) {
            console.error('Error fetching my posts:', error);
            return {
                data: {
                    results: [],
                    count: 0
                }
            };
        }
    },
    
    // Get posts by specific user
    getUserPosts: async (username) => {
        try {
            if (isSupabase) {
                const response = await api.get('/blog_posts', {
                    params: {
                        select: '*',
                        author_id: `eq.${username}`,
                        order: 'created_at.desc'
                    }
                });
                return {
                    data: {
                        results: response.data || [],
                        count: response.data?.length || 0
                    }
                };
            } else {
                const response = await api.get(`/posts/user/${username}/`);
                return response;
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
            return {
                data: {
                    results: [],
                    count: 0
                }
            };
        }
    },
    
    // Search posts
    searchPosts: async (query) => {
        try {
            if (isSupabase) {
                const response = await api.get('/blog_posts', {
                    params: {
                        select: '*',
                        or: `title.ilike.%${query}%,content.ilike.%${query}%`,
                        order: 'created_at.desc'
                    }
                });
                return {
                    data: {
                        results: response.data || [],
                        count: response.data?.length || 0
                    }
                };
            } else {
                const response = await api.get('/search/', { params: { q: query } });
                return response;
            }
        } catch (error) {
            console.error('Error searching posts:', error);
            return {
                data: {
                    results: [],
                    count: 0
                }
            };
        }
    },
    
    // Get categories (not available in current Supabase schema)
    getCategories: async () => {
        try {
            if (isSupabase) {
                // Return static categories since no categories table exists
                return {
                    data: [
                        { id: 1, name: 'Technology', description: 'Posts about technology and programming' },
                        { id: 2, name: 'Lifestyle', description: 'Posts about lifestyle and personal development' },
                        { id: 3, name: 'Programming', description: 'Programming tutorials and guides' },
                        { id: 4, name: 'Design', description: 'Design related posts' },
                        { id: 5, name: 'Business', description: 'Business and entrepreneurship' }
                    ]
                };
            } else {
                const response = await api.get('/categories/');
                return response;
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            return { data: [] };
        }
    },
};

// Authentication API - handles both Django and Supabase formats
export const authAPI = {
    // Register new user
    register: (userData) => {
        if (isSupabase) {
            return api.post('/auth/v1/signup', userData);
        } else {
            return api.post('/auth/register/', userData);
        }
    },
    
    // Login user
    login: async (credentials) => {
        try {
            if (isSupabase) {
                const response = await api.post('/auth/v1/token?grant_type=password', {
                    email: credentials.email,
                    password: credentials.password
                });
                return response;
            } else {
                const response = await api.post('/auth/login/', credentials);
                return response;
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    // Refresh token
    refreshToken: (refreshToken) => {
        if (isSupabase) {
            return api.post('/auth/v1/token?grant_type=refresh_token', { refresh_token: refreshToken });
        } else {
            return api.post('/auth/refresh/', { refresh: refreshToken });
        }
    },
    
    // Get user profile
    getProfile: async () => {
        try {
            if (isSupabase) {
                const token = localStorage.getItem('access_token');
                if (!token) throw new Error('No token');
                
                const response = await api.get('/auth/v1/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response;
            } else {
                const response = await api.get('/profile/');
                return response;
            }
        } catch (error) {
            console.error('Profile error:', error);
            throw error;
        }
    },
    
    // Update user profile
    updateProfile: (profileData) => {
        if (isSupabase) {
            return api.put('/auth/v1/user', profileData);
        } else {
            return api.patch('/profile/', profileData);
        }
    },
};

// Utility functions
export const apiUtils = {
    // Set auth tokens
    setTokens: (access, refresh) => {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    },
    
    // Clear auth tokens
    clearTokens: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },
    
    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },
    
    // Get current user from localStorage
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    // Set current user in localStorage
    setCurrentUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },
}; 