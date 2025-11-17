import { guideProfilesApi } from '@/api/guideProfiles';
import {
  GuideProfileGetData,
  GuideProfileUpdateBioData,
  GuideProfileUpdateImageData,
  GuideProfileUpdatePortfoliosData,
  Portfolio,
} from '@/types/guideProfiles';

/**
 * 가이드 프로필을 조회합니다.
 * @param guideProfileId - 조회할 가이드 프로필의 ID
 * @param page - 조회할 페이지 번호 (선택사항, 기본값 0)
 * @returns 성공 시 가이드 프로필 데이터, 실패 시 undefined
 */
export const getGuideProfile = async (
  guideProfileId: number,
  page: number = 0
): Promise<GuideProfileGetData | undefined> => {
  try {
    const response = await guideProfilesApi.getGuideProfile(
      guideProfileId,
      page
    );

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('가이드 프로필 조회 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 자신의 가이드 프로필을 조회합니다.
 * @param page - 조회할 페이지 번호 (선택사항, 기본값 0)
 * @returns 성공 시 가이드 프로필 데이터, 실패 시 undefined
 */
export const getMyGuideProfile = async (
  page: number = 0
): Promise<GuideProfileGetData | undefined> => {
  try {
    const response = await guideProfilesApi.getMyGuideProfile(page);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('내 가이드 프로필 조회 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 가이드 프로필의 소개글(bio)을 수정합니다.
 * @param bio - 변경할 소개글
 * @returns 성공 시 변경된 소개글, 실패 시 undefined
 */
export const updateGuideProfileBio = async (
  bio: string
): Promise<GuideProfileUpdateBioData | undefined> => {
  try {
    const response = await guideProfilesApi.updateBio(bio);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('가이드 프로필 소개글 수정 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 가이드 프로필의 이미지를 수정합니다.
 * @param uri - 변경할 이미지 파일의 URI
 * @returns 성공 시 변경된 이미지 URL, 실패 시 undefined
 */
export const updateGuideProfileImage = async (
  uri: string
): Promise<GuideProfileUpdateImageData | undefined> => {
  try {
    const response = await guideProfilesApi.updateImage(uri);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('가이드 프로필 이미지 수정 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 가이드 프로필의 포트폴리오를 수정합니다.
 * @param portfolios - 변경할 포트폴리오 배열
 * @returns 성공 시 변경된 포트폴리오 배열, 실패 시 undefined
 */
export const updateGuideProfilePortfolios = async (
  portfolios: Portfolio[]
): Promise<GuideProfileUpdatePortfoliosData | undefined> => {
  try {
    const response = await guideProfilesApi.updatePortfolios(portfolios);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('가이드 프로필 포트폴리오 수정 에러');
  } catch (error) {
    console.error(error);
  }
};
