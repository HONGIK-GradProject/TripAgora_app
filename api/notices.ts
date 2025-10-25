import {
  NoticeCreateRequest,
  NoticeCreateResponse,
  NoticeGetDetailRequest,
  NoticeGetDetailResponse,
  NoticeGetListRequest,
  NoticeGetListResponse,
} from '@/types/notices';
import apiClient from './client';

/**
 * 특정 세션의 공지 목록을 조회합니다.
 * @param roomId - 공지를 조회할 세션의 ID
 * @param page - 조회할 페이지 번호
 * @returns 공지 목록 정보를 담은 Promise
 */
const getNoticeList = async (
  roomId: number,
  page: number
): Promise<NoticeGetListResponse> => {
  const requestData: NoticeGetListRequest = {
    params: {
      page,
    },
  };
  const response = await apiClient.get<NoticeGetListResponse>(
    `/rooms/${roomId}/notices`,
    requestData
  );
  return response.data;
};

/**
 * 특정 공지의 상세 정보를 조회합니다.
 * @param roomId - 공지가 속한 세션의 ID
 * @param noticeId - 조회할 공지의 ID
 * @returns 공지 상세 정보를 담은 Promise
 */
const getNoticeDetail = async (
  roomId: number,
  noticeId: number
): Promise<NoticeGetDetailResponse> => {
  const requestData: NoticeGetDetailRequest = {
    params: {
      roomId,
      noticeId,
    },
  };
  const response = await apiClient.get<NoticeGetDetailResponse>(
    `/rooms/${roomId}/notices/${noticeId}`,
    requestData
  );
  return response.data;
};

/**
 * 새로운 공지를 작성합니다.
 * @param roomId - 공지를 작성할 세션의 ID
 * @param title - 공지 제목
 * @param content - 공지 내용
 * @returns 공지 작성 결과를 담은 Promise
 */
const createNotice = async (
  roomId: number,
  title: string,
  content: string
): Promise<NoticeCreateResponse> => {
  const requestData: NoticeCreateRequest = {
    title,
    content,
  };
  const response = await apiClient.post<NoticeCreateResponse>(
    `/rooms/${roomId}/notices`,
    requestData
  );
  return response.data;
};

/**
 * 공지 관련 API 함수들을 모아놓은 객체입니다.
 */
export const noticesApi = {
  getNoticeList,
  getNoticeDetail,
  createNotice,
};
