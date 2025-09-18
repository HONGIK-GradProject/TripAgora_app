import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

export default function Index() {
  const { accessToken, isLoading } = useAuth();
  
  if (!accessToken) {
    return <Redirect href="/login" />;
  }
  
  return <Redirect href="/home" />;
}
