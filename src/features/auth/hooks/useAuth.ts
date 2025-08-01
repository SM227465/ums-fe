import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useCookieService } from '../../../services/cookieService';

import { useNavigate } from 'react-router-dom';
import type { AuthResponse } from '../../../types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { token, setToken, setRefreshToken, clearTokens } = useCookieService();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data: AuthResponse) => {
      toast.success(`Welcome ${data.user.firstName}`);
      const accessExpirationDate = new Date(Date.now() + data.tokens.access.expiresIn);
      const refreshExpirationDate = new Date(Date.now() + data.tokens.refresh.expiresIn);

      setToken(data.tokens.access.token, accessExpirationDate);
      setRefreshToken(data.tokens.refresh.token, refreshExpirationDate);
      queryClient.setQueryData(['user'], data.user);
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onSuccess: (data: AuthResponse) => {
      console.log(data);

      toast.success(data.message!);
      const accessExpirationDate = new Date(Date.now() + data.tokens.access.expiresIn);
      const refreshExpirationDate = new Date(Date.now() + data.tokens.refresh.expiresIn);

      setToken(data.tokens.access.token, accessExpirationDate);
      setRefreshToken(data.tokens.refresh.token, refreshExpirationDate);
      queryClient.setQueryData(['user'], data.user);
      navigate('/dashboard');
    },
    onError: (error: any) => {
      console.log(error);

      toast.error(error?.response?.data?.message);
    },
  });

  const profileQuery = useQuery({
    queryKey: ['user'],
    queryFn: authService.getProfile,
    enabled: !!token,
    retry: false,
  });

  const logout = () => {
    clearTokens();
    queryClient.clear();
    navigate('/login');
  };

  return {
    // Mutations
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout,

    // States
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isAuthenticated: !!token,
    user: profileQuery.data,
    isLoadingUser: profileQuery.isLoading,

    // Errors
    loginError: loginMutation.error,
    signupError: signupMutation.error,
  };
};
