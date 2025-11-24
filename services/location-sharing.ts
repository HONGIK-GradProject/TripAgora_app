import { LocationSharingApi } from "@/api/location-sharing";
import { UserLocation } from "@/types/location-sharing";

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