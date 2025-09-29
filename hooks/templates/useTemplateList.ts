import { getTemplateList } from '@/services/templates';
import { TemplateInfo } from '@/types/templates';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useTemplateList = () => {
  const [products, setProducts] = useState<TemplateInfo[]>([]);
  const [page, setPage] = useState(0); // API가 0-indexed 페이지를 사용한다고 가정
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // useRef를 사용하여 의존성 배열로 인한 무한 루프를 방지합니다.
  const stateRef = useRef({ isLoading, hasNextPage, page });
  stateRef.current = { isLoading, hasNextPage, page };

  const fetchTemplates = useCallback(
    async (isRefresh: boolean) => {
      const pageToLoad = isRefresh ? 0 : stateRef.current.page;
      // ref를 통해 최신 상태를 확인합니다.
      if (stateRef.current.isLoading || (!isRefresh && !stateRef.current.hasNextPage)) {
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
    [] // 의존성 배열을 비워서 함수가 재생성되지 않도록 합니다.
  );

  const loadMore = useCallback(() => {
    // loadMore는 항상 false로 fetchTemplates를 호출합니다.
    if (stateRef.current.hasNextPage && !stateRef.current.isLoading) {
      fetchTemplates(false);
    }
  }, [fetchTemplates]);

  const refetch = useCallback(() => {
    fetchTemplates(true);
  }, [fetchTemplates]);

  useEffect(() => {
    // 컴포넌트 마운트 시 첫 페이지 로드
    fetchTemplates(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTemplates]); // fetchTemplates는 이제 안정적인 의존성입니다.

  return { products, isLoading, error, hasNextPage, loadMore, refetch };
};
