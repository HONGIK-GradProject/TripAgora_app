/**
 * @file 리뷰 관련 API 함수를 제공합니다.
 * @module api/reviews
 */

import {
  ReviewCreateRequest,
  ReviewCreateResponse,
  ReviewDeleteRequest,
  ReviewDeleteResponse,
  ReviewUpdateRequest,
  ReviewUpdateResponse,
} from '@/types/reviews';
import apiClient from './client';

/**
 * 새로운 리뷰를 생성합니다.
 * @param sessionId - 리뷰를 작성할 세션의 ID
 * @param content - 리뷰 내용
 * @param rating - 평점 (정수)
 * @returns 생성된 리뷰 정보를 포함한 응답 데이터
 */
const createReview = async (
  sessionId: number,
  content: string,
  rating: number
): Promise<ReviewCreateResponse> => {
  const requestData: ReviewCreateRequest = {
    sessionId,
    content,
    rating,
  };
  const response = await apiClient.post<ReviewCreateResponse>(
    '/reviews',
    requestData
  );
  return response.data;
};

/**
 * 기존 리뷰를 수정합니다.
 * @param reviewId - 수정할 리뷰의 ID
 * @param content - 수정할 리뷰 내용
 * @param rating - 수정할 평점 (정수)
 * @returns 수정된 리뷰 정보를 포함한 응답 데이터
 */
const updateReview = async (
  reviewId: number,
  content: string,
  rating: number
): Promise<ReviewUpdateResponse> => {
  const requestData: ReviewUpdateRequest = {
    content,
    rating,
  };
  const response = await apiClient.put<ReviewUpdateResponse>(
    `/reviews/${reviewId}`,
    requestData
  );
  return response.data;
};

/**
 * 기존 리뷰를 삭제합니다.
 * @param reviewId - 삭제할 리뷰의 ID
 * @returns 삭제 결과를 담은 Promise
 */
const deleteReview = async (
  reviewId: number
): Promise<ReviewDeleteResponse> => {
  const requestData: ReviewDeleteRequest = {};
  const response = await apiClient.delete<ReviewDeleteResponse>(
    `/reviews/${reviewId}`,
    { data: requestData }
  );
  return response.data;
};

export const reviewsApi = {
  createReview,
  updateReview,
  deleteReview,
};
