import { getSessionList as apiGetSessionList } from '@/services/sessions';
import { useEffect } from 'react';
import { usePaginatedList } from '../usePaginatedList';

const fetcher = async(page: number, statuses?: string[]) => {
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