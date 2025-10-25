/**
 * @file AuthContext.tsx
 * @description 인증 관련 컨텍스트와 프로바이더, 커스텀 훅을 제공하는 파일입니다.
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
 * @property {string | null} accessToken - 사용자의 액세스 토큰
 * @property {UserData |} user - 유저 정보
 * @property {boolean} isLoading - 인증 관련 비동기 작업의 로딩 상태
 * @property {boolean} isNewUser - 새로운 사용자인지 여부
 * @property {() => Promise<void>} signIn - 로그인 함수
 * @property {() => Promise<void>} signOut - 로그아웃 함수
 * @property {(newUserRole: UserRole) => Promise<void>} switchUserRole - 역할 전환 함수
 */
export interface AuthContextType {
  accessToken: string | null;
  isLoading: boolean;
  isNewUser: boolean;
  user: UserData | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  switchUserRole: (newUserRole: UserRole) => Promise<void>;
}

/**
 * @description 인증 관련 상태 및 함수를 전역적으로 제공하는 Context입니다.
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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);

  /**
   * @description 사용자를 로그아웃 처리합니다.
   * 서버에 로그아웃 요청을 보내고, 소셜 로그아웃을 수행한 뒤,
   * 저장된 모든 토큰을 삭제하고 관련 상태를 초기화합니다.
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
   * 토큰을 저장하고, 상태를 업데이트하며, 토큰을 디코딩하여 사용자 역할을 설정합니다.
   * @param {string} accessToken - 처리할 액세스 토큰
   * @param {string} [refreshToken] - (선택적) 함께 저장할 리프레시 토큰. 로그인, 역할 전환 시에만 전달됩니다.
   */
  const processAndSetAuth = useCallback(
    async (accessToken: string, refreshToken?: string) => {
      // refreshToken이 주어진 경우에만 토큰을 저장 (로그인, 역할 전환 시)
      if (refreshToken) {
        await saveTokens(accessToken, refreshToken);
      }

      setAccessToken(accessToken);

      console.log(accessToken);

      try {
        const newUser = await getUser();
        if (newUser) {
          setUser(newUser);
        }
        else {
          setUser(null);
        }
      } catch (error) {
        console.error('JWT 디코딩 또는 역할 설정 실패', error);
        await signOutHandler(); // 유효하지 않은 토큰은 로그아웃 처리
      }
    },
    [signOutHandler]
  );

  /**
   * @description 소셜 로그인을 통해 전체 로그인 과정을 처리합니다.
   * 소셜 SDK로 로그인 후, 백엔드 서버로부터 JWT 토큰을 발급받아 인증 상태를 설정합니다.
   */
  const signInHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const socialAccessToken = await kakaoSignIn();
      const response = await authApi.signIn(socialAccessToken);

      if (response.data) {
        const { accessToken, refreshToken, isNewUser } = response.data;
        await processAndSetAuth(accessToken, refreshToken);

        setIsNewUser(isNewUser);

        const newUser = await getUser();

        if (newUser) {
          setUser(newUser);
        }
        else {
          setUser(null);
        }
        
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
   * @param {UserRole} newUserRole - 전환하고자 하는 새로운 역할
   */
  const switchUserRoleHandler = useCallback(
    async (newUserRole: UserRole) => {
      setIsLoading(true);
      try {
        const response =
          newUserRole === 'traveler'
            ? await usersApi.switchToTraveler()
            : await usersApi.switchToGuide();

        if (response && response.code === 200 && response.data) {
          const { accessToken, refreshToken } = response.data;
          await processAndSetAuth(accessToken, refreshToken);
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
   */
  useEffect(() => {
    setupInterceptors(reissueToken, signOutHandler);
  }, [signOutHandler]);

  /**
   * @description 앱 시작 시 초기 인증 상태를 설정합니다.
   * SecureStore에 저장된 토큰을 불러와 유효한 경우,
   * 해당 토큰을 기반으로 사용자의 로그인 상태를 복원합니다.
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

