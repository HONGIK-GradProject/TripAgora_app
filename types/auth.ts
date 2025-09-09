import APIResponse from "./apiResponse";

interface LoginRequest {
  socialAccessToken: string;
}

interface LoginResponse extends APIResponse<LoginData> {}

interface LogoutRequest {
  accessToken: string;
}

interface LogoutResponse extends APIResponse<null> {}

interface LoginData {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}

export { LoginRequest, LoginResponse, LogoutRequest, LogoutResponse };

