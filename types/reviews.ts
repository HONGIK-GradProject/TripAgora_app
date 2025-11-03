import APIResponse from './apiResponse';

/**
 * 리뷰 생성 요청 데이터
 */
interface ReviewCreateRequest {
  sessionId: number;
  content: string;
  rating: number;
}

/**
 * 리뷰 생성 응답 데이터
 */
interface ReviewCreateData {
  reviewId: number;
  authorNickname: string;
  authorProfile: string;
  content: string;
  rating: number;
  createdAt: string; // LocalDateTime을 string으로 변환
}

type ReviewCreateResponse = APIResponse<ReviewCreateData>;

/**
 * 리뷰 수정 요청 데이터
 */
interface ReviewUpdateRequest {
  content: string;
  rating: number;
}

type ReviewUpdateResponse = APIResponse<ReviewCreateData>;

/**
 * 리뷰 삭제 요청 데이터 (빈 데이터)
 */
interface ReviewDeleteRequest {}

/**
 * 리뷰 삭제 응답 데이터 (빈 데이터)
 */
interface ReviewDeleteData {}

type ReviewDeleteResponse = APIResponse<ReviewDeleteData>;

export {
  ReviewCreateData,
  ReviewCreateRequest,
  ReviewCreateResponse,
  ReviewDeleteData,
  ReviewDeleteRequest,
  ReviewDeleteResponse,
  ReviewUpdateRequest,
  ReviewUpdateResponse,
};
