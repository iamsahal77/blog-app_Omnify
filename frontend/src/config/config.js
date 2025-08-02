// Configuration file for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api',
    FRONTEND_URL: 'http://localhost:5173',
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://your-supabase-project.supabase.co/rest/v1',
    FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'https://your-domain.com',
  },
};

// Get current environment - use production for deployed sites
const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// Export current environment config
export const currentConfig = config[environment] || config.development;

// Export all configs for reference
export default config; 