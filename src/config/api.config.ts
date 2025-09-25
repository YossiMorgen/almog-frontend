export const API_CONFIG = {
  BASE_URL: 'http://localhost:3040',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      USER_DETAILS: '/api/auth/user/details'
    }
  }
} as const;
