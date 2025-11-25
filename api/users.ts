/**
 * @file 유저 관련 API 함수를 제공합니다. (닉네임 설정, 관심사 태그 설정)
 * @module api/users
 */

import {
  UserDeleteMeResponse,
  UserGetMeResponse,
  UserSetFCMTokenRequest,
  UserSetFCMTokenResponse,
  UserSetNicknameRequest,
  UserSetNicknameResponse,
  UserSetProfileImageResponse,
  UserSetTagsRequest,
  UserSetTagsResponse,
  UserSwitchToGuideResponse,
  UserSwitchToTravelerResponse,
} from '@/types/users';
import { createFileFromImageUri } from '@/utils/files';
import apiClient, { apiClientMultipart } from './client';

/**
 * 현재 로그인한 사용자의 정보를 조회합니다.
 * @returns 사용자 정보 조회 성공 시 응답 데이터를 반환합니다.
 */
const getMe = async (): Promise<UserGetMeResponse> => {
  const response = await apiClient.get<UserGetMeResponse>('/users/me');
  return response.data;
};

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

const setProfileImage = async (
  uri: string
): Promise<UserSetProfileImageResponse> => {
  const requestForm = new FormData();
  requestForm.append('imageFile', createFileFromImageUri(uri));
  const response = await apiClientMultipart.patch<UserSetProfileImageResponse>(
    '/users/me/profile-image',
    requestForm
  );
  return response.data;
};

/**
 * 현재 로그인한 사용자의 계정을 삭제합니다.
 * @returns 계정 삭제 성공 시 응답 데이터를 반환합니다.
 */
const deleteMe = async (): Promise<UserDeleteMeResponse> => {
  const response = await apiClient.delete<UserDeleteMeResponse>('/users/me');
  return response.data;
};

const setFCMToken = async (
  token: string
): Promise<UserSetFCMTokenResponse> => {
  const requestData: UserSetFCMTokenRequest = { token }
  const response = await apiClient.post<UserSetFCMTokenResponse>(
    '/users/me/fcm-token',
    requestData
  );
  return response.data;
}

export const usersApi = {
  getMe,
  setNickname,
  setTags,
  switchToGuide,
  switchToTraveler,
  setProfileImage,
  deleteMe,
  setFCMToken
};
