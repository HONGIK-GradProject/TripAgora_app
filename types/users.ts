import APIResponse from "./apiResponse";

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

type UserRole = 'traveler' | 'guide';

export { SetNicknameRequest, SetNicknameResponse, SetTagsRequest, SetTagsResponse, UserRole };

