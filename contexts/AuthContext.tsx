import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { signIn as apiSignIn, signOut as apiSignOut } from '@/api/auth';
import { setOnAuthError } from '@/api/client';

const AuthContext = createContext<{
  signIn: (accessToken: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => {},
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useState<[boolean, string | null]>(
    [true, null]
  );
  const router = useRouter();
  const segments = useSegments();
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          setSession([false, token]);
        } else {
          setSession([false, null]);
        }
      } catch (e: Error | any) {
        console.error('Failed to restore session:', e.message);
        setSession([false, null]);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login';
    // 프로필 설정 화면인지 확인 (set-profile, set-interests)
    const isProfileSetupScreen =
      inAuthGroup &&
      (segments[1] === 'set-profile' || segments[1] === 'set-interests');

    if (!isLoading && !session && !inAuthGroup) {
      // 로그인되지 않았고, 인증 관련 페이지에 있지 않다면 로그인 페이지로 이동
      router.replace('/login');
    } else if (session && inAuthGroup && !isProfileSetupScreen) {
      // 로그인되었고, 인증 관련 페이지에 있지만 프로필 설정 중이 아니라면 홈으로 이동
      router.replace('/(tabs)/home');
    }
  }, [session, segments, isLoading, router]);

  const signIn = async (kakaoAccessToken: string) => {
    const response = await apiSignIn(kakaoAccessToken);
    if (response && response.data) {
      const { accessToken, isNewUser } = response.data;
      setSession([false, accessToken]);

      if (isNewUser) {
        router.replace('/login/set-profile');
      } else {
        router.replace('/(tabs)/home');
      }
    }
  };

  const signOut = async () => {
    await apiSignOut();
    setSession([false, null]);
    router.replace('/login');
  };

  /**
   * 전역 인증 에러 핸들러를 API 클라이언트에 등록합니다.
   * 이 useEffect는 앱이 마운트될 때 한 번 실행되어, axios 인터셉터에서
   * 토큰 갱신 실패와 같은 인증 에러가 발생했을 때 호출될 콜백 함수를 설정합니다.
   * 콜백이 호출되면 사용자를 로그인 화면으로 리디렉션합니다.
   */
  useEffect(() => {
    const handleOnAuthError = () => {
      router.replace('/login');
    };
    setOnAuthError(handleOnAuthError);
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
