export const UserRole = {
  ADMIN: 'admin',
  SUB_ADMIN: 'sub-admin',
  USER: 'user',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: UserRole;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  parentId?: string;
}

export interface AuthResponse {
  tokens: {
    access: {
      token: string;
      expiresIn: number;
      tokenExpireUnit: string;
    };
    refresh: {
      token: string;
      expiresIn: number;
      tokenExpireUnit: string;
    };
  };
  user: User;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
  messsage: string;
}
