import * as SecureStore from 'expo-secure-store';

/**
 * SecureStore에 액세스 토큰과 리프레시 토큰을 저장합니다.
 * @param accessToken - 저장할 액세스 토큰
 * @param refreshToken - 저장할 리프레시 토큰
 */
const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  } catch (error) {
    console.error('Error saving tokens:', error); 
  }
}

/**
 * SecureStore에서 액세스 토큰과 리프레시 토큰을 삭제합니다.
 */
const clearTokens = async () => {
  try {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
}

/**
 * SecureStore에서 액세스 토큰과 리프레시 토큰을 가져옵니다.
 * @returns 액세스 토큰과 리프레시 토큰을 포함하는 객체를 반환합니다. 토큰이 없을 경우 null을 반환합니다.
 */
const getTokens = async (): Promise<{ accessToken: string | null; refreshToken: string | null }> => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return { accessToken: null, refreshToken: null };
  }
}

export { clearTokens, getTokens, saveTokens };
