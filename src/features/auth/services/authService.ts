import { apiService } from '../../../services/api';
import { API_CONFIG } from '../../../config/api';
import type { LoginFormData, SignupFormData, AuthResponse, ApiResponse } from '../../../types';

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data);

    return response.data as AuthResponse;
  },

  signup: async (data: SignupFormData): Promise<AuthResponse> => {
    const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiService.get<ApiResponse<{ user: any }>>(
      API_CONFIG.ENDPOINTS.AUTH.PROFILE
    );
    return response.data.data!.user;
  },

  forgotPassword: async (email: string) => {
    const response = await apiService.post<ApiResponse>(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  },

  resetPassword: async (token: string, password: string, confirmPassword: string) => {
    const response = await apiService.post<ApiResponse<AuthResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, password, confirmPassword }
    );
    return response.data.data!;
  },
};
