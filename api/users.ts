/**
 * @file 유저 관련 API 함수를 제공합니다. (닉네임 설정, 관심사 태그 설정)
 * @module api/users
 */

import {
  SetNicknameRequest,
  SetNicknameResponse,
  SetTagsRequest,
  SetTagsResponse,
  SwitchToGuideResponse,
  SwitchToTravelerResponse
} from '@/types/users';
import apiClient from './client';

/**
 * 사용자의 닉네임을 설정합니다.
 * @param nickname - 설정할 새로운 닉네임
 * @returns 닉네임 설정 성공 시 응답 데이터를 반환합니다.
 */
export const setNickname = async (
  nickname: string
): Promise<SetNicknameResponse> => {
  const requestData: SetNicknameRequest = { nickname };
  const response = await apiClient.patch<SetNicknameResponse>(
    '/users/me/nickname',
    requestData
  );
  return response.data;
};

/**
 * 사용자의 관심사 태그를 설정합니다.
 * @param tagIds - 설정할 태그 ID의 배열
 * @returns 태그 설정 성공 시 응답 데이터를 반환합니다.
 */
export const setTags = async (tagIds: number[]): Promise<SetTagsResponse> => {
  const requestData: SetTagsRequest = { tagIds };
  const response = await apiClient.patch<SetTagsResponse>(
    '/users/me/tags',
    requestData
  );
  return response.data;
};

export const switchToGuide = async (): Promise<SwitchToGuideResponse> => {
  const response = await apiClient.post<SwitchToGuideResponse>(
    '/users/me/switch-to-guide'
  );
  return response.data;
};

export const switchToTraveler = async (): Promise<SwitchToTravelerResponse> => {
  const response = await apiClient.post<SwitchToTravelerResponse>(
    '/users/me/switch-to-traveler'
  );
  return response.data;
};

