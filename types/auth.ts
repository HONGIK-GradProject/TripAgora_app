import APIResponse from "./apiResponse";
import { UserRole } from "./users";

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

interface AuthContextType {
  accessToken: string | null;
  // 추후 /users/me API 연동 시 주석 해제
  // User: 유저 정보 타입
  // user: User | null;
  userRole: UserRole;
  isLoading: boolean;
  isNewUser: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  switchUserRole: (newUserRole: UserRole) => Promise<void>;
}

interface AuthDecodedToken {
  exp: string;
  iat: string;
  role: 'GUIDE' | 'TRAVELER';
  type: string;
  userId: number;
}

export {
  AuthContextType,
  AuthDecodedToken,
  AuthLoginData,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthLogoutResponse,
  AuthReissueData,
  AuthReissueRequest,
  AuthReissueResponse,
};

