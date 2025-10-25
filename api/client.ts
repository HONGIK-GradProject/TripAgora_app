/**
 * @file API 통신을 위한 Axios 클라이언트 설정 파일입니다.
 * @module api/client
 * @description 요청 및 응답 인터셉터를 사용하여 Axios 인스턴스를 구성합니다.
 * 요청 인터셉터는 인증 헤더에 액세스 토큰을 추가합니다.
 * 응답 인터셉터는 401 오류 발생 시 토큰 재발급을 시도하고 원래 요청을 재시도합니다.
 */

import { getTokens } from '@/lib/tokenStorage';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * 재시도 플래그를 포함하는 사용자 정의 Axios 요청 설정입니다.
 */
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 1. JSON 요청을 위한 기본 클라이언트
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

// 2. multipart/form-data 요청을 위한 전용 클라이언트
export const apiClientMultipart: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

// --- 요청 인터셉터 설정 ---

// `apiClient`용: JSON 요청 처리
apiClient.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();
    const accessToken = tokens.accessToken;

    config.headers['Content-Type'] = 'application/json';

    if (config.url === '/auth/reissue') {
      config.headers.Authorization = undefined;
    } else if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// `apiClientMultipart`용: FormData 요청 처리
apiClientMultipart.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();
    const accessToken = tokens.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // FormData 요청 시 Content-Type을 명시적으로 지정하여 boundary 문제를 해결합니다.
    config.headers['Content-Type'] = 'multipart/form-data';

    return config;
  },
  (error) => Promise.reject(error)
);

// --- 응답 인터셉터 설정 (공통 로직) ---

/**
 * @description Axios 응답 인터셉터를 설정합니다. 401 오류 발생 시 토큰 재발급을 시도하고, 실패 시 로그아웃을 실행합니다.
 */
export const setupInterceptors = (
  reissueToken: () => Promise<string | undefined>,
  signOut: () => Promise<void>
) => {
  const responseInterceptor = async (error: any) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (originalRequest.url === '/auth/reissue') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('액세스 토큰 만료, 토큰 재발급 시도 중...');
      try {
        const newAccessToken = await reissueToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          // 원래 요청의 Content-Type을 확인하여 적절한 클라이언트로 재시도합니다.
          if (originalRequest.headers['Content-Type'] === 'multipart/form-data') {
            return apiClientMultipart(originalRequest);
          }
          return apiClient(originalRequest);
        } else {
          throw new Error('토큰 재발급 실패');
        }
      } catch (refreshError) {
        signOut();
        return Promise.reject(refreshError);
      }
    }
    if (axios.isAxiosError(error)) {
      console.error('API 오류:', error.toJSON());
    } else {
      console.error('예상치 못한 오류:', error);
    }
    return Promise.reject(error);
  };

  // 두 클라이언트에 공통 응답 인터셉터 적용
  apiClient.interceptors.response.use((response) => response, responseInterceptor);
  apiClientMultipart.interceptors.response.use((response) => response, responseInterceptor);
};

export default apiClient;
