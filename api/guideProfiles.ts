import {
  GuideProfileGetRequest,
  GuideProfileGetResponse,
} from '@/types/guideProfiles';
import apiClient from './client';

/**
 * 가이드 프로필을 조회합니다.
 * @param guideProfileId - 조회할 가이드 프로필의 ID
 * @param page - 조회할 페이지 번호 (선택사항, 기본값 0)
 * @returns 가이드 프로필 정보를 담은 Promise
 */
const getGuideProfile = async (
  guideProfileId: number,
  page: number = 0
): Promise<GuideProfileGetResponse> => {
  const requestData: GuideProfileGetRequest = {
    params: {
      page,
    },
  };
  const response = await apiClient.get<GuideProfileGetResponse>(
    `/guide-profiles/${guideProfileId}`,
    {
      params: requestData.params,
    }
  );
  return response.data;
};

export const guideProfilesApi = {
  getGuideProfile,
};
