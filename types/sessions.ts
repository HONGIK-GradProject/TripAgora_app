import APIResponse from './apiResponse';

/**
 * 세션 생성 요청 데이터
 */
interface SessionCreateRequest {
  templateId: number;
  maxParticipants: number;
  startDate: string; // yyyy-mm-dd 형식
}

/**
 * 세션 생성 응답 데이터
 */
interface SessionCreateData {
  sessionId: number;
}

interface SessionCreateResponse extends APIResponse<SessionCreateData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

/**
 * 세션 수정 요청 데이터
 */
interface SessionUpdateRequest {
  maxParticipants: number;
  startDate: string; // yyyy-mm-dd 형식
}

/**
 * 세션 수정 응답 데이터 (빈 데이터)
 */
interface SessionUpdateData {}

interface SessionUpdateResponse extends APIResponse<SessionUpdateData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

/**
 * 세션 삭제 요청 데이터 (빈 데이터)
 */
interface SessionDeleteRequest {}

/**
 * 세션 삭제 응답 데이터 (빈 데이터)
 */
interface SessionDeleteData {}

interface SessionDeleteResponse extends APIResponse<SessionDeleteData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

/**
 * 세션 상태 타입
 */
type SessionStatus =
  | 'RECRUITING'
  | 'RECRUITMENT_CLOSED'
  | 'IN_PROGRESS'
  | 'COMPLETED';

/**
 * 세션 정보 타입 (목록 조회용)
 */
interface SessionInfo {
  sessionId: number;
  title: string;
  firstImageUrl: string;
  regionIds: number[];
  maxParticipants: number;
  currentParticipants: number;
  startDate: string; // yyyy-mm-dd 형식
  endDate: string; // yyyy-mm-dd 형식
  status: SessionStatus;
}

/**
 * 세션 목록 조회 요청 데이터
 */
interface SessionGetListRequest {
  params: {
    statuses?: SessionStatus[];
    page: number;
  };
}

/**
 * 세션 목록 조회 응답 데이터
 */
interface SessionGetListData {
  sessions: SessionInfo[];
  hasNext: boolean;
}

interface SessionGetListResponse extends APIResponse<SessionGetListData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

/**
 * 세션 검색 요청 데이터
 */
interface SessionSearchRequest {
  params: {
    keyword?: string;
    searchStartDate?: string; // yyyy-MM-dd 형식
    searchEndDate?: string; // yyyy-MM-dd 형식
    regionIds?: number[];
    tagIds?: number[];
    page?: number; // 기본값 0
    size?: number; // 기본값 10
  };
}

/**
 * 세션 검색 응답 데이터
 */
interface SessionSearchData {
  sessions: SessionInfo[];
  hasNext: boolean;
}

interface SessionSearchResponse extends APIResponse<SessionSearchData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

/**
 * 세션 상세 조회 요청 데이터 (빈 데이터)
 */
interface SessionGetRequest {}

/**
 * 세션 참여자 정보 타입
 */
interface Participant {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  role: 'GUIDE' | 'TRAVELER';
}

/**
 * 세션 상세 조회 응답 데이터
 */
interface SessionGetData {
  title: string;
  content: string;
  regionIds: number[];
  tagIds: number[];
  imageUrls: string[];
  maxParticipants: number;
  currentParticipants: number;
  startDate: string; // yyyy-mm-dd 형식
  endDate: string; // yyyy-mm-dd 형식
  status: SessionStatus;
  participants: Participant[];
  isParticipating: boolean;
  isInWishlist: boolean;
}

interface SessionGetResponse extends APIResponse<SessionGetData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

/**
 * 세션 일정 정보 타입
 */
interface SessionItinerary {
  id: number;
  day: number;
  title: string;
  content: string;
  startTime: string; // HH:mm:ss 형식
  latitude: number;
  longitude: number;
}

/**
 * 세션 일정 조회 요청 데이터 (빈 데이터)
 */
interface SessionGetItinerariesRequest {}

/**
 * 세션 일정 조회 응답 데이터
 */
interface SessionGetItinerariesData {
  itineraries: SessionItinerary[];
}

interface SessionGetItinerariesResponse
  extends APIResponse<SessionGetItinerariesData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

/**
 * 세션 모집 마감 요청 데이터 (빈 데이터)
 */
interface SessionCloseRequest {
  // 세션 모집 마감 시 추가 데이터 없음
}

/**
 * 세션 모집 마감 응답 데이터 (빈 데이터)
 */
interface SessionCloseData {
  // 세션 모집 마감 시 반환 데이터 없음
}

interface SessionCloseResponse extends APIResponse<SessionCloseData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

/**
 * 세션 참여 요청 데이터 (빈 데이터)
 */
interface SessionParticipationRequest {
  // 세션 참여 시 추가 데이터 없음
}

/**
 * 세션 참여 응답 데이터
 */
interface SessionParticipationData {
  participationId: number; // 세션 참여 ID
  sessionId: number; // 참여 신청한 세션 ID
  currentParticipants: number; // 현재 세션의 참여 인원
}

interface SessionParticipationResponse
  extends APIResponse<SessionParticipationData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

// 세션 참여 취소 관련 타입
interface SessionParticipationCancelRequest {
  // 세션 참여 취소 시 추가 데이터 없음
}

interface SessionParticipationCancelData {
  // 세션 참여 취소 시 반환 데이터 없음
}

interface SessionParticipationCancelResponse
  extends APIResponse<SessionParticipationCancelData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

export {
  Participant,
  SessionCloseData,
  SessionCloseRequest,
  SessionCloseResponse,
  SessionCreateData,
  SessionCreateRequest,
  SessionCreateResponse,
  SessionDeleteData,
  SessionDeleteRequest,
  SessionDeleteResponse,
  SessionGetData,
  SessionGetItinerariesData,
  SessionGetItinerariesRequest,
  SessionGetItinerariesResponse,
  SessionGetListData,
  SessionGetListRequest,
  SessionGetListResponse,
  SessionGetRequest,
  SessionGetResponse,
  SessionInfo,
  SessionItinerary,
  SessionParticipationCancelData,
  SessionParticipationCancelRequest,
  SessionParticipationCancelResponse,
  SessionParticipationData,
  SessionParticipationRequest,
  SessionParticipationResponse,
  SessionSearchData,
  SessionSearchRequest,
  SessionSearchResponse,
  SessionStatus,
  SessionUpdateData,
  SessionUpdateRequest,
  SessionUpdateResponse,
};
