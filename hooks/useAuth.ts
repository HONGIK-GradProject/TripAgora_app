import { AuthContext, AuthContextType } from "@/contexts/AuthContext";
import { useContext } from "react";

/**
 * @description AuthContext를 사용하기 위한 커스텀 훅입니다.
 * @throws {Error} AuthProvider 외부에서 사용될 경우 에러를 발생시킵니다.
 * @returns {AuthContextType} AuthContext
 */
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };

