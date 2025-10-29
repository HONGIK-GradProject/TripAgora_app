import { noticesApi } from '@/api/notices';

/**
 * 특정 세션의 공지 목록을 조회합니다.
 * @param roomId - 공지를 조회할 세션의 ID
 * @param page - 조회할 페이지 번호
 * @returns 성공 시 공지 목록 데이터, 실패 시 오류 발생
 */
export const getNoticeList = async (roomId: number, page: number) => {
  try {
    const response = await noticesApi.getNoticeList(roomId, page);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error(
      `공지 목록 조회 실패: ${response?.message || '알 수 없는 오류'}`
    );
  } catch (error) {
    console.error('공지 목록 조회 에러:', error);
    throw error; // 오류를 다시 던져서 상위에서 처리할 수 있도록 함
  }
};

/**
 * 특정 공지의 상세 정보를 조회합니다.
 * @param roomId - 공지가 속한 세션의 ID
 * @param noticeId - 조회할 공지의 ID
 * @returns 성공 시 공지 상세 데이터, 실패 시 오류 발생
 */
export const getNoticeDetail = async (roomId: number, noticeId: number) => {
  try {
    const response = await noticesApi.getNoticeDetail(roomId, noticeId);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error(
      `공지 상세 조회 실패: ${response?.message || '알 수 없는 오류'}`
    );
  } catch (error) {
    console.error('공지 상세 조회 에러:', error);
    throw error; // 오류를 다시 던져서 상위에서 처리할 수 있도록 함
  }
};

/**
 * 새로운 공지를 작성합니다.
 * @param roomId - 공지를 작성할 세션의 ID
 * @param title - 공지 제목
 * @param content - 공지 내용
 * @returns 성공 시 공지 작성 데이터, 실패 시 오류 발생
 */
export const createNotice = async (
  roomId: number,
  title: string,
  content: string
) => {
  try {
    const response = await noticesApi.createNotice(roomId, title, content);

    if (response && response.code === 201) {
      return response.data;
    }

    throw new Error(
      `공지 작성 실패: ${response?.message || '알 수 없는 오류'}`
    );
  } catch (error) {
    console.error('공지 작성 에러:', error);
    throw error; // 오류를 다시 던져서 상위에서 처리할 수 있도록 함
  }
};

/**
 * 특정 공지를 수정합니다.
 * @param roomId - 공지가 속한 세션의 ID
 * @param noticeId - 수정할 공지의 ID
 * @param title - 공지 제목
 * @param content - 공지 내용
 * @returns 성공 시 공지 수정 데이터, 실패 시 오류 발생
 */
export const updateNotice = async (
  roomId: number,
  noticeId: number,
  title: string,
  content: string
) => {
  try {
    const response = await noticesApi.updateNotice(
      roomId,
      noticeId,
      title,
      content
    );

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error(
      `공지 수정 실패: ${response?.message || '알 수 없는 오류'}`
    );
  } catch (error) {
    console.error('공지 수정 에러:', error);
    throw error; // 오류를 다시 던져서 상위에서 처리할 수 있도록 함
  }
};

/**
 * 특정 공지를 삭제합니다.
 * @param roomId - 공지가 속한 세션의 ID
 * @param noticeId - 삭제할 공지의 ID
 * @returns 성공 시 void, 실패 시 오류 발생
 */
export const deleteNotice = async (roomId: number, noticeId: number) => {
  try {
    const response = await noticesApi.deleteNotice(roomId, noticeId);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error(
      `공지 삭제 실패: ${response?.message || '알 수 없는 오류'}`
    );
  } catch (error) {
    console.error('공지 삭제 에러:', error);
    throw error; // 오류를 다시 던져서 상위에서 처리할 수 있도록 함
  }
};
