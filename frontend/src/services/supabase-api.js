// Supabase API service for communicating with Supabase backend
import axios from 'axios';
import { currentConfig } from '../config/config';

// Create axios instance with base configuration
const API_BASE_URL = currentConfig.API_BASE_URL;

export const supabaseApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY || ''}`
    },
});

// Request interceptor to add auth token
supabaseApi.interceptors.request.use(
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
supabaseApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// Blog posts API - Supabase format
export const blogAPI = {
    // Get all blog posts with pagination
    getPosts: async (params = {}) => {
        try {
            const response = await supabaseApi.get('/posts', { 
                params: {
                    select: '*',
                    order: 'created_at.desc',
                    ...params
                }
            });
            
            // Transform Supabase response to match expected format
            return {
                data: {
                    results: response.data || [],
                    count: response.data?.length || 0
                }
            };
        } catch (error) {
            console.error('Error fetching posts:', error);
            return {
                data: {
                    results: [],
                    count: 0
                }
            };
        }
    },
    
    // Get single blog post
    getPost: async (id) => {
        try {
            const response = await supabaseApi.get(`/posts?id=eq.${id}&select=*`);
            return {
                data: response.data?.[0] || null
            };
        } catch (error) {
            console.error('Error fetching post:', error);
            return { data: null };
        }
    },
    
    // Create new blog post
    createPost: (postData) => supabaseApi.post('/posts', postData),
    
    // Update blog post
    updatePost: (id, postData) => supabaseApi.patch(`/posts?id=eq.${id}`, postData),
    
    // Delete blog post
    deletePost: (id) => supabaseApi.delete(`/posts?id=eq.${id}`),
    
    // Get user's posts
    getMyPosts: async () => {
        try {
            const response = await supabaseApi.get('/posts', {
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
            const response = await supabaseApi.get('/posts', {
                params: {
                    select: '*',
                    author: `eq.${username}`,
                    order: 'created_at.desc'
                }
            });
            return {
                data: {
                    results: response.data || [],
                    count: response.data?.length || 0
                }
            };
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
            const response = await supabaseApi.get('/posts', {
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
    
    // Get categories
    getCategories: async () => {
        try {
            const response = await supabaseApi.get('/categories', {
                params: {
                    select: '*'
                }
            });
            return {
                data: response.data || []
            };
        } catch (error) {
            console.error('Error fetching categories:', error);
            return { data: [] };
        }
    },
};

// Authentication API - Supabase format
export const authAPI = {
    // Register new user
    register: (userData) => supabaseApi.post('/auth/v1/signup', userData),
    
    // Login user
    login: async (credentials) => {
        try {
            const response = await supabaseApi.post('/auth/v1/token?grant_type=password', {
                email: credentials.email,
                password: credentials.password
            });
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    // Refresh token
    refreshToken: (refreshToken) => supabaseApi.post('/auth/v1/token?grant_type=refresh_token', { refresh_token: refreshToken }),
    
    // Get user profile
    getProfile: async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error('No token');
            
            const response = await supabaseApi.get('/auth/v1/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response;
        } catch (error) {
            console.error('Profile error:', error);
            throw error;
        }
    },
    
    // Update user profile
    updateProfile: (profileData) => supabaseApi.put('/auth/v1/user', profileData),
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