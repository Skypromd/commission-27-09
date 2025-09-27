// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  API_VERSION: '/api',
  ENDPOINTS: {
    USERS: '/api/users/',
    CLIENTS: '/api/clients/',
    COMMISSIONS: '/api/commissions/',
    AUTH: '/api/token',
    PRODUCTS: '/api/products/',
    ANALYTICS: '/api/analytics/',
    HEALTH: '/health'
  }
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export for backward compatibility
export const API_BASE = API_CONFIG.BASE_URL;
