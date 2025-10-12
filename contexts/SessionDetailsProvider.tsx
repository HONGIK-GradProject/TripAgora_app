import { getSession } from '@/services/sessions';
import React, { createContext, ReactNode, useCallback, useState } from 'react';

/**
 * 세션 상세 정보 관련 상태와 로직을 관리하는 내부 훅입니다.
 * 세션 ID를 기반으로 상세 정보를 가져오고, 상태를 관리하는 다양한 함수를 제공합니다.
 * @param id - 상세 정보를 조회할 세션의 ID
 * @returns 세션 상세 정보 상태와 관리 함수들을 담은 객체
 */
const useSessionDetailsLogic = (id: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [regionIds, setRegionIds] = useState<number[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [maxParticipants, setMaxParticipants] = useState<number>(0);
  const [currentParticipants, setCurrentParticipants] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  /**
   * 서버에서 세션 상세 정보를 비동기적으로 가져와 상태를 업데이트합니다.
   */
  const fetchSessionDetails = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await getSession(+id);

      if (response) {
        setTitle(response.title);
        setContent(response.content);
        setRegionIds(response.regionIds);
        setTagIds(response.tagIds);
        setImageUrls(response.imageUrls);
        setMaxParticipants(response.maxParticipants);
        setCurrentParticipants(response.currentParticipants);
        setStartDate(response.startDate);
        setEndDate(response.endDate);
        setStatus(response.status);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return {
    isLoading,
    title,
    content,
    regionIds,
    tagIds,
    imageUrls,
    maxParticipants,
    currentParticipants,
    startDate,
    endDate,
    status,
    setTitle,
    setContent,
    setRegionIds,
    setTagIds,
    setImageUrls,
    setMaxParticipants,
    setCurrentParticipants,
    setStartDate,
    setEndDate,
    setStatus,
    refetch: fetchSessionDetails,
  };
};

/**
 * 세션 상세 정보 상태를 공유하기 위한 React Context입니다.
 */
export const SessionDetailsContext = createContext<
  ReturnType<typeof useSessionDetailsLogic> | undefined
>(undefined);

/**
 * 하위 컴포넌트들에게 세션 상세 정보 컨텍스트를 제공하는 Provider 컴포넌트입니다.
 * `_layout.tsx`와 같은 레이아웃 컴포넌트에서 화면을 감싸는 데 사용됩니다.
 * @param children - 컨텍스트를 제공받을 자식 컴포넌트들
 * @param id - 상태를 초기화하고 데이터를 가져오는 데 사용될 세션의 ID
 */
export const SessionDetailsProvider = ({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) => {
  const sessionDetails = useSessionDetailsLogic(id);
  return (
    <SessionDetailsContext.Provider value={sessionDetails}>
      {children}
    </SessionDetailsContext.Provider>
  );
};
