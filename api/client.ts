/**
 * @file API 통신을 위한 Axios 클라이언트 설정 파일입니다.
 * @module api/client
 * @description 요청 및 응답 인터셉터를 사용하여 Axios 인스턴스를 구성합니다.
 * 요청 인터셉터는 인증 헤더에 액세스 토큰을 추가합니다.
 * 응답 인터셉터는 401 오류 발생 시 토큰 재발급을 시도하고 원래 요청을 재시도합니다.
 */

import { clearTokens, getTokens, reissueToken } from '@/services/auth';
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

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 및 재발급 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('액세스 토큰 만료, 토큰 재발급 시도 중...');
      try {
        const newAccessToken = await reissueToken();
        if (newAccessToken) {
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error('토큰 재발급 실패');
        }
      } catch (refreshError) {
        await clearTokens();
        console.error('토큰 재발급 실패, 로그인 화면으로 리디렉션합니다.');
        // 여기서 사용자를 로그인 화면으로 이동시키는 로직을 추가할 수 있습니다.
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

export default apiClient;