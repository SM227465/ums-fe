import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api';
import { cookieService } from './cookieService';

class ApiService {
  private api;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  private excludedEndpoints = [
    API_CONFIG.ENDPOINTS.AUTH.LOGIN,
    API_CONFIG.ENDPOINTS.AUTH.SIGNUP,
    API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
    API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
    API_CONFIG.ENDPOINTS.AUTH.REFRESH,
  ];

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private isExcludedEndpoint(url: string): boolean {
    return this.excludedEndpoints.some((endpoint) => url.includes(endpoint));
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!this.isExcludedEndpoint(config.url || '')) {
          const token = cookieService.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (this.isExcludedEndpoint(originalRequest.url || '')) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.api(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = cookieService.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post(
              `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
              { refreshToken },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            const { tokens } = response.data.data;
            const newToken = tokens.access.token;
            const newRefreshToken = tokens.refresh.token;

            cookieService.setToken(newToken);
            cookieService.setRefreshToken(newRefreshToken);

            this.processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            cookieService.clearTokens();
            if (
              !window.location.pathname.includes('/login') &&
              !window.location.pathname.includes('/signup')
            ) {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // HTTP methods
  get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.api.get(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.api.post(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.api.put(url, data, config);
  }

  delete<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.api.delete(url, config);
  }
}

export const apiService = new ApiService();
