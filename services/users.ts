/**
 * @file 사용자 관련 비즈니스 로직을 처리합니다.
 * @module services/users
 */

import { usersApi } from '@/api/users';
import { clearTokens, saveTokens } from '@/lib/tokenStorage';
import {
  UserSwitchToGuideResponse,
  UserSwitchToTravelerResponse,
} from '@/types/users';
import axios from 'axios';

// API 응답 타입의 공통 부분을 포함하는 유니온 타입 정의
type RoleSwitchApiResponse =
  | UserSwitchToGuideResponse
  | UserSwitchToTravelerResponse;

/**
 * 역할 전환의 공통 로직을 처리하는 헬퍼 함수입니다.
 * @param apiCallFunction - 호출할 API 함수
 * @param roleName - 로깅에 사용할 역할 이름 (e.g., "가이드", "여행자")
 * @returns 성공 시 API 응답 데이터를, 실패 시 undefined를 반환합니다.
 */
const handleRoleSwitch = async (
  apiCallFunction: () => Promise<RoleSwitchApiResponse>,
  roleName: string
) => {
  try {
    const response = await apiCallFunction();
    if (response.data && response.code === 200) {
      const { accessToken, refreshToken } = response.data;
      await saveTokens(accessToken, refreshToken);
      console.log(`${roleName}(으)로 역할 전환 및 토큰 저장 성공`);
      return response;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 400) {
        console.error(
          `${roleName}(으)로 역할 전환 실패 (Axios Error):`,
          error.response?.data.message
        );
      } else {
        console.error(
          `${roleName}(으)로 역할 전환 실패 (Axios Error):`,
          error.toJSON()
        );
      }
    } else {
      console.error(`${roleName}(으)로 역할 전환 실패 (Unknown Error):`, error);
    }
    return undefined;
  }
};

/**
 * 가이드로 역할을 전환하고, 새로 발급된 토큰을 저장합니다.
 * @returns 성공 시 API 응답 데이터를, 실패 시 undefined를 반환합니다.
 */
export const switchRoleToGuide = async () => {
  return handleRoleSwitch(usersApi.switchToGuide, '가이드');
};

/**
 * 여행자로 역할을 전환하고, 새로 발급된 토큰을 저장합니다.
 * @returns 성공 시 API 응답 데이터를, 실패 시 undefined를 반환합니다.
 */
export const switchRoleToTraveler = async () => {
  return handleRoleSwitch(usersApi.switchToTraveler, '여행자');
};

export const setProfileImage = async (uri: string) => {
  try {
    return (await usersApi.setProfileImage(uri)).data?.profileImageUrl;
  } catch (error) {
    throw error;
  }
};

/**
 * 현재 로그인한 사용자의 정보를 조회합니다.
 * @returns 성공 시 사용자 정보를, 실패 시 undefined를 반환합니다.
 */
export const getUser = async () => {
  try {
    const response = await usersApi.getMe();
    if (response.data && response.code === 200) {
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '사용자 정보 조회 실패 (Axios Error):',
        error.response?.data?.message || error.message
      );
    } else {
      console.error('사용자 정보 조회 실패 (Unknown Error):', error);
    }
  }
  return undefined;
};

/**
 * 현재 로그인한 사용자의 계정을 삭제합니다.
 * @returns 성공 시 true를, 실패 시 undefined를 반환합니다.
 */
export const deleteUserAccount = async () => {
  try {
    const response = await usersApi.deleteMe();
    if (response.code === 200) {
      // 계정 삭제 성공 시 로컬 토큰도 삭제
      await clearTokens();
      console.log('사용자 계정 삭제 성공');
      return true;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        '사용자 계정 삭제 실패 (Axios Error):',
        error.response?.data?.message || error.message
      );
    } else {
      console.error('사용자 계정 삭제 실패 (Unknown Error):', error);
    }
  }
  return undefined;
};
