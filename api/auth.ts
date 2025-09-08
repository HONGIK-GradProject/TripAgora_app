import { login as kakaoLogin, logout as kakaoLogout } from '@react-native-seoul/kakao-login';

import {
  ApiResponse,
  KakaoLoginRequest,
  KakaoLoginResponse,
} from '@/types';

import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = 'token';  // Replace with actual token retrieval logic

  if (accessToken) {
    config.headers.Authorization = `${accessToken}`;
  }

  return config;
});

export const signIn = async (
  socialAccessToken: string
): Promise<KakaoLoginResponse | undefined> => {
  try {
    const requestData: KakaoLoginRequest = { socialAccessToken };

    console.warn('requestData:', requestData);
    console.warn('apiclient baseURL:', process.env.EXPO_PUBLIC_API_BASE_URL);

    const response = await apiClient.post<ApiResponse<KakaoLoginResponse>>(
      '/auth/login/KAKAO',
      requestData
    );

    if (response.data.data) {
      const { accessToken, refreshToken, isNewUser } = response.data.data;
      // Store tokens securely (e.g., in AsyncStorage)
      console.log('Login successful:', { accessToken, refreshToken, isNewUser });
      return response.data.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Login failed:', error.toJSON());
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
};

export const signOut = async (): Promise<void> => {
  try {
    // You might need to include the access token in the header for logout
    // For example:
    // const token = await getAccessToken(); // Function to get the stored token
    // await apiClient.post('/auth/logout', null, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    await apiClient.post('/auth/logout');
    console.log('Logout successful');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Logout failed:', error.response?.data);
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

