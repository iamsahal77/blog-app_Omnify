// Configuration file for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api',
    FRONTEND_URL: 'http://localhost:5173',
  },
  production: {
    API_BASE_URL: 'https://your-api-domain.com/api',
    FRONTEND_URL: 'https://your-domain.com',
  },
};

// Get current environment
const environment = 'development'; // Default to development for now

// Export current environment config
export const currentConfig = config[environment] || config.development;

// Export all configs for reference
export default config; 