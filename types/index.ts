export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
  errors?: {
    field: string;
    reason: string;
  }[];
}

export interface KakaoLoginRequest {
  socialAccessToken: string;
}

export interface KakaoLoginResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export interface ReissueRequest {
  refreshToken: string;
}

export interface ReissueResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UpdateNicknameRequest {
  nickname: string;
}

export interface UpdateNicknameResponse {
  nickname: string;
}

export interface UpdateTagsRequest {
  tagIds: number[];
}

export interface UpdateTagsResponse {
  tagNames: string[];
}