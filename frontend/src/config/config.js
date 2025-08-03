// Configuration file for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api',
    FRONTEND_URL: 'http://localhost:5173',
  },
  production: {
    API_BASE_URL: cleanApiUrl || 'https://qyqqhtwrtbjdcupvawbs.supabase.co/rest/v1',
    FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'https://omnifyblogss.netlify.app',
  },
};

// Clean up environment variables (remove extra quotes if present)
const cleanApiUrl = process.env.REACT_APP_API_URL ? 
    process.env.REACT_APP_API_URL.replace(/^["']|["']$/g, '') : null;

// Get current environment - use production if API URL is set, otherwise use NODE_ENV
const environment = cleanApiUrl ? 'production' : (process.env.NODE_ENV === 'production' ? 'production' : 'development');

// Export current environment config
export const currentConfig = config[environment] || config.development;

// Export all configs for reference
export default config; 