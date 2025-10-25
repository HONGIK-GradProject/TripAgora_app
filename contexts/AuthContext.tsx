/**
 * @file AuthContext.tsx
 * @description 인증 관련 컨텍스트와 프로바이더, 커스텀 훅을 제공하는 파일입니다.
 * @module contexts/AuthContext
 */
import { authApi } from '@/api/auth';
import { setupInterceptors } from '@/api/client';
import { usersApi } from '@/api/users';
import { clearTokens, getTokens, saveTokens } from '@/lib/tokenStorage';
import { reissueToken } from '@/services/auth';
import { kakaoSignIn, kakaoSignOut } from '@/services/kakaoAuth';
import { getUser } from '@/services/users';
import { UserData, UserRole } from '@/types/users';
import { isAxiosError } from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';

/**
 * @interface AuthContextType
 * @description AuthContext에서 제공하는 값들의 타입 정의입니다.
 * @property {string | null} accessToken - 사용자의 액세스 토큰.
 * @property {boolean} isLoading - 인증 관련 비동기 작업의 로딩 상태.
 * @property {boolean} isNewUser - 새로운 사용자인지 여부.
 * @property {UserData | null} user - 현재 로그인된 사용자의 정보.
 * @property {() => Promise<void>} signIn - 소셜 로그인을 통해 앱에 로그인하는 함수.
 * @property {() => Promise<void>} signOut - 앱에서 로그아웃하는 함수.
 * @property {(newUserRole: UserRole) => Promise<void>} switchUserRole - 사용자 역할을 전환하는 함수.
 * @property {React.Dispatch<React.SetStateAction<UserData | null>>} setUser - 사용자 정보 상태를 직접 설정하는 함수.
 */
export interface AuthContextType {
  accessToken: string | null;
  isLoading: boolean;
  isNewUser: boolean;
  user: UserData | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  switchUserRole: (newUserRole: UserRole) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

/**
 * @description 인증 관련 상태 및 함수를 전역적으로 제공하는 Context입니다.
 * @constant {React.Context<AuthContextType | null>} AuthContext
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * @description 전역 인증 상태를 관리하고, 관련 함수들을 제공하는 Provider 컴포넌트입니다.
 * 이 컴포넌트는 앱의 최상위 레벨에서 사용되어야 합니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {React.ReactNode} props.children - Provider가 감쌀 자식 컴포넌트들
 */
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /**
   * @description 현재 로그인된 사용자의 액세스 토큰입니다. API 요청 시 인증 헤더에 사용됩니다.
   * @state
   */
  const [accessToken, setAccessToken] = useState<string | null>(null);
  /**
   * @description 인증 관련 비동기 작업(로그인, 로그아웃, 역할 전환 등)의 로딩 상태를 나타냅니다.
   * @state
   */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  /**
   * @description 소셜 로그인 시 서버에서 반환된 사용자가 새로운 사용자인지 여부를 나타냅니다.
   * @state
   */
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  /**
   * @description 현재 로그인된 사용자의 정보(이름, 역할, 프로필 이미지 등)를 담고 있습니다.
   * @state
   */
  const [user, setUser] = useState<UserData | null>(null);

