import { apiService } from '../../../services/api';
import { API_CONFIG } from '../../../config/api';
import type { User, UserRole, PaginatedResponse, ApiResponse } from '../../../types';

export const userService = {
  getUsers: async (
    params: {
      page?: number;
      limit?: number;
      role?: UserRole;
      search?: string;
    } = {}
  ): Promise<PaginatedResponse<User>> => {
    const response = await apiService.get(API_CONFIG.ENDPOINTS.USERS.BASE, { params });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiService.get<ApiResponse<User>>(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`
    );
    return response.data.data!;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiService.put<ApiResponse<User>>(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`,
      data
    );
    return response.data.data!;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiService.delete(`${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`);
  },

  getUsersByParent: async (
    parentId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<User> & { parent: User }> => {
    const response = await apiService.get<ApiResponse<PaginatedResponse<User> & { parent: User }>>(
      API_CONFIG.ENDPOINTS.USERS.BY_PARENT(parentId),
      { params }
    );
    return response.data.data!;
  },

  getAvailableParents: async (role: UserRole): Promise<User[]> => {
    const response = await apiService.get<ApiResponse<User[]>>(
      API_CONFIG.ENDPOINTS.USERS.AVAILABLE_PARENTS,
      { params: { role } }
    );
    return response.data.data!;
  },
};
