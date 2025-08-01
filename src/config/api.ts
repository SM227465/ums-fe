export const API_CONFIG = {
  BASE_URL: 'https://ums-be.onrender.com/api/v1',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      PROFILE: '/auth/profile',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      REFRESH: '/auth/refresh',
    },
    USERS: {
      BASE: '/users',
      BY_PARENT: (parentId: string) => `/users/parent/${parentId}`,
      AVAILABLE_PARENTS: '/users/available-parents',
    },
  },
} as const;

export const COOKIE_CONFIG = {
  TOKEN_NAME: 'auth_token',
  REFRESH_TOKEN_NAME: 'refresh_token',
  OPTIONS: {
    path: '/',
    secure: import.meta.env.PROD,
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};
