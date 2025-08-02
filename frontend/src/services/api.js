// API service for communicating with Django backend
import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
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

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    const { access } = response.data;
                    localStorage.setItem('access_token', access);
                    
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token failed, redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

// Authentication API
export const authAPI = {
    // Register new user
    register: (userData) => api.post('/auth/register/', userData),
    
    // Login user
    login: (credentials) => api.post('/auth/login/', credentials),
    
    // Refresh token
    refreshToken: (refreshToken) => api.post('/auth/refresh/', { refresh: refreshToken }),
    
    // Get user profile
    getProfile: () => api.get('/profile/'),
    
    // Update user profile
    updateProfile: (profileData) => api.patch('/profile/', profileData),
};

// Blog posts API
export const blogAPI = {
    // Get all blog posts with pagination
    getPosts: (params = {}) => api.get('/posts/', { params }),
    
    // Get single blog post
    getPost: (id) => api.get(`/posts/${id}/`),
    
    // Create new blog post
    createPost: (postData) => api.post('/posts/', postData),
    
    // Update blog post
    updatePost: (id, postData) => api.put(`/posts/${id}/`, postData),
    
    // Delete blog post
    deletePost: (id) => api.delete(`/posts/${id}/`),
    
    // Get user's posts
    getMyPosts: () => api.get('/posts/my/'),
    
    // Get posts by specific user
    getUserPosts: (username) => api.get(`/posts/user/${username}/`),
    
    // Search posts
    searchPosts: (query) => api.get('/search/', { params: { q: query } }),
    
    // Get categories
    getCategories: () => api.get('/categories/'),
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

export default api; 