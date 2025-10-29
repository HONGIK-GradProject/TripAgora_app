import { getTemplateList as apiGetTemplateList } from '@/services/templates';
import { TemplateInfo } from '@/types/templates';
import { useEffect } from 'react';
import { usePaginatedList } from '../usePaginatedList';

async function templateFetcher(
  page: number
): Promise<{ data: TemplateInfo[]; hasNext: boolean } | null> {
  const response = await apiGetTemplateList(page);

  if (response) {
    return { data: response.templates, hasNext: response.hasNext };
  }
  return null;
}

export const useTemplateList = () => {
  const { items, loadMore, refetch, isLoading, error, hasNextPage } =
    usePaginatedList(templateFetcher);

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