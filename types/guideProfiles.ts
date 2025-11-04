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
  bio: string;
  tags: number[];
  portfolios: Portfolio[];
  SessionList: GuideProfileSessionList;
}

interface GuideProfileGetResponse extends APIResponse<GuideProfileGetData> {}

export {
  GuideProfileGetData,
  GuideProfileGetRequest,
  GuideProfileGetResponse,
  GuideProfileSessionList,
  Portfolio,
  PortfolioType,
};
