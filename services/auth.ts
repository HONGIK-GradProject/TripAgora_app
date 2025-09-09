import { ReissueRequest, ReissueResponse } from '@/types/auth';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * SecureStore에 액세스 토큰과 리프레시 토큰을 저장합니다.
 * @param accessToken - 저장할 액세스 토큰
 * @param refreshToken - 저장할 리프레시 토큰
 */
const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  } catch (error) {
    console.error('Error saving tokens:', error); 
  }
}

/**
 * SecureStore에서 액세스 토큰과 리프레시 토큰을 삭제합니다.
 */
const clearTokens = async () => {
  try {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
}

/**
 * SecureStore에서 액세스 토큰과 리프레시 토큰을 가져옵니다.
 * @returns 액세스 토큰과 리프레시 토큰을 포함하는 객체를 반환합니다. 토큰이 없을 경우 null을 반환합니다.
 */
const getTokens = async (): Promise<{ accessToken: string | null; refreshToken: string | null }> => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return { accessToken: null, refreshToken: null };
  }
}

const reissueToken = async (): Promise<string | undefined> => {
  try {
    const tokens = await getTokens();
    const refreshToken = tokens.refreshToken;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const requestData: ReissueRequest = { refreshToken };

    const response = await axios.post<ReissueResponse>(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/reissue`,
      requestData
    );

    if (!response.data.data) {
      throw new Error('No data in reissue response');
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
    await saveTokens(newAccessToken, newRefreshToken);
    console.log('Token reissue successful:', { newAccessToken, newRefreshToken });
    return newAccessToken;
  } catch (error) {
    await clearTokens();
    
    if (axios.isAxiosError(error)) {
      console.error('Token reissue failed:', error.toJSON());
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
};

export { clearTokens, getTokens, reissueToken, saveTokens };

