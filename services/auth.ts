/**
 * @file 인증 관련 비즈니스 로직을 처리합니다. (토큰 재발급)
 * @module services/auth
 */

import { authApi } from '@/api/auth';
import { clearTokens, getTokens, saveTokens } from '@/lib/tokenStorage';
import axios from 'axios';

/**
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 재발급합니다.
 * 성공 시, 새로운 토큰을 저장하고 새로운 액세스 토큰을 반환합니다.
 * 실패 시, 저장된 토큰을 삭제합니다.
 * @returns {Promise<string | undefined>} 재발급 성공 시 새로운 액세스 토큰, 그렇지 않으면 undefined를 반환합니다.
 */
export const reissueToken = async (): Promise<string | undefined> => {
  try {
    const { refreshToken } = await getTokens();

    if (!refreshToken) {
      throw new Error('사용 가능한 리프레시 토큰이 없습니다.');
    }

    const response = await authApi.reissue(refreshToken);

    if (!response.data) {
      throw new Error('토큰 재발급 응답에 데이터가 없습니다.');
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
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

