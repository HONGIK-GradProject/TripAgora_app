import APIResponse from "./apiResponse";

interface UserLocation {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
}

interface LocationGetPreviousResponse extends APIResponse<UserLocation[]> {
  data: UserLocation[];
}

export {
  LocationGetPreviousResponse, UserLocation
};
