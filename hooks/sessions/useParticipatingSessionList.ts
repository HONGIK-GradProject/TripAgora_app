/**
 * @file useParticipatingSessionList.ts
 * @description 사용자가 참여하고 있는 세션 목록을 페이지네이션으로 불러오는 커스텀 훅입니다.
 */
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { getParticipatingSessionList } from '@/services/sessions';
import { SessionInfo } from '@/types/sessions';
import { useEffect } from 'react';

/**
 * 참여중인 세션 목록을 가져오는 fetcher 함수.
 * @param {number} page - 페이지 번호.
 * @param {string[]} [statuses] - 조회할 세션 상태 목록.
 * @returns {Promise<{data: SessionInfo[], hasNext: boolean} | null>} 세션 목록과 다음 페이지 존재 여부를 반환합니다.
 */
const fetcher = async (page: number, statuses?: string[]): Promise<{ data: SessionInfo[]; hasNext: boolean; } | null> => {
  const finalStatuses =
    statuses || ['RECRUITING', 'RECRUITMENT_CLOSED', 'IN_PROGRESS'];
  const response = await getParticipatingSessionList(finalStatuses, page);

  if (response) {
    return { data: response.sessions, hasNext: response.hasNext };
  }
  return null;
};

/**
 * 사용자가 참여하고 있는 세션 목록을 페이지네이션으로 불러오는 커스텀 훅.
 * `usePaginatedList`를 사용하여 세션 목록을 관리합니다.
 * @returns {{sessions: SessionInfo[], isLoading: boolean, error: Error | null, hasNextPage: boolean, loadMore: Function, refetch: Function}}
 */
export const useParticipatingSessionList = (): { sessions: SessionInfo[]; isLoading: boolean; error: Error | null; hasNextPage: boolean; loadMore: Function; refetch: Function; } => {
  const { items, isLoading, error, hasNextPage, loadMore, refetch } =
    usePaginatedList(fetcher);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { sessions: items, isLoading, error, hasNextPage, loadMore, refetch };
};
