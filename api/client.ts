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
 * @interface CustomInternalAxiosRequestConfig
 * @extends {InternalAxiosRequestConfig}
 */
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  /**
   * 요청이 재시도되었는지 여부를 나타내는 플래그입니다.
   * @property {boolean} [_retry] - 선택적 재시도 플래그입니다.
   */
  _retry?: boolean;
}

/**
 * 애플리케이션의 기본 Axios 클라이언트 인스턴스입니다.
 * @type {AxiosInstance}
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 헤더에 액세스 토큰 추가
apiClient.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();
    const accessToken = tokens.accessToken;

    // 토큰 재발급 API에서 액세스 토큰을 검증하는 로직을 회피합니다.
    if (config.url === '/auth/reissue') {
      config.headers.Authorization = undefined;
    }
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * @description Axios 응답 인터셉터를 설정합니다. 401 오류 발생 시 토큰 재발급을 시도하고, 실패 시 로그아웃을 실행합니다.
 * @param {() => Promise<void>} signOut - 토큰 재발급 실패 시 호출될 로그아웃 함수입니다.
 */
export const setupInterceptors = (
  reissueToken: () => Promise<string | undefined>,
  signOut: () => Promise<void>
) => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as CustomInternalAxiosRequestConfig;

      // 토큰 재발급 요청 자체에서 발생한 401은 무시하여 무한 루프를 방지합니다.
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
    }
  );
};

export default apiClient;