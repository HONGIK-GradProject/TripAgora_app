import { getSessionList as apiGetSessionList } from '@/services/sessions';
import { SessionInfo } from '@/types/sessions';
import { useEffect } from 'react';
import { usePaginatedList } from '../usePaginatedList';

async function sessionFetcher(
  page: number,
  statuses?: string[]
): Promise<{ data: SessionInfo[]; hasNext: boolean } | null> {
  const finalStatuses =
    statuses || ['RECRUITING', 'RECRUITMENT_CLOSED', 'IN_PROGRESS'];
  const response = await apiGetSessionList(finalStatuses, page);

  if (response) {
    return { data: response.sessions, hasNext: response.hasNext };
  }
  return null;
}

export const useSessionList = () => {
  const { items, loadMore, refetch, isLoading, error, hasNextPage } =
    usePaginatedList(sessionFetcher);

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