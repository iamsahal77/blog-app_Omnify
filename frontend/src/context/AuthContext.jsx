// Authentication context for managing user state
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, apiUtils } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (token && apiUtils.isAuthenticated()) {
                    const userData = apiUtils.getCurrentUser();
                    if (userData) {
                        setUser(userData);
                        setIsAuthenticated(true);
                    } else {
                        // Try to get user profile from API
                        const response = await authAPI.getProfile();
                        const userProfile = response.data;
                        setUser(userProfile.user);
                        setIsAuthenticated(true);
                        apiUtils.setCurrentUser(userProfile.user);
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                apiUtils.clearTokens();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authAPI.login(credentials);
            const { access, refresh } = response.data;
            
            // Get user profile
            const profileResponse = await authAPI.getProfile();
            const userData = profileResponse.data.user;
            
            // Store tokens and user data
            apiUtils.setTokens(access, refresh);
            apiUtils.setCurrentUser(userData);
            
            setUser(userData);
            setIsAuthenticated(true);
            
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return { 
                success: false, 
                error: error.response?.data?.detail || 'Login failed' 
            };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await authAPI.register(userData);
            
            // Auto-login after registration
            const loginResult = await login({
                email: userData.email,
                password: userData.password
            });
            
            return loginResult;
        } catch (error) {
            console.error('Registration failed:', error);
            return { 
                success: false, 
                error: error.response?.data || 'Registration failed' 
            };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        apiUtils.clearTokens();
        setUser(null);
        setIsAuthenticated(false);
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            const response = await authAPI.updateProfile(profileData);
            const updatedUser = response.data.user;
            
            setUser(updatedUser);
            apiUtils.setCurrentUser(updatedUser);
            
            return { success: true };
        } catch (error) {
            console.error('Profile update failed:', error);
            return { 
                success: false, 
                error: error.response?.data || 'Profile update failed' 
            };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 