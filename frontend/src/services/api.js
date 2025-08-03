// API service for communicating with backend
import axios from 'axios';

// Get API base URL based on environment
const getApiBaseUrl = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (apiUrl) {
        // Remove any surrounding quotes that Netlify might add
        const cleanedUrl = apiUrl.replace(/^["']+|["']+$/g, '');
        console.log('🔧 API URL Debug:', {
            original: apiUrl,
            cleaned: cleanedUrl,
            hadQuotes: apiUrl !== cleanedUrl
        });
        return cleanedUrl;
    }
    return 'http://localhost:8000/api';
};

// Check if we're using Supabase
const isSupabase = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) return false;
    const cleanedUrl = apiUrl.replace(/^["']+|["']+$/g, '');
    return cleanedUrl.includes('supabase.co');
};

// Get cleaned API key
const getCleanedApiKey = () => {
    const apiKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    if (!apiKey) return '';
    // Remove any surrounding quotes that Netlify might add
    return apiKey.replace(/^["']+|["']+$/g, '');
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

// Create axios instance with proper configuration
export const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
        ...(isSupabase() && {
            'apikey': getCleanedApiKey(),
            'Authorization': `Bearer ${getCleanedApiKey()}`
        })
    },
});

// Debug Supabase configuration
if (isSupabase()) {
    const originalKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
    const cleanedKey = getCleanedApiKey();
    console.log('🔧 Supabase Configuration:', {
        baseURL: getApiBaseUrl(),
        hasApiKey: !!originalKey,
        apiKeyLength: originalKey.length,
        cleanedKeyLength: cleanedKey.length,
        apiKeyStart: cleanedKey.substring(0, 20) + '...',
        apiKeyEnd: '...' + cleanedKey.substring(cleanedKey.length - 20),
        hadQuotes: originalKey !== cleanedKey,
        isValidJWT: cleanedKey.split('.').length === 3,
        fullCleanedKey: cleanedKey // Show the full key for debugging
    });
    
    // Test the API key format
    if (cleanedKey.split('.').length !== 3) {
        console.error('❌ Invalid JWT format - API key should have 3 parts separated by dots');
    }
    
    // Check if the key starts with the expected format
    if (!cleanedKey.startsWith('eyJ')) {
        console.error('❌ Invalid API key format - should start with "eyJ"');
    }
}

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token && !isSupabase()) {
            // Only add user token for Django backend, not for Supabase
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request details for debugging
        if (isSupabase()) {
            console.log('🔍 Supabase Request:', {
                url: config.url,
                method: config.method,
                headers: {
                    'apikey': config.headers.apikey ? 'SET' : 'NOT SET',
                    'Authorization': config.headers.Authorization ? 'SET' : 'NOT SET',
                    'Content-Type': config.headers['Content-Type']
                },
                params: config.params
            });
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
    // Get blog posts with pagination and search
    getPosts: async (params = {}) => {
        try {
            if (isSupabase()) {
                // Supabase format
                console.log('🔍 Fetching posts from Supabase...');
                
                // Remove page_size from params as it's not supported by Supabase, use limit instead
                const { page_size, page, ...supabaseParams } = params;
                
                // For Supabase, we need to handle pagination differently
                // If limit is provided, use it directly
                if (supabaseParams.limit) {
                    // Supabase uses 'limit' parameter directly
                    console.log('🔍 Using limit parameter for Supabase:', supabaseParams.limit);
                }
                
                const response = await api.get('/blog_posts', { 
                    params: {
                        select: '*',
                        order: 'created_at.desc',
                        ...supabaseParams
                    }
                });
                
                console.log('📦 Supabase response received');
                
                // Format response to match Django format
                return {
                    data: {
                        results: response.data || [],
                        count: response.data?.length || 0,
                        next: null,
                        previous: null
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
            
            if (error.response?.status === 401) {
                console.error('🔐 401 Error - Authentication failed. Possible causes:');
                console.error('   - Supabase API key is invalid or expired');
                console.error('   - Row Level Security (RLS) is blocking access');
                console.error('   - Table permissions are not set correctly');
                console.error('   - Supabase project settings have changed');
            }
            
            // Return sample data as fallback
            console.log('🔄 Using sample data as fallback...');
            return {
                data: {
                    results: samplePosts,
                    count: samplePosts.length,
                    next: null,
                    previous: null
                }
            };
        }
    },
    
    // Get single blog post
    getPost: async (id) => {
        try {
            if (isSupabase()) {
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
    createPost: async (postData) => {
        try {
            if (isSupabase()) {
                // Get current user to set as author
                const currentUser = apiUtils.getCurrentUser();
                console.log('🔍 Creating post - Current user:', currentUser);
                
                if (!currentUser || !currentUser.id) {
                    throw new Error('User not authenticated. Please log in to create a post.');
                }
                
                // Add author_id to the post data
                const postDataWithAuthor = {
                    ...postData,
                    author_id: currentUser.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                console.log('🔍 Creating post - Post data with author:', postDataWithAuthor);
                
                const response = await api.post('/blog_posts', postDataWithAuthor);
                return response;
            } else {
                const response = await api.post('/posts/', postData);
                return response;
            }
        } catch (error) {
            console.error('Error creating blog post:', error);
            if (error.response?.status === 409) {
                console.error('🔍 409 Conflict - Error details:', error.response.data);
                throw new Error('Blog post creation failed. This might be due to a duplicate entry or database constraint.');
            }
            throw error;
        }
    },
    
    // Update blog post
    updatePost: (id, postData) => {
        if (isSupabase()) {
            return api.patch(`/blog_posts?id=eq.${id}`, postData);
        } else {
            return api.put(`/posts/${id}/`, postData);
        }
    },
    
    // Delete blog post
    deletePost: (id) => {
        if (isSupabase()) {
            return api.delete(`/blog_posts?id=eq.${id}`);
        } else {
            return api.delete(`/posts/${id}/`);
        }
    },
    
    // Get user's posts
    getMyPosts: async () => {
        try {
            if (isSupabase()) {
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
            if (isSupabase()) {
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
            if (isSupabase()) {
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
            if (isSupabase()) {
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
    register: async (userData) => {
        try {
            if (isSupabase()) {
                // First check if user already exists
                const existingUserResponse = await api.get('/auth_users', {
                    params: {
                        email: `eq.${userData.email}`,
                        select: 'id'
                    }
                });
                
                if (existingUserResponse.data && existingUserResponse.data.length > 0) {
                    throw new Error('User with this email already exists. Please use a different email or try logging in.');
                }
                
                // For Supabase, we'll create a simple user registration
                // This uses the 'auth_users' table in your Supabase database
                const response = await api.post('/auth_users', {
                    email: userData.email,
                    username: userData.username || userData.email.split('@')[0],
                    password: userData.password, // In production, this should be hashed
                    created_at: new Date().toISOString()
                });
                
                // Return a mock token for now
                return {
                    data: {
                        user: response.data,
                        access_token: 'mock_token_' + Date.now(),
                        refresh_token: 'mock_refresh_token_' + Date.now()
                    }
                };
            } else {
                const response = await api.post('/auth/register/', userData);
                return response;
            }
        } catch (error) {
            console.error('Registration error:', error);
            // Provide better error messages
            if (error.response?.status === 409) {
                throw new Error('User with this email already exists. Please use a different email or try logging in.');
            } else if (error.message) {
                throw error;
            } else {
                throw new Error('Registration failed. Please try again.');
            }
        }
    },
    
    // Login user
    login: async (credentials) => {
        try {
            if (isSupabase()) {
                // For Supabase, we'll check if user exists in the auth_users table
                const response = await api.get('/auth_users', {
                    params: {
                        email: `eq.${credentials.email}`,
                        select: '*'
                    }
                });
                
                if (response.data && response.data.length > 0) {
                    const user = response.data[0];
                    // In production, you should verify the password hash
                    if (user.password === credentials.password) {
                        return {
                            data: {
                                user: user,
                                access_token: 'mock_token_' + Date.now(),
                                refresh_token: 'mock_refresh_token_' + Date.now()
                            }
                        };
                    } else {
                        throw new Error('Invalid credentials');
                    }
                } else {
                    throw new Error('User not found');
                }
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
        if (isSupabase()) {
            return api.post('/auth/v1/token?grant_type=refresh_token', { refresh_token: refreshToken });
        } else {
            return api.post('/auth/refresh/', { refresh: refreshToken });
        }
    },
    
    // Get user profile
    getProfile: async () => {
        try {
            if (isSupabase()) {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    // If no token, try to get user from localStorage
                    const currentUser = apiUtils.getCurrentUser();
                    if (currentUser) {
                        return {
                            data: {
                                user: currentUser
                            }
                        };
                    }
                    throw new Error('No token and no user found');
                }
                
                // For Supabase, we'll fetch the user from the auth_users table
                const currentUser = apiUtils.getCurrentUser();
                if (!currentUser || !currentUser.id) throw new Error('No current user found');
                
                const response = await api.get(`/auth_users?id=eq.${currentUser.id}&select=*`);
                return {
                    data: {
                        user: response.data?.[0] || currentUser
                    }
                };
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
        if (isSupabase()) {
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