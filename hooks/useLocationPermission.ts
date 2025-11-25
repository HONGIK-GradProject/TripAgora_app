import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

/**
 * expo-location을 사용하여 위치 정보 접근 권한을 관리하는 커스텀 훅입니다.
 * 
 * @returns `status`: 현재 권한 상태 (granted, denied, or undetermined).
 * @returns `requestPermission`: 사용자에게 권한을 요청하는 함수.
 */
export const useLocationPermission = () => {
  const [status, setStatus] = useState<Location.PermissionStatus | null>(null);

  /**
   * 사용자에게 위치 정보 접근 권한을 요청합니다.
   * @returns {Promise<Location.PermissionStatus>} 요청 후의 권한 상태.
   */
  const requestPermission = useCallback(async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    setStatus(foregroundStatus);
    return foregroundStatus;
  }, []);

  // 훅이 처음 마운트될 때 현재 권한 상태를 가져옵니다.
  useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      setStatus(existingStatus);
    })();
  }, []);

  return { status, requestPermission };
};
