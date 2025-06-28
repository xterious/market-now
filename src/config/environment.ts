// Environment configuration for the API
export const config = {
  // API base URL - update this based on your environment
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  
  // Use CORS proxy for development if needed
  apiBaseUrlWithProxy: import.meta.env.VITE_USE_CORS_PROXY === 'true' 
    ? 'https://cors-anywhere.herokuapp.com/http://localhost:8080'
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'),
  
  // API timeout in milliseconds
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  // Enable API logging in development
  apiLogging: import.meta.env.VITE_API_LOGGING === 'true',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validate required environment variables
if (!config.apiBaseUrl) {
  console.warn('VITE_API_BASE_URL is not set, using default: http://localhost:8080');
} 