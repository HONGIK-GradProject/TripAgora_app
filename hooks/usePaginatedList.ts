/**
 * @file usePaginatedList.ts
 * @description 페이지네이션된 목록을 관리하기 위한 커스텀 훅입니다.
 */
import { useCallback, useRef, useState } from 'react';

/**
 * 데이터를 가져오는 함수의 타입 정의.
 * @template T - 목록 아이템의 타입.
 * @template Args - fetcher 함수에 전달될 추가 인자들의 타입 배열.
 * @param {number} page - 가져올 페이지 번호.
 * @param {...Args} args - 추가 인자.
 * @returns {Promise<{ data: T[]; hasNext: boolean } | null>} 데이터와 다음 페이지 존재 여부를 포함하는 객체.
 */
type Fetcher<T, Args extends any[]> = (
  page: number,
  ...args: Args
) => Promise<{ data: T[]; hasNext: boolean } | null>;

/**
 * 페이지네이션된 목록을 관리하는 커스텀 훅.
 *
 * @template T - 목록 아이템의 타입.
 * @template Args - fetcher 함수에 전달될 추가 인자들의 타입 배열.
 * @param {Fetcher<T, Args>} fetcher - 데이터를 가져오는 비동기 함수.
 * @returns {{
 *   items: T[];
 *   isLoading: boolean;
 *   error: Error | null;
 *   hasNextPage: boolean;
 *   loadMore: (...args: Args) => void;
 *   refetch: (...args: Args) => void;
 * }} 페이지네이션 상태와 함수들을 포함하는 객체.
 * - `items`: 현재까지 불러온 아이템 목록.
 * - `isLoading`: 데이터를 불러오는 중인지 여부.
 * - `error`: 발생한 에러 객체.
 * - `hasNextPage`: 다음 페이지가 있는지 여부.
 * - `loadMore`: 다음 페이지를 불러오는 함수.
 * - `refetch`: 목록을 새로고침하는 함수.
 */
export const usePaginatedList = <T, Args extends any[]>(
  fetcher: Fetcher<T, Args>
): {
  items: T[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  loadMore: (...args: Args) => void;
  refetch: (...args: Args) => void;
} => {
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