  /**
   * @description 사용자를 로그아웃 처리합니다.
   * 서버에 로그아웃 요청을 보내고, 소셜 로그아웃을 수행한 뒤,
   * 저장된 모든 토큰을 삭제하고 관련 상태를 초기화합니다.
   * @function signOutHandler
   * @async
   */
  const signOutHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.signOut();
      await kakaoSignOut();
    } catch (error) {
      if (!(isAxiosError(error) && error.response?.status === 401)) {
        console.error('Sign-out error:', error);
      }
    } finally {
      await clearTokens();
      setAccessToken(null);
      setIsNewUser(false);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  /**
   * @description 액세스 토큰을 기반으로 인증 상태를 설정하는 중앙 처리 함수입니다.
   * 토큰을 저장하고, 상태를 업데이트하며, 사용자 정보를 가져옵니다.
   * @function processAndSetAuth
   * @async
   * @param {string} newAccessToken - 처리할 액세스 토큰.
   * @param {string} [newRefreshToken] - (선택적) 함께 저장할 리프레시 토큰. 로그인, 역할 전환 시에만 전달됩니다.
   */
  const processAndSetAuth = useCallback(
    async (newAccessToken: string, newRefreshToken?: string) => {
      // refreshToken이 주어진 경우에만 토큰을 저장 (로그인, 역할 전환 시)
      if (newRefreshToken) {
        await saveTokens(newAccessToken, newRefreshToken);
      }

      setAccessToken(newAccessToken);

      try {
        const newUser = await getUser();
        setUser(newUser || null);
      } catch (error) {
        console.error('사용자 정보 조회 실패', error);
        await signOutHandler(); // 유효하지 않은 토큰은 로그아웃 처리
      }
    },
    [signOutHandler]
  );

  /**
   * @description 소셜 로그인을 통해 전체 로그인 과정을 처리합니다.
   * 소셜 SDK로 로그인 후, 백엔드 서버로부터 JWT 토큰을 발급받아 인증 상태를 설정합니다.
   * @function signInHandler
   * @async
   */
  const signInHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const socialAccessToken = await kakaoSignIn();
      const response = await authApi.signIn(socialAccessToken);

      if (response.data) {
        const { accessToken: newAccessToken, refreshToken, isNewUser: newUserStatus } = response.data;
        await processAndSetAuth(newAccessToken, refreshToken);
        setIsNewUser(newUserStatus);
        console.log('로그인 성공, 토큰 저장 및 역할 설정 완료');
      } else {
        throw new Error('서버로부터 토큰을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      await signOutHandler(); // 로그인 실패 시 확실하게 로그아웃
    } finally {
      setIsLoading(false);
    }
  }, [processAndSetAuth, signOutHandler]);

  /**
   * @description 사용자 역할을 '여행자' 또는 '가이드'로 전환합니다.
   * 서버에 역할 전환을 요청하고, 성공 시 새로운 토큰을 받아 인증 상태를 갱신합니다.
   * @function switchUserRoleHandler
   * @async
   * @param {UserRole} newUserRole - 전환하고자 하는 새로운 역할.
   */
  const switchUserRoleHandler = useCallback(
    async (newUserRole: UserRole) => {
      setIsLoading(true);
      try {
        const response =
          newUserRole === 'TRAVELER'
            ? await usersApi.switchToTraveler()
            : await usersApi.switchToGuide();

        if (response && response.code === 200 && response.data) {
          const { accessToken: newAccessToken, refreshToken } = response.data;
          await processAndSetAuth(newAccessToken, refreshToken);
        } else {
          throw new Error('역할 전환에 실패했습니다.');
        }
      } catch (error) {
        console.error('Role Switch error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [processAndSetAuth]
  );

  /**
   * @description API 클라이언트 인터셉터를 설정합니다.
   * 컴포넌트 마운트 시, Axios 인터셉터를 설정하여 API 요청/응답을 가로채
   * 토큰 재발급과 같은 공통 로직을 처리합니다.
   * @effect
   */
  useEffect(() => {
    setupInterceptors(reissueToken, signOutHandler);
  }, [signOutHandler]);

  /**
   * @description 앱 시작 시 초기 인증 상태를 설정합니다.
   * SecureStore에 저장된 토큰을 불러와 유효한 경우,
   * 해당 토큰을 기반으로 사용자의 로그인 상태를 복원합니다.
   * @effect
   */
  useEffect(() => {
    const loadInitialAuth = async () => {
      setIsLoading(true);
      try {
        const token = (await getTokens()).accessToken;
        if (token) {
          // 앱 시작 시에는 저장된 토큰으로 상태만 설정
          await processAndSetAuth(token);
        }
      } catch (error) {
        console.error('초기 토큰 로딩 중 에러 발생: ', error);
        await signOutHandler();
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialAuth();
  }, [processAndSetAuth, signOutHandler]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isLoading,
        isNewUser,
        user,
        signIn: signInHandler,
        signOut: signOutHandler,
        switchUserRole: switchUserRoleHandler,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

