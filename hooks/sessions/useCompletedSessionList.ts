/**
 * @file useCompletedSessionList.ts
 * @description 사용자가 참여하여 완료한 세션 목록을 페이지네이션으로 불러오는 커스텀 훅입니다.
 */
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { getCompletedSessions } from '@/services/sessions';
import { SessionCompletedInfo } from '@/types/sessions';
import { useEffect } from 'react';

/**
 * 완료된 세션 목록을 가져오는 fetcher 함수.
 * @param {number} page - 페이지 번호.
 * @returns {Promise<{data: SessionCompletedInfo[], hasNext: boolean} | null>} 세션 목록과 다음 페이지 존재 여부를 반환합니다.
 */
const fetcher = async (
  page: number
): Promise<{ data: SessionCompletedInfo[]; hasNext: boolean } | null> => {
  const response = await getCompletedSessions(page);

  if (response) {
    return { data: response.sessions, hasNext: response.hasNext };
  }
  return null;
};

/**
 * 사용자가 참여하여 완료한 세션 목록을 페이지네이션으로 불러오는 커스텀 훅.
 * `usePaginatedList`를 사용하여 세션 목록을 관리합니다.
 * @returns {{sessions: SessionCompletedInfo[], isLoading: boolean, error: Error | null, hasNextPage: boolean, loadMore: Function, refetch: Function}}
 */
export const useCompletedSessionList = (): {
  sessions: SessionCompletedInfo[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  loadMore: Function;
  refetch: Function;
} => {
  const { items, isLoading, error, hasNextPage, loadMore, refetch } =
    usePaginatedList(fetcher);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { sessions: items, isLoading, error, hasNextPage, loadMore, refetch };
};
