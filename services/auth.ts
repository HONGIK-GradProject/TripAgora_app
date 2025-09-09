/**
 * @file SecureStore를 사용한 토큰 관리 인증 서비스를 제공합니다.
 * @module services/auth
 */

import { ReissueRequest, ReissueResponse } from '@/types/auth';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * 액세스 토큰과 리프레시 토큰을 SecureStore에 저장합니다.
 * @param {string} accessToken - 저장할 액세스 토큰입니다.
 * @param {string} refreshToken - 저장할 리프레시 토큰입니다.
 * @returns {Promise<void>}
 */
const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  } catch (error) {
    console.error('토큰 저장 중 오류 발생:', error);
  }
};

/**
 * SecureStore에서 액세스 토큰과 리프레시 토큰을 삭제합니다.
 * @returns {Promise<void>}
 */
const clearTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  } catch (error) {
    console.error('토큰 삭제 중 오류 발생:', error);
  }
};

/**
 * SecureStore에서 액세스 토큰과 리프레시 토큰을 가져옵니다.
 * @returns {Promise<{ accessToken: string | null; refreshToken: string | null }>} 토큰을 포함한 객체를 반환합니다. 토큰이 없을 경우 null을 반환합니다.
 */
const getTokens = async (): Promise<{ accessToken: string | null; refreshToken: string | null }> => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('토큰 검색 중 오류 발생:', error);
    return { accessToken: null, refreshToken: null };
  }
};

/**
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 재발급합니다.
 * 성공 시, 새로운 토큰을 저장하고 새로운 액세스 토큰을 반환합니다.
 * 실패 시, 저장된 토큰을 삭제합니다.
 * @returns {Promise<string | undefined>} 재발급 성공 시 새로운 액세스 토큰, 그렇지 않으면 undefined를 반환합니다.
 */
const reissueToken = async (): Promise<string | undefined> => {
  try {
    const tokens = await getTokens();
    const refreshToken = tokens.refreshToken;

    if (!refreshToken) {
      throw new Error('사용 가능한 리프레시 토큰이 없습니다.');
    }

    const requestData: ReissueRequest = { refreshToken };

    const response = await axios.post<ReissueResponse>(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/reissue`,
      requestData
    );

    if (!response.data.data) {
      throw new Error('토큰 재발급 응답에 데이터가 없습니다.');
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
    await saveTokens(newAccessToken, newRefreshToken);
    console.log('토큰 재발급 성공:', { newAccessToken, newRefreshToken });
    return newAccessToken;
  } catch (error) {
    await clearTokens();
    
    if (axios.isAxiosError(error)) {
      console.error('토큰 재발급 실패:', error.toJSON());
    } else {
      console.error('예상치 못한 오류 발생:', error);
    }
  }
};

export { clearTokens, getTokens, reissueToken, saveTokens };

