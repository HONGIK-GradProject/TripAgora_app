/**
 * @file 사용자 관련 비즈니스 로직을 처리합니다.
 * @module services/users
 */

import { switchToGuide as apiSwitchToGuide, switchToTraveler as apiSwitchToTraveler } from '@/api/users';
import { saveTokens } from '@/lib/tokenStorage';

/**
 * 가이드로 역할을 전환하고, 새로 발급된 토큰을 저장합니다.
 * @returns 성공 시 API 응답 데이터를, 실패 시 undefined를 반환합니다.
 */
export const switchRoleToGuide = async () => {
  try {
    const response = await apiSwitchToGuide();
    if (response.data) {
      if (response.code === 200) {
        const { accessToken, refreshToken } = response.data;
        await saveTokens(accessToken, refreshToken);
        console.log('가이드로 역할 전환 및 토큰 저장 성공');
        return response;
      }
      if (response.code === 400) {
        throw new Error('이미 가이드입니다.');
      }
    }
  } catch (error) {
    console.error('가이드로 역할 전환 실패: ', error);
    return undefined;
  }
};

/**
 * 여행자로 역할을 전환하고, 새로 발급된 토큰을 저장합니다.
 * @returns 성공 시 API 응답 데이터를, 실패 시 undefined를 반환합니다.
 */
export const switchRoleToTraveler = async () => {
  try {
    const response = await apiSwitchToTraveler();
    if (response.data) {
      if (response.code === 200) {
        const { accessToken, refreshToken } = response.data;
        await saveTokens(accessToken, refreshToken);
        console.log('여행자로 역할 전환 및 토큰 저장 성공');
        return response;
      }
      if (response.code === 400) {
        throw new Error('이미 여행자입니다.');
      }
    }
  } catch (error) {
    console.error('여행자로 역할 전환 실패: ', error);
    return undefined;
  }
};
