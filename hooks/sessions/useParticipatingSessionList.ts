import { getParticipatingSessionList } from '@/services/sessions';
import { SessionInfo } from '@/types/sessions';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useParticipatingSessionList = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // useRef를 사용하여 의존성 배열로 인한 무한 루프를 방지합니다.
  const stateRef = useRef({ isLoading, hasNextPage, page });
  stateRef.current = { isLoading, hasNextPage, page };

  const fetchSessions = useCallback(
    async (isRefresh: boolean, statuses?: string[]) => {
      const pageToLoad = isRefresh ? 0 : stateRef.current.page;
      // ref를 통해 최신 상태를 확인합니다.
      if (
        stateRef.current.isLoading ||
        (!isRefresh && !stateRef.current.hasNextPage)
      ) {
        return;
      }

      setIsLoading(true);
      setError(null);
      console.log('Calling page ', pageToLoad);

      // statuses가 비었을 때 기본 statuses를 설정합니다.
      if (!statuses)
        statuses = ['RECRUITING', 'RECRUITMENT_CLOSED', 'IN_PROGRESS'];

      try {
        const response = await getParticipatingSessionList(
          statuses,
          pageToLoad
        );

        if (response) {
          setSessions((prev) =>
            isRefresh ? response.sessions : [...prev, ...response.sessions]
          );
          setPage(pageToLoad + 1);
          setHasNextPage(response.hasNext);
        } else {
          setHasNextPage(false);
        }
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [] // 의존성 배열을 비워서 함수가 재생성되지 않도록 합니다.
  );

  const loadMore = useCallback(
    (statuses?: string[]) => {
      // loadMore는 항상 false로 fetchSessions를 호출합니다.
      if (stateRef.current.hasNextPage && !stateRef.current.isLoading) {
        fetchSessions(false, statuses);
      }
    },
    [fetchSessions]
  );

  const refetch = useCallback(
    (statuses?: string[]) => {
      fetchSessions(true, statuses);
    },
    [fetchSessions]
  );

  useEffect(() => {
    // 컴포넌트 마운트 시 첫 페이지 로드
    fetchSessions(true);
  }, [fetchSessions]);

  return { sessions, isLoading, error, hasNextPage, loadMore, refetch };
};
