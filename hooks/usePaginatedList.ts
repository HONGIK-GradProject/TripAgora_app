import { useCallback, useRef, useState } from 'react';

type Fetcher<T, Args extends any[]> = (
  page: number,
  ...args: Args
) => Promise<{ data: T[]; hasNext: boolean } | null>;

export function usePaginatedList<T, Args extends any[]>(
  fetcher: Fetcher<T, Args>
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const stateRef = useRef({ isLoading, hasNextPage, page });
  stateRef.current = { isLoading, hasNextPage, page };

  const fetchItems = useCallback(
    async (isRefresh: boolean, ...args: Args) => {
      const pageToLoad = isRefresh ? 0 : stateRef.current.page;
      if (
        stateRef.current.isLoading ||
        (!isRefresh && !stateRef.current.hasNextPage)
      ) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetcher(pageToLoad, ...args);

        if (response) {
          setItems((prev) =>
            isRefresh ? response.data : [...prev, ...response.data]
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
    [fetcher]
  );

  const loadMore = useCallback(
    (...args: Args) => {
      if (stateRef.current.hasNextPage && !stateRef.current.isLoading) {
        fetchItems(false, ...args);
      }
    },
    [fetchItems]
  );

  const refetch = useCallback(
    (...args: Args) => {
      fetchItems(true, ...args);
    },
    [fetchItems]
  );

  return { items, isLoading, error, hasNextPage, loadMore, refetch };
}
