/**
 * @file 인증 관련 API 함수를 제공합니다. (로그인, 로그아웃, 카카오 연동)
 * @module api/auth
 */

import { login as kakaoLogin, logout as kakaoLogout } from '@react-native-seoul/kakao-login';

import { clearTokens, saveTokens } from '@/services/auth';
import {
  LoginRequest,
  LoginResponse
} from '@/types/auth';
import axios from 'axios';
import apiClient from './client';

/**
 * 소셜 로그인을 통해 서버에 로그인을 시도하고, 성공 시 토큰 정보를 저장합니다.
 * @param {string} socialAccessToken - 소셜 로그인(카카오)을 통해 받은 액세스 토큰입니다.
 * @returns {Promise<LoginResponse | undefined>} 성공 시 LoginResponse를, 실패 시 undefined를 반환합니다.
 */
export const signIn = async (
  socialAccessToken: string
): Promise<LoginResponse | undefined> => {
  try {
    const requestData: LoginRequest = { socialAccessToken };

    const response = await apiClient.post<LoginResponse>(
      '/auth/login/KAKAO',
      requestData
    );

    if (response.data.data) {
      const { accessToken, refreshToken, isNewUser } = response.data.data;
      await saveTokens(accessToken, refreshToken);

      console.log('로그인 성공:', { accessToken, refreshToken, isNewUser });
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('로그인 실패:', error.toJSON());
    } else {
      console.error('예상치 못한 오류 발생:', error);
    }
  }
};

/**
 * 서버에서 로그아웃을 처리하고, 저장된 토큰을 삭제합니다.
 * @returns {Promise<void>}
 */
export const signOut = async (): Promise<void> => {
  try {
    // 처음부터 _retry 플래그를 true로 설정
    await apiClient.post('/auth/logout', undefined, { _retry: true } as any);
    console.log('서버 로그아웃 성공');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // 에러가 아닌 단순 토큰 만료일 가능성 매우 높음
      console.log('로그아웃 요청 시 401 응답 (예상된 동작일 수 있음)');
    } else if (axios.isAxiosError(error)) {
      console.error('서버 로그아웃 실패:', error.toJSON());
    } else {
      console.error('서버 로그아웃 중 예상치 못한 오류 발생:', error);
    }
  } finally {
    try {
      await kakaoSignOut();
      console.log('카카오 로그아웃 성공');
    } catch (error) {
      console.error('카카오 로그아웃 실패:', error);
    }
    await clearTokens();
    console.log('토큰 삭제 완료');
  }
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

