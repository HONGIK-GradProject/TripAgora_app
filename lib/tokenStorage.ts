/**
 * @file SecureStore를 사용한 토큰 저장소 관리 모듈입니다.
 * @module lib/tokenStorage
 */

import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * 액세스 토큰과 리프레시 토큰을 SecureStore에 저장합니다.
 * @param {string} accessToken - 저장할 액세스 토큰입니다.
 * @param {string} refreshToken - 저장할 리프레시 토큰입니다.
 * @returns {Promise<void>}
 */
export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('토큰 저장 중 오류 발생:', error);
  }
};

/**
 * SecureStore에서 액세스 토큰과 리프레시 토큰을 삭제합니다.
 * @returns {Promise<void>}
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('토큰 삭제 중 오류 발생:', error);
  }
};

/**
 * SecureStore에서 액세스 토큰과 리프레시 토큰을 가져옵니다.
 * @returns {Promise<{ accessToken: string | null; refreshToken: string | null }>} 토큰을 포함한 객체를 반환합니다. 토큰이 없을 경우 null을 반환합니다.
 */
export const getTokens = async (): Promise<{ accessToken: string | null; refreshToken: string | null }> => {
  try {
    const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('토큰 검색 중 오류 발생:', error);
    return { accessToken: null, refreshToken: null };
  }
};
