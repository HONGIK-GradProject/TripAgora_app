/**
 * @file 인증 관련 API 함수를 제공합니다. (로그인, 로그아웃, 카카오 연동)
 * @module api/auth
 */

import { login as kakaoLogin, logout as kakaoLogout } from '@react-native-seoul/kakao-login';

import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  ReissueRequest,
  ReissueResponse
} from '@/types/auth';
import apiClient from './client';

/**
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 재발급합니다.
 * @param {string} refreshToken - 재발급에 사용할 리프레시 토큰입니다.
 * @returns {Promise<ReissueResponse>} 성공 시 ReissueResponse를 반환합니다.
 */
export const reissue = async (refreshToken: string): Promise<ReissueResponse> => {
  const requestData: ReissueRequest = { refreshToken };
  const response = await apiClient.post<ReissueResponse>(
    '/auth/reissue',
    requestData
  );
  return response.data;
};

/**
 * 소셜 로그인을 통해 서버에 로그인을 시도하고, 성공 시 토큰 정보를 저장합니다.
 * @param {string} socialAccessToken - 소셜 로그인(카카오)을 통해 받은 액세스 토큰입니다.
 * @returns {Promise<LoginResponse | undefined>} 성공 시 LoginResponse를, 실패 시 undefined를 반환합니다.
 */
export const signIn = async (
  socialAccessToken: string
): Promise<LoginResponse> => {
  const requestData: LoginRequest = { socialAccessToken };
  const response = await apiClient.post<LoginResponse>(
    '/auth/login/KAKAO',
    requestData
  );
  return response.data;
};

/**
 * 서버에서 로그아웃을 처리하고, 저장된 토큰을 삭제합니다.
 * @returns {Promise<void>}
 */
export const signOut = async (): Promise<void> => {
  await apiClient.post<LogoutResponse>('/auth/logout', undefined, { _retry: true } as any);
};

/**
 * 카카오 로그인을 시도하고 액세스 토큰을 반환합니다.
 * 
 * @returns {Promise<string>} 성공 시 액세스 토큰을 포함하는 Promise를 반환합니다.
 * @throws {Error} 로그인 과정에서 에러가 발생할 경우 'login error' 메시지를 포함한 에러를 발생시킵니다.
 */
const kakaoSignIn = async (): Promise<string> => {
  try {
    const token = await kakaoLogin();
    return token.accessToken;
  }
  catch (err) {
    throw new Error('login error', { cause: err });
  }
};

/**
 * 카카오 로그아웃을 시도합니다.
 * 
 * @returns {Promise<void>} 로그아웃 성공 시 Promise를 반환합니다.
 * @throws {Error} 로그아웃 과정에서 에러가 발생할 경우 'logout error' 메시지를 포함한 에러를 발생시킵니다.
 */
const kakaoSignOut = async (): Promise<void> => {
  try {
    const msg = await kakaoLogout();
  }
  catch (err) {
    throw new Error('logout error', { cause: err });
  }
};

export { kakaoSignIn, kakaoSignOut };

