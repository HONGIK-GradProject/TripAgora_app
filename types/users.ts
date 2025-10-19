import APIResponse from "./apiResponse";

type UserRole = 'traveler' | 'guide';

interface UserSetNicknameRequest {
  nickname: string;
}
interface UserSetNicknameData {
  nickname: string;
}
interface UserSetNicknameResponse extends APIResponse<UserSetNicknameData> {}

interface UserSetTagsRequest {
  tagIds: number[];
}
interface UserSetTagsData {
  tagNames: string[];
}
interface UserSetTagsResponse extends APIResponse<UserSetTagsData> {}

interface UserSwitchToGuideRequest {}
interface UserSwitchToGuideData {
  accessToken: string;
  refreshToken: string;
}
interface UserSwitchToGuideResponse extends APIResponse<UserSwitchToGuideData> {}

type UserSwitchToTravelerRequest = UserSwitchToGuideRequest;
type UserSwitchToTravelerResponse = UserSwitchToGuideResponse;

type UserSetProfileImageRequest = FormData;
interface UserSetProfileImageData {
  profileImageUrl: string;
}
interface UserSetProfileImageResponse extends APIResponse<UserSetProfileImageData> {}

export {
  UserRole,
  UserSetNicknameData,
  UserSetNicknameRequest,
  UserSetNicknameResponse, UserSetProfileImageData,
  UserSetProfileImageRequest,
  UserSetProfileImageResponse, UserSetTagsData,
  UserSetTagsRequest,
  UserSetTagsResponse,
  UserSwitchToGuideData,
  UserSwitchToGuideRequest,
  UserSwitchToGuideResponse,
  UserSwitchToTravelerRequest,
  UserSwitchToTravelerResponse
};

