import {
  GuideProfileGetRequest,
  GuideProfileGetResponse,
  GuideProfileUpdateBioRequest,
  GuideProfileUpdateBioResponse,
  GuideProfileUpdateImageRequest,
  GuideProfileUpdateImageResponse,
  GuideProfileUpdatePortfoliosRequest,
  GuideProfileUpdatePortfoliosResponse,
} from '@/types/guideProfiles';
import { createFileFromImageUri } from '@/utils/files';
import apiClient, { apiClientMultipart } from './client';

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

/**
 * 가이드 프로필의 소개글(bio)을 수정합니다.
 * @param bio - 변경할 소개글
 * @returns 변경된 소개글을 담은 Promise
 */
const updateBio = async (
  bio: string
): Promise<GuideProfileUpdateBioResponse> => {
  const requestData: GuideProfileUpdateBioRequest = { bio };
  const response = await apiClient.patch<GuideProfileUpdateBioResponse>(
    '/guide-profiles/me/bio',
    requestData
  );
  return response.data;
};

/**
 * 가이드 프로필의 이미지를 수정합니다.
 * @param uri - 변경할 이미지 파일의 URI
 * @returns 변경된 이미지 URL을 담은 Promise
 */
const updateImage = async (
  uri: string
): Promise<GuideProfileUpdateImageResponse> => {
  const requestForm: GuideProfileUpdateImageRequest = new FormData();
  requestForm.append('imageFile', createFileFromImageUri(uri));
  const response = await apiClientMultipart.patch<GuideProfileUpdateImageResponse>(
    '/guide-profiles/me/image',
    requestForm
  );
  return response.data;
};

/**
 * 가이드 프로필의 포트폴리오를 수정합니다.
 * @param portfolios - 변경할 포트폴리오 배열
 * @returns 변경된 포트폴리오 배열을 담은 Promise
 */
const updatePortfolios = async (
  portfolios: GuideProfileUpdatePortfoliosRequest['portfolios']
): Promise<GuideProfileUpdatePortfoliosResponse> => {
  const requestData: GuideProfileUpdatePortfoliosRequest = { portfolios };
  const response = await apiClient.put<GuideProfileUpdatePortfoliosResponse>(
    '/guide-profiles/me/portfolios',
    requestData
  );
  return response.data;
};

export const guideProfilesApi = {
  getGuideProfile,
  updateBio,
  updateImage,
  updatePortfolios,
};
