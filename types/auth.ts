import APIResponse from "./apiResponse";

interface LoginRequest {
  socialAccessToken: string;
}

interface LoginResponse extends APIResponse<LoginData> {}

interface LogoutRequest {
  accessToken: string;
}

interface LoginData {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}