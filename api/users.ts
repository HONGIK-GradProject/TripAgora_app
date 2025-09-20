/**
 * @file 유저 관련 API 함수를 제공합니다. (닉네임 설정, 관심사 태그 설정)
 * @module api/users
 */

import {
  SetNicknameRequest,
  SetNicknameResponse,
  SetTagsRequest,
  SetTagsResponse,
} from '@/types/users';
import apiClient from './client';

/**
 * 사용자의 닉네임을 설정합니다.
 * @param nickname - 설정할 새로운 닉네임
 * @returns 닉네임 설정 성공 시 응답 데이터를, 실패 시 undefined를 반환합니다.
 */
const setNickname = async (
  nickname: string
): Promise<SetNicknameResponse | undefined> => {
  try {
    const requestData: SetNicknameRequest = { nickname };
    const response = await apiClient.patch<SetNicknameResponse>(
      '/users/me/nickname',
      requestData
    );
    console.log('닉네임 설정 성공: ', response.data);
    return response.data;
  } catch (error) {
    console.error('닉네임 설정 실패: ', error);
    return undefined;
  }
};

/**
 * 사용자의 관심사 태그를 설정합니다.
 * @param tagIds - 설정할 태그 ID의 배열
 * @returns 태그 설정 성공 시 응답 데이터를, 실패 시 undefined를 반환합니다.
 */
const setTags = async (
  tagIds: number[]
): Promise<SetTagsResponse | undefined> => {
  try {
    const requestData: SetTagsRequest = { tagIds };
    const response = await apiClient.patch<SetTagsResponse>(
      '/users/me/tags',
      requestData
    );
    console.log('관심사 태그 설정 성공: ', response.data);
    return response.data;
  } catch (error) {
    console.error('관심사 태그 설정 실패: ', error);
    return undefined;
  }
};

export { setNickname, setTags };
