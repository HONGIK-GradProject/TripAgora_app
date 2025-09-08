import { getTokens } from '@/services/auth';
import axios, { AxiosInstance } from 'axios';

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
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error('API error:', error.toJSON());
    } else {
      console.error('Unexpected error:', error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;