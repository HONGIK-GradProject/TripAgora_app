import { guideProfilesApi } from '@/api/guideProfiles';
import { GuideProfileGetData } from '@/types/guideProfiles';

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
