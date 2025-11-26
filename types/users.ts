import APIResponse from './apiResponse';

type UserRole = 'TRAVELER' | 'GUIDE';

interface UserData {
  nickname: string;
  role: UserRole;
  profileImageUrl: string;
  tagIds: number[];
}

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
interface UserSwitchToGuideResponse
  extends APIResponse<UserSwitchToGuideData> {}

type UserSwitchToTravelerRequest = UserSwitchToGuideRequest;
type UserSwitchToTravelerResponse = UserSwitchToGuideResponse;

type UserSetProfileImageRequest = FormData;
interface UserSetProfileImageData {
  profileImageUrl: string;
}
interface UserSetProfileImageResponse
  extends APIResponse<UserSetProfileImageData> {}

type UserGetMeData = UserData;
interface UserGetMeResponse extends APIResponse<UserGetMeData> {}

interface UserDeleteMeData {}
interface UserDeleteMeResponse extends APIResponse<UserDeleteMeData> {}

interface UserSetFCMTokenRequest {
  token: string;
}
interface UserSetFCMTokenData {}
interface UserSetFCMTokenResponse extends APIResponse<UserSetFCMTokenData> {}

export {
  UserData,
  UserDeleteMeData,
  UserDeleteMeResponse,
  UserGetMeData,
  UserGetMeResponse,
  UserRole, UserSetFCMTokenRequest,
  UserSetFCMTokenResponse, UserSetNicknameData,
  UserSetNicknameRequest,
  UserSetNicknameResponse,
  UserSetProfileImageData,
  UserSetProfileImageRequest,
  UserSetProfileImageResponse,
  UserSetTagsData,
  UserSetTagsRequest,
  UserSetTagsResponse,
  UserSwitchToGuideData,
  UserSwitchToGuideRequest,
  UserSwitchToGuideResponse,
  UserSwitchToTravelerRequest,
  UserSwitchToTravelerResponse
};

