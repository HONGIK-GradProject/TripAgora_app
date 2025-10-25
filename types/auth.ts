import APIResponse from "./apiResponse";

interface AuthLoginRequest {
  socialAccessToken: string;
}
interface AuthLoginData {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}
interface AuthLoginResponse extends APIResponse<AuthLoginData> {}

interface AuthLogoutRequest {
  accessToken: string;
}
interface AuthLogoutResponse extends APIResponse<null> {}

interface AuthReissueRequest {
  refreshToken: string;
}
interface AuthReissueData {
  accessToken: string;
  refreshToken: string;
}
interface AuthReissueResponse extends APIResponse<AuthReissueData> {}

interface AuthDecodedToken {
  exp: string;
  iat: string;
  role: 'GUIDE' | 'TRAVELER';
  type: string;
  userId: number;
}

export {
  AuthDecodedToken,
  AuthLoginData,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthLogoutResponse,
  AuthReissueData,
  AuthReissueRequest,
  AuthReissueResponse
};

