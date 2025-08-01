import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { UserRole } from '../../../types';

export const useUsers = (
  params: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  } = {}
) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
  });
};

export const useUser = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id && enabled,
  });
};

export const useUsersByParent = (
  parentId: string,
  params: {
    page?: number;
    limit?: number;
  } = {}
) => {
  return useQuery({
    queryKey: ['users', 'parent', parentId, params],
    queryFn: () => userService.getUsersByParent(parentId, params),
    enabled: !!parentId,
  });
};

export const useAvailableParents = (role: UserRole, enabled = true) => {
  return useQuery({
    queryKey: ['users', 'available-parents', role],
    queryFn: () => userService.getAvailableParents(role),
    enabled: enabled && !!role,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
