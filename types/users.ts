import APIResponse from "./apiResponse";

type UserRole = 'traveler' | 'guide';

interface SetNicknameRequest {
  nickname: string;
}

interface SetNicknameResponse extends APIResponse<SetNicknameData> {}

interface SetNicknameData {
  nickname: string;
}

interface SetTagsRequest {
  tagIds: number[];
}

interface SetTagsData {
  tagNames: string[];
}

interface SetTagsResponse extends APIResponse<SetTagsData> {}

interface SwitchToGuideRequest {}

interface SwitchToGuideData {
  accessToken: string;
  refreshToken: string;
}

interface SwitchToGuideResponse extends APIResponse<SwitchToGuideData> {}

type SwitchToTravelerRequest = SwitchToGuideRequest;
type SwitchToTravelerResponse = SwitchToGuideResponse;

export {
  SetNicknameRequest,
  SetNicknameResponse,
  SetTagsRequest,
  SetTagsResponse,
  SwitchToGuideRequest,
  SwitchToGuideResponse,
  SwitchToTravelerRequest,
  SwitchToTravelerResponse,
  UserRole
};

