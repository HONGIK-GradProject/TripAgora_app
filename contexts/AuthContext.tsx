/**
 * @file AuthContext.tsx
 * @description 인증 관련 컨텍스트와 프로바이더, 커스텀 훅을 제공하는 파일입니다.
 */
import { kakaoSignIn, signIn, signOut } from '@/api/auth';
import { setupInterceptors } from '@/api/client';
import { AuthContextType } from '@/types/auth';
import { createContext, useEffect, useState } from 'react';

/**
 * @description 인증 관련 상태 및 함수를 제공하는 Context입니다.
 * @property {string | null} accessToken - 사용자의 액세스 토큰
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

  /**
   * @description 카카오 소셜 로그인을 통해 사용자를 인증하고, 상태를 업데이트합니다.
   */
  const signInHandler = async () => {
    try {
      const socialAccessToken = await kakaoSignIn();
      const response = await signIn(socialAccessToken);
      setAccessToken(response?.data?.accessToken || null);
      setIsNewUser(response?.data?.isNewUser || false);
    } catch (error) {
      console.error('Sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @description 사용자를 로그아웃하고, 상태를 초기화합니다.
   */
  const signOutHandler = async () => {
    try {
      await signOut();
      setAccessToken(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setupInterceptors(signOutHandler);
  }, [signOutHandler]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isLoading,
        isNewUser,
        signIn: signInHandler,
        signOut: signOutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
