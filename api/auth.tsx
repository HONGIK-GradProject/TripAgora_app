import { login as kakaoLogin, logout as kakaoLogout } from '@react-native-seoul/kakao-login';

/**
 * 카카오 로그인을 시도하고 액세스 토큰을 반환합니다.
 * 
 * @returns {Promise<string>} 성공 시 액세스 토큰을 포함하는 Promise를 반환합니다.
 * @throws {Error} 로그인 과정에서 에러가 발생할 경우 'login error' 메시지를 포함한 에러를 발생시킵니다.
 */
const kakaoSignIn = async (): Promise<string> => {
  try {
    const token = await kakaoLogin();
    return token.accessToken;
  }
  catch (err) {
    throw new Error('login error', { cause: err });
  }
};

/**
 * 카카오 로그아웃을 시도합니다.
 * 
 * @returns {Promise<void>} 로그아웃 성공 시 Promise를 반환합니다.
 * @throws {Error} 로그아웃 과정에서 에러가 발생할 경우 'logout error' 메시지를 포함한 에러를 발생시킵니다.
 */
const kakaoSignOut = async (): Promise<void> => {
  try {
    const msg = await kakaoLogout();
  }
  catch (err) {
    throw new Error('logout error', { cause: err });
  }
};

export { kakaoSignIn, kakaoSignOut };

