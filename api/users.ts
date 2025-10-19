/**
 * @file 유저 관련 API 함수를 제공합니다. (닉네임 설정, 관심사 태그 설정)
 * @module api/users
 */

import {
  UserSetNicknameRequest,
  UserSetNicknameResponse,
  UserSetProfileImageResponse,
  UserSetTagsRequest,
  UserSetTagsResponse,
  UserSwitchToGuideResponse,
  UserSwitchToTravelerResponse
} from '@/types/users';
import { createDataFormFromImageUri } from '@/utils/files';
import apiClient, { apiClientMultipart } from './client';

/**
 * 사용자의 닉네임을 설정합니다.
 * @param nickname - 설정할 새로운 닉네임
 * @returns 닉네임 설정 성공 시 응답 데이터를 반환합니다.
 */
const setNickname = async (
  nickname: string
): Promise<UserSetNicknameResponse> => {
  const requestData: UserSetNicknameRequest = { nickname };
  const response = await apiClient.patch<UserSetNicknameResponse>(
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
const setTags = async (tagIds: number[]): Promise<UserSetTagsResponse> => {
  const requestData: UserSetTagsRequest = { tagIds };
  const response = await apiClient.patch<UserSetTagsResponse>(
    '/users/me/tags',
    requestData
  );
  return response.data;
};

const switchToGuide = async (): Promise<UserSwitchToGuideResponse> => {
  const response = await apiClient.post<UserSwitchToGuideResponse>(
    '/users/me/switch-to-guide'
  );
  return response.data;
};

const switchToTraveler = async (): Promise<UserSwitchToTravelerResponse> => {
  const response = await apiClient.post<UserSwitchToTravelerResponse>(
    '/users/me/switch-to-traveler'
  );
  return response.data;
};

const setProfileImage = async (uri: string): Promise<UserSetProfileImageResponse> => {
  const requestForm = createDataFormFromImageUri(uri);
  const response = await apiClientMultipart.patch<UserSetProfileImageResponse>(
    '/users/me/profile-image',
    requestForm,
  );
  return response.data;
}

export const usersApi = {
  setNickname,
  setTags,
  switchToGuide,
  switchToTraveler,
  setProfileImage,
};

