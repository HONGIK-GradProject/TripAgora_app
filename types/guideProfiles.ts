import APIResponse from './apiResponse';
import { SessionInfo } from './sessions';

/**
 * 포트폴리오 타입
 */
type PortfolioType =
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'TWITTER'
  | 'YOUTUBE'
  | 'WEBSITE';

/**
 * 포트폴리오 정보
 */
interface Portfolio {
  type: PortfolioType;
  url: string;
}

/**
 * 가이드 프로필 조회 요청 데이터
 */
interface GuideProfileGetRequest {
  params?: {
    page?: number;
  };
}

/**
 * 가이드 프로필 세션 목록 데이터
 */
interface GuideProfileSessionList {
  sessions: SessionInfo[];
  hasNext: boolean;
}

/**
 * 가이드 프로필 조회 응답 데이터
 */
interface GuideProfileGetData {
  nickname: string;
  imageUrl: string;
  userImageUrl?: string;
  bio: string;
  tags: number[];
  portfolios: Portfolio[];
  SessionList: GuideProfileSessionList;
}

interface GuideProfileGetResponse extends APIResponse<GuideProfileGetData> {}

/**
 * 가이드 프로필 bio 수정 요청 데이터
 */
interface GuideProfileUpdateBioRequest {
  bio: string;
}

/**
 * 가이드 프로필 bio 수정 응답 데이터
 */
interface GuideProfileUpdateBioData {
  bio: string;
}

interface GuideProfileUpdateBioResponse
  extends APIResponse<GuideProfileUpdateBioData> {}

/**
 * 가이드 프로필 이미지 수정 요청 데이터
 */
type GuideProfileUpdateImageRequest = FormData;

/**
 * 가이드 프로필 이미지 수정 응답 데이터
 */
interface GuideProfileUpdateImageData {
  imageUrl: string;
}

interface GuideProfileUpdateImageResponse
  extends APIResponse<GuideProfileUpdateImageData> {}

/**
 * 가이드 프로필 포트폴리오 수정 요청 데이터
 */
interface GuideProfileUpdatePortfoliosRequest {
  portfolios: Portfolio[];
}

/**
 * 가이드 프로필 포트폴리오 수정 응답 데이터
 */
interface GuideProfileUpdatePortfoliosData {
  portfolios: Portfolio[];
}

interface GuideProfileUpdatePortfoliosResponse
  extends APIResponse<GuideProfileUpdatePortfoliosData> {}

export {
  GuideProfileGetData,
  GuideProfileGetRequest,
  GuideProfileGetResponse,
  GuideProfileSessionList,
  GuideProfileUpdateBioData,
  GuideProfileUpdateBioRequest,
  GuideProfileUpdateBioResponse,
  GuideProfileUpdateImageData,
  GuideProfileUpdateImageRequest,
  GuideProfileUpdateImageResponse,
  GuideProfileUpdatePortfoliosData,
  GuideProfileUpdatePortfoliosRequest,
  GuideProfileUpdatePortfoliosResponse,
  Portfolio,
  PortfolioType,
};
