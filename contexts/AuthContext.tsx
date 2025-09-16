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

    if (!isLoading && !session && !inAuthGroup) {
      router.replace('/login');
    } else if (session && inAuthGroup) {
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

  useEffect(() => {
    const handleOnAuthError = () => {
      router.replace('/login');
    }
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
