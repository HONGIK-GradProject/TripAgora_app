/**
 * @file AuthContext.tsx
 * @description 인증 관련 컨텍스트와 프로바이더, 커스텀 훅을 제공하는 파일입니다.
 */
import { kakaoSignIn, signIn, signOut } from '@/api/auth';
import { setupInterceptors } from '@/api/client';
import { clearTokens, getTokens, saveTokens } from '@/services/auth';
import { AuthContextType } from '@/types/auth';
import { UserRole } from '@/types/users';
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

  /**
   * @description 카카오 소셜 로그인을 통해 사용자를 인증하고, 상태를 업데이트합니다.
   */
  const signInHandler = useCallback(async () => {
    try {
      const socialAccessToken = await kakaoSignIn();
      const response = await signIn(socialAccessToken);

      if (response.data) {
        const { accessToken, refreshToken, isNewUser } = response.data;
        await saveTokens(accessToken, refreshToken);
        setAccessToken(accessToken);
        setIsNewUser(isNewUser);
        console.log('로그인 성공 및 토큰 저장 완료');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * @description 사용자를 로그아웃하고, 상태를 초기화합니다.
   */
  const signOutHandler = useCallback(async () => {
    try {
      await signOut();
      await clearTokens();
      setAccessToken(null);
      console.log('로그아웃 성공 및 토큰 삭제 완료');
    } catch (error) {
      console.error('Sign-out error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchUserRoleHandler = useCallback(async (newUserRole: UserRole) => {
    try {
      setUserRole(newUserRole);
    } catch (error) {
      console.error('Role Switch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * @description 컴포넌트가 마운트될 때 API 클라이언트의 인터셉터를 설정합니다.
   * 토큰 만료 시 signOutHandler를 호출하여 로그아웃 처리합니다.
   */
  useEffect(() => {
    setupInterceptors(signOutHandler);
  }, [signOutHandler]);

  useEffect(() => {
    const loadAccessToken = async() => {
      try {
        const token = (await getTokens()).accessToken;

        if (token) {
          setAccessToken(token);
        }
      } catch (error) {
        console.error("토큰 로딩 중 에러 발생: ", error);
      }
      finally {
        setIsLoading(false);
      }
    };

    loadAccessToken();
  }, []);
  
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

