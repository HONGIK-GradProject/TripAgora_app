import { sessionsApi } from '@/api/sessions';

/**
 * 새로운 여행 세션을 생성하고 생성된 세션의 ID를 반환합니다.
 * @param templateId - 세션을 생성할 템플릿의 ID
 * @param maxParticipants - 최대 참여자 수
 * @param startDate - 여행 시작 날짜 (yyyy-mm-dd 형식)
 * @returns 성공 시 생성된 세션의 ID, 실패 시 undefined
 */
export const createSession = async (
  templateId: number,
  maxParticipants: number,
  startDate: string
) => {
  try {
    const response = await sessionsApi.createSession(
      templateId,
      maxParticipants,
      startDate
    );

    if (response && response.code === 201) {
      return response.data?.sessionId;
    }

    throw new Error('세션 생성 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 특정 세션의 정보를 수정합니다.
 * @param sessionId - 수정할 세션의 ID
 * @param maxParticipants - 새로운 최대 참여자 수
 * @param startDate - 새로운 여행 시작 날짜 (yyyy-mm-dd 형식)
 * @returns 성공 시 true, 실패 시 undefined
 */
export const updateSession = async (
  sessionId: number,
  maxParticipants: number,
  startDate: string
) => {
  try {
    const response = await sessionsApi.updateSession(
      sessionId,
      maxParticipants,
      startDate
    );

    if (response && response.code === 200) {
      return true;
    }

    throw new Error('세션 수정 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 특정 세션을 삭제합니다.
 * @param sessionId - 삭제할 세션의 ID
 * @returns 성공 시 true, 실패 시 undefined
 */
export const deleteSession = async (sessionId: number) => {
  try {
    const response = await sessionsApi.deleteSession(sessionId);

    if (response && response.code === 200) {
      return true;
    }

    throw new Error('세션 삭제 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 자신이 생성한 세션 목록을 상태별로 조회합니다.
 * @param statuses - 조회할 세션 상태 배열 (선택사항)
 * @param page - 조회할 페이지 번호
 * @returns 성공 시 세션 목록 데이터, 실패 시 undefined
 */
export const getSessionList = async (
  statuses: string[] | undefined,
  page: number
) => {
  try {
    const response = await sessionsApi.getSessionList(statuses as any, page);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('세션 목록 조회 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 전체 세션 목록을 상태별로 조회합니다.
 * @param statuses - 조회할 세션 상태 배열 (선택사항)
 * @param page - 조회할 페이지 번호
 * @returns 성공 시 전체 세션 목록 데이터, 실패 시 undefined
 */
export const getPublicSessionList = async (
  statuses: string[] | undefined,
  page: number
) => {
  try {
    const response = await sessionsApi.getPublicSessionList(
      statuses as any,
      page
    );

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('전체 세션 목록 조회 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 여행자가 참여한 세션 목록을 상태별로 조회합니다.
 * @param statuses - 조회할 세션 상태 배열 (선택사항)
 * @param page - 조회할 페이지 번호
 * @returns 성공 시 참여한 세션 목록 데이터, 실패 시 undefined
 */
export const getParticipatingSessionList = async (
  statuses: string[] | undefined,
  page: number
) => {
  try {
    const response = await sessionsApi.getParticipatingSessionList(
      statuses as any,
      page
    );

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('참여한 세션 목록 조회 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 특정 세션의 상세 정보를 조회합니다.
 * @param sessionId - 조회할 세션의 ID
 * @returns 성공 시 세션 상세 정보, 실패 시 undefined
 */
export const getSession = async (sessionId: number) => {
  try {
    const response = await sessionsApi.getSession(sessionId);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('세션 상세 정보 조회 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 특정 세션의 일정 목록을 조회합니다.
 * @param sessionId - 조회할 세션의 ID
 * @returns 성공 시 세션 일정 목록, 실패 시 undefined
 */
export const getSessionItineraries = async (sessionId: number) => {
  try {
    const response = await sessionsApi.getSessionItineraries(sessionId);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('세션 일정 조회 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 특정 세션의 모집을 마감합니다.
 * @param sessionId - 모집을 마감할 세션의 ID
 * @returns 성공 시 true, 실패 시 undefined
 */
export const closeSession = async (sessionId: number) => {
  try {
    const response = await sessionsApi.closeSession(sessionId);

    if (response && response.code === 200) {
      return true;
    }

    throw new Error(
      `세션 모집 마감 실패: ${response?.message || '알 수 없는 오류'}`
    );
  } catch (error) {
    console.error('세션 모집 마감 에러:', error);
  }
};

/**
 * 세션에 참여 요청을 합니다.
 * @param sessionId - 참여할 세션의 ID
 * @returns 성공 시 참여 정보, 실패 시 undefined
 */
export const createParticipation = async (sessionId: number) => {
  try {
    const response = await sessionsApi.createParticipation(sessionId);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error(
      `세션 참여 실패: ${response?.message || '알 수 없는 오류'}`
    );
  } catch (error) {
    console.error('세션 참여 에러:', error);
    throw error; // 오류를 다시 던져서 상위에서 처리할 수 있도록 함
  }
};

/**
 * 세션 참여를 취소합니다.
 * @param sessionId - 참여 취소할 세션의 ID
 * @returns 성공 시 true, 실패 시 오류 발생
 */
export const cancelParticipation = async (sessionId: number) => {
  try {
    const response = await sessionsApi.cancelParticipation(sessionId);

    if (response && response.code === 200) {
      return true;
    }

    throw new Error(
      `세션 참여 취소 실패: ${response?.message || '알 수 없는 오류'}`
    );
  } catch (error) {
    console.error('세션 참여 취소 에러:', error);
    throw error; // 오류를 다시 던져서 상위에서 처리할 수 있도록 함
  }
};
