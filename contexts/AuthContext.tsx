/**
 * @file AuthContext.tsx
 * @description 인증 관련 컨텍스트와 프로바이더, 커스텀 훅을 제공하는 파일입니다.
 */
import { kakaoSignIn, kakaoSignOut, signIn, signOut } from '@/api/auth';
import { setupInterceptors } from '@/api/client';
import { switchToGuide, switchToTraveler } from '@/api/users';
import { clearTokens, getTokens, saveTokens } from '@/lib/tokenStorage';
import { reissueToken } from '@/services/auth';
import { AuthContextType, DecodedTokenType } from '@/types/auth';
import { UserRole } from '@/types/users';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { createContext, useCallback, useEffect, useState } from 'react';

/**
 * @description 인증 관련 상태 및 함수를 제공하는 Context입니다.
 * @property {string | null} accessToken - 사용자의 액세스 토큰
 * @property {UserRole} userRole - 유저의 역할 (여행자 or 가이드)
 * @property {boolean} isLoading - 로딩 상태
 * @property {boolean} isNewUser - 새로운 사용자인지 여부
 * @property {() => Promise<void>} signIn - 로그인 함수
 * @property {() => Promise<void>} signOut - 로그아웃 함수
 * @see AuthProvider
 * @see useAuth
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * @description AuthContext를 제공하는 Provider 컴포넌트입니다.
 * @param {object} props - 컴포넌트 프롭스
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 * @returns {React.FC} AuthProvider
 */
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('traveler');

  const signOutHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      await signOut();
      await kakaoSignOut();
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response?.status === 401)) {
        console.error('Sign-out error:', error);
      }
    } finally {
      await clearTokens();
      setAccessToken(null);
      setIsNewUser(false);
      setUserRole('traveler');
      setIsLoading(false);
    }
  }, []);

  // 토큰을 받아 상태를 설정하는 로직을 중앙 관리하는 헬퍼 함수
  const processAndSetAuth = useCallback(async (accessToken: string, refreshToken?: string) => {
    // refreshToken이 주어진 경우에만 토큰을 저장 (로그인, 역할 전환 시)
    if (refreshToken) {
      await saveTokens(accessToken, refreshToken);
    }

    setAccessToken(accessToken);

    try {
      const decodedToken = jwtDecode<DecodedTokenType>(accessToken);
      if (decodedToken.role) {
        const role = decodedToken.role.toLowerCase() as UserRole;
        setUserRole(role);
      }
    } catch (error) {
      console.error('JWT 디코딩 또는 역할 설정 실패', error);
      await signOutHandler(); // 유효하지 않은 토큰은 로그아웃 처리
    }
  }, [signOutHandler]);

  const signInHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const socialAccessToken = await kakaoSignIn();
      const response = await signIn(socialAccessToken);

      if (response.data) {
        const { accessToken, refreshToken, isNewUser } = response.data;
        await processAndSetAuth(accessToken, refreshToken);
        setIsNewUser(isNewUser);
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

  const switchUserRoleHandler = useCallback(async (newUserRole: UserRole) => {
    setIsLoading(true);
    try {
      const response = newUserRole === 'traveler'
        ? await switchToTraveler()
        : await switchToGuide();

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
  }, [processAndSetAuth]);

  useEffect(() => {
    setupInterceptors(reissueToken, signOutHandler);
  }, [signOutHandler]);

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
        console.error("초기 토큰 로딩 중 에러 발생: ", error);
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
        userRole,
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

