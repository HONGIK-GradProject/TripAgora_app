import APIResponse from "./apiResponse";

interface setNicknameRequest {
  nickname: string;
}

interface setNicknameResponse extends APIResponse<setNicknameData> {}

interface setNicknameData {
  nickname: string;
}

interface setTagsRequest {
  tagIds: number[];
}

interface setTagsData {
  tagNames: string[];
}

interface setTagsResponse extends APIResponse<setTagsData> {}

export { setNicknameRequest, setNicknameResponse, setTagsRequest, setTagsResponse };
