import { LocationSharingApi } from "@/api/location-sharing";
import { UserLocation } from "@/types/location-sharing";

/**
 * @function fetchPreviousLocations
 * @async
 * @param {number} roomId - 위치 기록을 가져올 방의 ID.
 * @returns {Promise<{ data: UserLocation[] } | null>} - 성공 시 `UserLocation` 배열을 포함하는 객체를 반환하고, 실패 시 `null`을 반환합니다.
 * @throws {Error} - API 호출 실패 시 에러를 발생시킵니다.
 * @description 특정 방의 이전 사용자 위치 기록을 비동기적으로 가져옵니다.
 *   가져온 위치 데이터의 `updatedAt` 필드에 'Z'를 추가하여 UTC 시간으로 처리합니다.
 */
export const fetchPreviousLocations = async (
  roomId: number
): Promise<{ data: UserLocation[] } | null> => {
  try {
    const response = await LocationSharingApi.getPreviousLocations(roomId);

    if (response.data && response.code === 200) {
      const utcLocations = response.data.map(location => {
        return {
          ...location,
          updatedAt: location.updatedAt + 'Z'
        }
      });

      return {
        data: utcLocations
      };
    }

    throw new Error(
      `유저 위치 조회 실패: ${response?.message || '알 수 없는 오류'}`
    );
  } catch (error) {
    console.error('유저 위치 조회 에러:', error);
    throw error;
  }
};