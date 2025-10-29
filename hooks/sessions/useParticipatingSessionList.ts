import { usePaginatedList } from '@/hooks/usePaginatedList';
import { getParticipatingSessionList } from '@/services/sessions';
import { useEffect } from 'react';

const fetcher = async (page: number, statuses?: string[]) => {
  const finalStatuses =
    statuses || ['RECRUITING', 'RECRUITMENT_CLOSED', 'IN_PROGRESS'];
  const response = await getParticipatingSessionList(finalStatuses, page);

  if (response) {
    return { data: response.sessions, hasNext: response.hasNext };
  }
  return null;
}

export const useParticipatingSessionList = () => {
  const {items, isLoading, error, hasNextPage, loadMore, refetch } =
    usePaginatedList(fetcher);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { sessions: items, isLoading, error, hasNextPage, loadMore, refetch };
};
