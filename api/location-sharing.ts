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

export const LocationSharingApi = {
  getPreviousLocations
};
