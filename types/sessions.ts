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
  regionNames: string[];
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
 * 세션 상세 조회 요청 데이터 (빈 데이터)
 */
interface SessionGetRequest {}

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
}

interface SessionGetResponse extends APIResponse<SessionGetData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

export {
  SessionCreateData,
  SessionCreateRequest,
  SessionCreateResponse,
  SessionDeleteData,
  SessionDeleteRequest,
  SessionDeleteResponse,
  SessionGetData,
  SessionGetListData,
  SessionGetListRequest,
  SessionGetListResponse,
  SessionGetRequest,
  SessionGetResponse,
  SessionInfo,
  SessionStatus,
  SessionUpdateData,
  SessionUpdateRequest,
  SessionUpdateResponse,
};
