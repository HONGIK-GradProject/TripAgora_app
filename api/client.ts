import { clearTokens, getTokens } from '@/services/auth';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { reissueToken } from './auth';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();
    const accessToken = tokens.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('Added Authorization header:', config.headers.Authorization);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('Access token expired, attempting to reissue token...');
      try {
        const token = await reissueToken();
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('Token reissue failed');
        }
      } catch (refreshError) {
        // remove tokens and redirect to login
        await clearTokens();
        console.error('Token reissue failed, redirecting to login.');
        return Promise.reject(refreshError);
      }
    }
    if (axios.isAxiosError(error)) {
      console.error('API error:', error.toJSON());
    } else {
      console.error('Unexpected error:', error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;