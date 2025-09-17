import { kakaoSignIn, signIn, signOut } from '@/api/auth';
import { AuthContextType } from '@/types/auth';
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

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

  return (
    <AuthContext.Provider
      value={{
        accessToken, isLoading, isNewUser, signIn: signInHandler, signOut: signOutHandler
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };

