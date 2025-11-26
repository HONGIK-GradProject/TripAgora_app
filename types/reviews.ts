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
interface ReviewData {
  reviewId: number;
  authorNickname: string;
  authorProfile: string;
  content: string;
  rating: number;
  createdAt: string; // LocalDateTime을 string으로 변환
  templateTitle: string; // 가이드별 리뷰 조회 시 템플릿 제목
}

type ReviewCreateResponse = APIResponse<ReviewData>;

/**
 * 리뷰 수정 요청 데이터
 */
interface ReviewUpdateRequest {
  content: string;
  rating: number;
}

type ReviewUpdateResponse = APIResponse<ReviewData>;

/**
 * 리뷰 삭제 요청 데이터 (빈 데이터)
 */
interface ReviewDeleteRequest {}

/**
 * 리뷰 삭제 응답 데이터 (빈 데이터)
 */
interface ReviewDeleteData {}

type ReviewDeleteResponse = APIResponse<ReviewDeleteData>;

/**
 * 가이드별 리뷰 목록 조회 응답 데이터
 */
interface ReviewGetByGuideData {
  averageRating: number; // Float
  totalReviewCount: number; // Int
  review: ReviewData[]; // 리뷰 배열
}

type ReviewGetByGuideResponse = APIResponse<ReviewGetByGuideData>;

/**
 * 템플릿별 리뷰 목록 조회 응답 데이터 (가이드와 동일한 구조)
 */
type ReviewGetByTemplateData = ReviewGetByGuideData;

type ReviewGetByTemplateResponse = APIResponse<ReviewGetByTemplateData>;

export {
  ReviewCreateRequest,
  ReviewCreateResponse,
  ReviewData,
  ReviewDeleteData,
  ReviewDeleteRequest,
  ReviewDeleteResponse,
  ReviewGetByGuideData,
  ReviewGetByGuideResponse,
  ReviewGetByTemplateData,
  ReviewGetByTemplateResponse,
  ReviewUpdateRequest,
  ReviewUpdateResponse,
};
