/**
 * @file useTemplateList.ts
 * @description 가이드가 생성한 템플릿 목록을 페이지네이션으로 불러오는 커스텀 훅입니다.
 */
import { getTemplateList as apiGetTemplateList } from '@/services/templates';
import { useEffect } from 'react';
import { usePaginatedList } from '../usePaginatedList';

/**
 * 템플릿 목록을 가져오는 fetcher 함수.
 * @param {number} page - 페이지 번호.
 * @returns {Promise<{data: any[], hasNext: boolean} | null>} 템플릿 목록과 다음 페이지 존재 여부를 반환합니다.
 */
const fetcher = async (page: number): Promise<{ data: any[]; hasNext: boolean; } | null> => {
  const response = await apiGetTemplateList(page);

  if (response) {
    return { data: response.templates, hasNext: response.hasNext };
  }
  return null;
};

/**
 * 가이드가 생성한 템플릿 목록을 페이지네이션으로 불러오는 커스텀 훅.
 * `usePaginatedList`를 사용하여 템플릿 목록을 관리합니다.
 * @returns {{products: any[], loadMore: Function, refetch: Function, isLoading: boolean, error: Error | null, hasNextPage: boolean}}
 */
export const useTemplateList = (): { products: any[]; loadMore: Function; refetch: Function; isLoading: boolean; error: Error | null; hasNextPage: boolean; } => {
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