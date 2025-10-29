import { getTemplateList as apiGetTemplateList } from '@/services/templates';
import { useEffect } from 'react';
import { usePaginatedList } from '../usePaginatedList';

const fetcher = async (page: number) => {
  const response = await apiGetTemplateList(page);

  if (response) {
    return { data: response.templates, hasNext: response.hasNext };
  }
  return null;
}

export const useTemplateList = () => {
  const { items, loadMore, refetch, isLoading, error, hasNextPage } =
    usePaginatedList(fetcher);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    products: items,
    loadMore,
    refetch,
    isLoading,
    error,
    hasNextPage,
  };
};