import APIResponse from './apiResponse';

// 공지 관련 타입
interface NoticeInfo {
  noticeId: number; // 공지 ID
  title: string; // 공지 제목
  createdAt: string; // 생성일시 (LocalDateTime)
}

interface NoticeGetListRequest {
  params: {
    page: number; // 페이지 번호
  };
}

interface NoticeGetListData {
  notices: NoticeInfo[]; // 공지 목록
  totalPages: number; // 전체 페이지 수
  currentPage: number; // 현재 페이지
  totalElements: number; // 전체 공지 수
}

interface NoticeGetListResponse extends APIResponse<NoticeGetListData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

// 공지 상세 조회 관련 타입
interface NoticeGetDetailRequest {
  params: {
    roomId: number; // 세션 ID
    noticeId: number; // 공지 ID
  };
}

interface NoticeGetDetailData {
  noticeId: number; // 공지 ID
  title: string; // 공지 제목
  content: string; // 공지 내용
  createdAt: string; // 생성일시 (LocalDateTime)
}

interface NoticeGetDetailResponse extends APIResponse<NoticeGetDetailData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

// 공지 작성 관련 타입
interface NoticeCreateRequest {
  title: string; // 공지 제목
  content: string; // 공지 내용
}

interface NoticeCreateData {
  noticeId: number; // 공지 ID
  title: string; // 공지 제목
  content: string; // 공지 내용
  createdAt: string; // 생성일시 (LocalDateTime)
}

interface NoticeCreateResponse extends APIResponse<NoticeCreateData> {
  // APIResponse의 모든 속성을 상속받습니다.
}

export {
  NoticeCreateData,
  NoticeCreateRequest,
  NoticeCreateResponse,
  NoticeGetDetailData,
  NoticeGetDetailRequest,
  NoticeGetDetailResponse,
  NoticeGetListData,
  NoticeGetListRequest,
  NoticeGetListResponse,
  NoticeInfo,
};
