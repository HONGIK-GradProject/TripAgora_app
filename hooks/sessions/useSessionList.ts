/**
 * @file useSessionList.ts
 * @description 가이드가 생성한 세션 목록을 페이지네이션으로 불러오는 커스텀 훅입니다.
 */
import { getSessionList as apiGetSessionList } from '@/services/sessions';
import { SessionInfo } from '@/types/sessions';
import { useEffect } from 'react';
import { usePaginatedList } from '../usePaginatedList';

/**
 * 세션 목록을 가져오는 fetcher 함수.
 * @param {number} page - 페이지 번호.
 * @param {string[]} [statuses] - 조회할 세션 상태 목록.
 * @returns {Promise<{data: SessionInfo[], hasNext: boolean} | null>} 세션 목록과 다음 페이지 존재 여부를 반환합니다.
 */
const fetcher = async (page: number, statuses?: string[]): Promise<{ data: SessionInfo[]; hasNext: boolean; } | null> => {
  const finalStatuses =
    statuses || ['RECRUITING', 'RECRUITMENT_CLOSED', 'IN_PROGRESS'];
  const response = await apiGetSessionList(finalStatuses, page);

  if (response) {
    return { data: response.sessions, hasNext: response.hasNext };
  }
  return null;
};

/**
 * 가이드가 생성한 세션 목록을 페이지네이션으로 불러오는 커스텀 훅.
 * `usePaginatedList`를 사용하여 세션 목록을 관리합니다.
 * @returns {{sessions: SessionInfo[], loadMore: Function, refetch: Function, isLoading: boolean, error: Error | null, hasNextPage: boolean}}
 */
export const useSessionList = (): { sessions: SessionInfo[]; loadMore: Function; refetch: Function; isLoading: boolean; error: Error | null; hasNextPage: boolean; } => {
  const { items, loadMore, refetch, isLoading, error, hasNextPage } =
    usePaginatedList(fetcher);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    sessions: items,
    loadMore,
    refetch,
    isLoading,
    error,
    hasNextPage,
  };
};