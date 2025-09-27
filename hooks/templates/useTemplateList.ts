import { getTemplateList } from "@/services/templates";
import { TemplateInfo } from "@/types/templates";
import { useCallback, useEffect, useState } from "react";

export const useTemplateList = () => {
  const [products, setProducts] = useState<TemplateInfo[]>([]);
  const [page, setPage] = useState(0); // API가 0-indexed 페이지를 사용한다고 가정
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    // 로딩 중이거나 다음 페이지가 없으면 실행 중단
    if (isLoading || !hasNextPage) {
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log('Calling page ', page);

    try {
      // getTemplateList의 반환 값에 templates 배열과 hasNextPage 유무가 있다고 가정
      const response = await getTemplateList(page);

      if (response && response.templates.length > 0) {
        setProducts((prevProducts) => [...prevProducts, ...response.templates]);
        setPage((prevPage) => prevPage + 1);
        // 실제 API 응답에 hasNextPage와 같은 다음 페이지 유무 정보가 있어야 합니다.
        // 여기서는 불러온 데이터가 있으면 다음 페이지도 있다고 가정합니다.
        // setHasNextPage(response.hasNextPage); 
      } else {
        // 더 이상 불러올 데이터가 없음
        setHasNextPage(false);
      }
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasNextPage, page]);

  // 첫 페이지 데이터 로딩
  useEffect(() => {
    // 초기 마운트 시 첫 페이지 로드
    loadMore();
  }, []); // 이펙트는 한 번만 실행됩니다.

  return { products, isLoading, error, hasNextPage, loadMore };
};