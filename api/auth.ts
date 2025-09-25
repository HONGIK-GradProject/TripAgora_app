/**
 * @file 인증 관련 API 함수를 제공합니다. (로그인, 로그아웃, 카카오 연동)
 * @module api/auth
 */

import {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutResponse,
  AuthReissueRequest,
  AuthReissueResponse
} from '@/types/auth';
import apiClient from './client';

/**
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 재발급합니다.
 * @param {string} refreshToken - 재발급에 사용할 리프레시 토큰입니다.
 * @returns {Promise<AuthReissueResponse>} 성공 시 AuthReissueResponse를 반환합니다.
 */
const reissue = async (refreshToken: string): Promise<AuthReissueResponse> => {
  const requestData: AuthReissueRequest = { refreshToken };
  const response = await apiClient.post<AuthReissueResponse>(
    '/auth/reissue',
    requestData
  );
  return response.data;
};

/**
 * 소셜 로그인을 통해 서버에 로그인을 시도하고, 성공 시 토큰 정보를 저장합니다.
 * @param {string} socialAccessToken - 소셜 로그인(카카오)을 통해 받은 액세스 토큰입니다.
 * @returns {Promise<AuthLoginResponse | undefined>} 성공 시 AuthLoginResponse를, 실패 시 undefined를 반환합니다.
 */
const signIn = async (
  socialAccessToken: string
): Promise<AuthLoginResponse> => {
  const requestData: AuthLoginRequest = { socialAccessToken };
  const response = await apiClient.post<AuthLoginResponse>(
    '/auth/login/KAKAO',
    requestData
  );
  return response.data;
};

/**
 * 서버에서 로그아웃을 처리합니다.
 * @returns {Promise<void>}
 */
const signOut = async (): Promise<void> => {
  await apiClient.post<AuthLogoutResponse>('/auth/logout', undefined, { _retry: true } as any);
};

export const authApi = {
  reissue,
  signIn,
  signOut
};

