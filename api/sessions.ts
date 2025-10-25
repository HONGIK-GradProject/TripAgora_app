import {
  SessionCloseRequest,
  SessionCloseResponse,
  SessionCreateRequest,
  SessionCreateResponse,
  SessionDeleteRequest,
  SessionDeleteResponse,
  SessionGetItinerariesRequest,
  SessionGetItinerariesResponse,
  SessionGetListRequest,
  SessionGetListResponse,
  SessionGetRequest,
  SessionGetResponse,
  SessionParticipationRequest,
  SessionParticipationResponse,
  SessionStatus,
  SessionUpdateRequest,
  SessionUpdateResponse,
} from '@/types/sessions';
import apiClient from './client';

/**
 * 새로운 여행 세션을 생성합니다.
 * @param templateId - 세션을 생성할 템플릿의 ID
 * @param maxParticipants - 최대 참여자 수
 * @param startDate - 여행 시작 날짜 (yyyy-mm-dd 형식)
 * @returns 생성된 세션의 ID를 포함한 응답 정보를 담은 Promise
 */
const createSession = async (
  templateId: number,
  maxParticipants: number,
  startDate: string
): Promise<SessionCreateResponse> => {
  const requestData: SessionCreateRequest = {
    templateId,
    maxParticipants,
    startDate,
  };
  const response = await apiClient.post<SessionCreateResponse>(
    '/sessions',
    requestData
  );
  return response.data;
};

/**
 * 특정 세션의 정보를 수정합니다.
 * @param sessionId - 수정할 세션의 ID
 * @param maxParticipants - 새로운 최대 참여자 수
 * @param startDate - 새로운 여행 시작 날짜 (yyyy-mm-dd 형식)
 * @returns 수정 결과를 담은 Promise
 */
const updateSession = async (
  sessionId: number,
  maxParticipants: number,
  startDate: string
): Promise<SessionUpdateResponse> => {
  const requestData: SessionUpdateRequest = {
    maxParticipants,
    startDate,
  };
  const response = await apiClient.patch<SessionUpdateResponse>(
    `/sessions/${sessionId}`,
    requestData
  );
  return response.data;
};

/**
 * 특정 세션을 삭제합니다.
 * @param sessionId - 삭제할 세션의 ID
 * @returns 삭제 결과를 담은 Promise
 */
const deleteSession = async (
  sessionId: number
): Promise<SessionDeleteResponse> => {
  const requestData: SessionDeleteRequest = {};
  const response = await apiClient.delete<SessionDeleteResponse>(
    `/sessions/${sessionId}`,
    { data: requestData }
  );
  return response.data;
};

/**
 * 자신이 생성한 세션 목록을 상태별로 조회합니다.
 * @param statuses - 조회할 세션 상태 배열 (선택사항)
 * @param page - 조회할 페이지 번호
 * @returns 세션 목록 정보를 담은 Promise
 */
const getSessionList = async (
  statuses: SessionStatus[] | undefined,
  page: number
): Promise<SessionGetListResponse> => {
  const requestData: SessionGetListRequest = {
    params: {
      statuses,
      page,
    },
  };
  const response = await apiClient.get<SessionGetListResponse>(
    '/sessions/my',
    requestData
  );
  return response.data;
};

/**
 * 전체 세션 목록을 상태별로 조회합니다.
 * @param statuses - 조회할 세션 상태 배열 (선택사항)
 * @param page - 조회할 페이지 번호
 * @returns 전체 세션 목록 정보를 담은 Promise
 */
const getPublicSessionList = async (
  statuses: SessionStatus[] | undefined,
  page: number
): Promise<SessionGetListResponse> => {
  const requestData: SessionGetListRequest = {
    params: {
      statuses,
      page,
    },
  };
  const response = await apiClient.get<SessionGetListResponse>(
    '/sessions',
    requestData
  );
  return response.data;
};

/**
 * 특정 세션의 상세 정보를 조회합니다.
 * @param sessionId - 조회할 세션의 ID
 * @returns 세션 상세 정보를 담은 Promise
 */
const getSession = async (sessionId: number): Promise<SessionGetResponse> => {
  const requestData: SessionGetRequest = {};
  const response = await apiClient.get<SessionGetResponse>(
    `/sessions/${sessionId}`,
    requestData
  );
  return response.data;
};

/**
 * 특정 세션의 일정 목록을 조회합니다.
 * @param sessionId - 조회할 세션의 ID
 * @returns 세션 일정 목록을 담은 Promise
 */
const getSessionItineraries = async (
  sessionId: number
): Promise<SessionGetItinerariesResponse> => {
  const requestData: SessionGetItinerariesRequest = {};
  const response = await apiClient.get<SessionGetItinerariesResponse>(
    `/sessions/${sessionId}/itineraries`,
    requestData
  );
  return response.data;
};

/**
 * 특정 세션의 모집을 마감합니다.
 * @param sessionId - 모집을 마감할 세션의 ID
 * @returns 모집 마감 결과를 담은 Promise
 */
const closeSession = async (
  sessionId: number
): Promise<SessionCloseResponse> => {
  const requestData: SessionCloseRequest = {} as SessionCloseRequest;
  const response = await apiClient.post<SessionCloseResponse>(
    `/sessions/${sessionId}/close`,
    requestData
  );
  return response.data;
};

/**
 * 세션에 참여 요청을 합니다.
 * @param sessionId - 참여할 세션의 ID
 * @returns 세션 참여 결과를 담은 Promise
 */
const createParticipation = async (
  sessionId: number
): Promise<SessionParticipationResponse> => {
  const requestData: SessionParticipationRequest =
    {} as SessionParticipationRequest;
  const response = await apiClient.post<SessionParticipationResponse>(
    `/participation/sessions/${sessionId}`,
    requestData
  );
  return response.data;
};

/**
 * 세션 관련 API 함수들을 모아놓은 객체입니다.
 */
export const sessionsApi = {
  createSession,
  updateSession,
  deleteSession,
  getSessionList,
  getPublicSessionList,
  getSession,
  getSessionItineraries,
  closeSession,
  createParticipation,
};
