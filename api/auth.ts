import { login as kakaoLogin, logout as kakaoLogout } from '@react-native-seoul/kakao-login';

import { clearTokens, saveTokens } from '@/services/auth';
import { LoginRequest, LoginResponse, LogoutResponse } from '@/types/auth';
import axios from 'axios';
import apiClient from './client';


/**
 * 소셜 로그인을 통해 서버에 로그인을 시도하고, 성공 시 토큰 정보를 저장합니다.
 * @param socialAccessToken - 소셜 로그인(카카오)을 통해 받은 액세스 토큰
 * @returns 성공 시 LoginResponse를, 실패 시 undefined를 반환합니다.
 */
export const signIn = async (
  socialAccessToken: string
): Promise<LoginResponse | undefined> => {
  try {
    const requestData: LoginRequest = { socialAccessToken };

    console.warn('requestData:', requestData);
    console.warn('apiclient baseURL:', process.env.EXPO_PUBLIC_API_BASE_URL);

    const response = await apiClient.post<LoginResponse>(
      '/auth/login/KAKAO',
      requestData
    );

    if (response.data.data) {
      const { accessToken, refreshToken, isNewUser } = response.data.data;
      await saveTokens(accessToken, refreshToken);

      console.log('Login successful:', { accessToken, refreshToken, isNewUser });
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Login failed:', error.toJSON());
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
};

/**
 * 서버에서 로그아웃을 처리하고, 저장된 토큰을 삭제합니다.
 */
export const signOut = async (): Promise<void> => {
  try {
    const response = await apiClient.post<LogoutResponse>('/auth/logout');
    const responseData = response.data;

    if (responseData && responseData.code === 401) {
      throw new Error(responseData.message || 'Unauthorized: Invalid or expired token');
    }

    await clearTokens();
    console.log('Logout successful');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Logout failed:', error.toJSON());
    } else {
      console.error('An unexpected error occurred:', error);
    }
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

