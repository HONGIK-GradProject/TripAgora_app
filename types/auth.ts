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

interface ReissueRequest {
  refreshToken: string;
}

interface ReissueResponse extends APIResponse<ReissueData> {}

interface ReissueData {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  accessToken: string | null;
  // 추후 /users/me API 연동 시 주석 해제
  // User: 유저 정보 타입
  // user: User | null;
  isLoading: boolean;
  isNewUser: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export { AuthContextType, LoginRequest, LoginResponse, LogoutRequest, LogoutResponse, ReissueRequest, ReissueResponse };

