import { LocationGetPreviousResponse } from "@/types/location-sharing";
import apiClient from "./client";

const getPreviousLocations = async (
  roomId: number
): Promise<LocationGetPreviousResponse> => {
  const response = await apiClient.get<LocationGetPreviousResponse>(
    `location/rooms/${roomId}/locations`
  );
  return response.data;
};

/**
 * 공지 관련 API 함수들을 모아놓은 객체입니다.
 */
export const LocationSharingApi = {
  getPreviousLocations
};
