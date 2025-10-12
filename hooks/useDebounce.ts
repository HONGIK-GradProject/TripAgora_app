import { useEffect, useState } from 'react';

/**
 * 값의 변경을 지연시키는 Debounce 커스텀 훅입니다.
 * @param value 지연시킬 값
 * @param delay 지연 시간 (밀리초)
 * @returns 지연 처리된 값
 */
const useDebounce = <T>(value: T, delay: number): T => {
  // 디바운스된 값을 저장하기 위한 state
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // value가 변경된 후 delay 시간만큼 기다렸다가 debouncedValue를 업데이트합니다.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 다음 value 변경이 일어나거나, 컴포넌트가 unmount될 때 타이머를 정리(cleanup)합니다.
    // 이렇게 하지 않으면 이전 타이머가 계속 실행될 수 있습니다.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // value나 delay가 변경될 때만 effect를 다시 실행합니다.

  return debouncedValue;
}

export default useDebounce;
