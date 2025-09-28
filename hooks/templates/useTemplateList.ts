import { getTemplateList } from '@/services/templates';
import { TemplateInfo } from '@/types/templates';
import { useCallback, useEffect, useState } from 'react';

export const useTemplateList = () => {
  const [products, setProducts] = useState<TemplateInfo[]>([]);
  const [page, setPage] = useState(0); // API가 0-indexed 페이지를 사용한다고 가정
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplates = useCallback(
    async (isRefresh: boolean) => {
      const pageToLoad = isRefresh ? 0 : page;
      if (isLoading || (!isRefresh && !hasNextPage)) {
        return;
      }

      setIsLoading(true);
      setError(null);
      console.log('Calling page ', pageToLoad);

      try {
        const response = await getTemplateList(pageToLoad);

        if (response) {
          setProducts((prev) =>
            isRefresh ? response.templates : [...prev, ...response.templates]
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
    [isLoading, hasNextPage, page]
  );

  const loadMore = useCallback(() => {
    fetchTemplates(false);
  }, [fetchTemplates]);

  const refetch = useCallback(() => {
    fetchTemplates(true);
  }, [fetchTemplates]);

  useEffect(() => {
    fetchTemplates(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, isLoading, error, hasNextPage, loadMore, refetch };
};
