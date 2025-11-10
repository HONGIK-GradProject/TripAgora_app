import { templatesApi } from '@/api/templates';
import { TemplateItineraryWithoutId } from '@/types/templates';
import { isAxiosError } from 'axios';

const TEMPLATE_CONFLICT_409_MESSAGE =
  '현재 여행이 진행 중인 여행 계획은 수정할 수 없습니다!';

const handleTemplateServiceError = (error: unknown, defaultMessage: string) => {
  console.error(error);

  if (isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 409) {
      throw new Error(TEMPLATE_CONFLICT_409_MESSAGE);
    }

    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      throw new Error(apiMessage);
    }
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(defaultMessage);
};

/**
 * 새로운 빈 여행 템플릿을 생성하고 생성된 템플릿의 ID를 반환합니다.
 * @returns 성공 시 생성된 템플릿의 ID, 실패 시 undefined
 */
export const createBlankTemplate = async () => {
  try {
    const response = await templatesApi.createTemplate();

    if (response && response.code === 201) {
      return response.data?.templateId;
    }

    throw new Error('템플릿 생성 에러');
  } catch (error) {
    handleTemplateServiceError(error, '템플릿 생성 에러');
  }
};

/**
 * 특정 템플릿의 제목을 설정합니다.
 * @param id - 제목을 설정할 템플릿의 ID
 * @param title - 새로운 제목
 * @returns 성공 시 업데이트된 제목, 실패 시 undefined
 */
export const setTemplateTitle = async (id: number, title: string) => {
  try {
    const response = await templatesApi.setTitle(id, title);

    if (response && response.code === 200) {
      return response.data?.title;
    }

    throw new Error('템플릿 제목 수정 에러');
  } catch (error) {
    handleTemplateServiceError(error, '템플릿 제목 수정 에러');
  }
};

/**
 * 특정 템플릿의 내용을 설정합니다.
 * @param id - 내용을 설정할 템플릿의 ID
 * @param content - 새로운 내용
 * @returns 성공 시 업데이트된 내용, 실패 시 undefined
 */
export const setTemplateContent = async (id: number, content: string) => {
  try {
    const response = await templatesApi.setContent(id, content);

    if (response && response.code === 200) {
      return response.data?.content;
    }

    throw new Error('템플릿 본문 수정 에러');
  } catch (error) {
    handleTemplateServiceError(error, '템플릿 본문 수정 에러');
  }
};

/**
 * 특정 템플릿의 이미지 URL 목록을 설정합니다.
 * @param id - 이미지를 설정할 템플릿의 ID
 * @param imageUrls - 새로운 이미지 URL 배열
 * @returns 성공 시 업데이트된 이미지 URL 배열, 실패 시 undefined
 */
export const setTemplateImageUrls = async (id: number, imageUrls: string[]) => {
  if (imageUrls.length < 1) {
    return;
  }

  try {
    const response = await templatesApi.setImages(id, imageUrls);

    if (response && response.code === 200) {
      return response.data?.imageUrls;
    }

    throw new Error('템플릿 이미지 수정 에러');
  } catch (error) {
    handleTemplateServiceError(error, '템플릿 이미지 수정 에러');
  }
};

/**
 * 특정 템플릿의 태그를 설정합니다.
 * @param id - 태그를 설정할 템플릿의 ID
 * @param tagIds - 새로운 태그 ID 배열
 * @returns 성공 시 업데이트된 태그 ID 배열, 실패 시 undefined
 */
export const setTemplateTags = async (id: number, tagIds: number[]) => {
  try {
    const response = await templatesApi.setTags(id, tagIds);

    if (response && response.code === 200) {
      return response.data?.tagIds;
    }

    throw new Error('템플릿 태그 수정 에러');
  } catch (error) {
    handleTemplateServiceError(error, '템플릿 태그 수정 에러');
  }
};

/**
 * 특정 템플릿의 상세 일정 목록 전체를 설정(덮어쓰기)합니다.
 * @param id - 일정을 설정할 템플릿의 ID
 * @param itineraries - 새로운 상세 일정 배열. ID가 없는 항목은 신규로 생성됩니다.
 * @returns 성공 시 { success: true }, 실패 시 { success: false, error: string }
 */
export const setTemplateItineraries = async (
  id: number,
  itineraries: TemplateItineraryWithoutId[]
) => {
  try {
    const response = await templatesApi.setItineraries(id, itineraries);

    if (response && response.code === 200) {
      return { success: true };
    }

    throw new Error('템플릿 일정 수정 에러');
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data);
      if (error.response?.status === 409) {
        return { success: false, error: TEMPLATE_CONFLICT_409_MESSAGE };
      }
      const errorMessage =
        error.response?.data?.message || '일정 저장 중 오류가 발생했습니다.';
      return { success: false, error: errorMessage };
    } else {
      console.error(error);
      return { success: false, error: '일정 저장 중 오류가 발생했습니다.' };
    }
  }
};

/**
 * 특정 템플릿의 지역을 설정합니다.
 * @param id - 지역을 설정할 템플릿의 ID
 * @param regionIds - 새로운 지역 ID 배열
 * @returns 성공 시 업데이트된 지역 ID 배열, 실패 시 undefined
 */
export const setTemplateRegions = async (id: number, regionIds: number[]) => {
  try {
    const response = await templatesApi.setRegions(id, regionIds);

    if (response && response.code === 200) {
      return response.data?.regionIds;
    }

    throw new Error('템플릿 지역 수정 에러');
  } catch (error) {
    handleTemplateServiceError(error, '템플릿 지역 수정 에러');
  }
};

/**
 * 자신이 작성한 템플릿 목록을 페이지 단위로 가져옵니다.
 * @param page - 가져올 페이지 번호
 * @returns 성공 시 템플릿 목록 데이터, 실패 시 undefined
 */
export const getTemplateList = async (page: number) => {
  try {
    const response = await templatesApi.getTemplateList(page);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('템플릿 리스트 로드 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 특정 템플릿에 속한 상세 일정 목록을 가져옵니다.
 * @param id - 일정을 가져올 템플릿의 ID
 * @returns 성공 시 상세 일정 데이터, 실패 시 undefined
 */
export const getItineraries = async (id: number) => {
  try {
    const response = await templatesApi.getItineraries(id);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('템플릿 일정 로드 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 특정 템플릿의 기본 상세 정보(일정 제외)를 가져옵니다.
 * @param id - 상세 정보를 가져올 템플릿의 ID
 * @returns 성공 시 템플릿 상세 정보, 실패 시 undefined
 */
export const getTemplateDetails = async (id: string) => {
  try {
    const response = await templatesApi.getTemplate(id);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error('템플릿 상세 정보 로드 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 특정 템플릿의 모든 정보(기본 정보 및 상세 일정)를 한 번에 가져옵니다.
 * @param id - 정보를 가져올 템플릿의 ID
 * @returns 성공 시 통합된 템플릿 전체 정보, 실패 시 undefined
 */
export const getTemplateDetailsAll = async (id: number) => {
  try {
    const details = await getTemplateDetails(id.toString());
    const itineraries = await getItineraries(id);

    if (details && itineraries) {
      return {
        ...details,
        ...itineraries,
      };
    }

    throw new Error('템플릿의 모든 정보 로드 에러');
  } catch (error) {
    console.error(error);
  }
};

/**
 * 특정 템플릿을 삭제합니다.
 * @param id - 삭제할 템플릿의 ID
 * @returns 성공 시 API 응답, 실패 시 undefined
 */
export const deleteTemplate = async (id: number) => {
  try {
    const response = await templatesApi.deleteTemplate(id);
    return response;
  } catch (error) {
    handleTemplateServiceError(error, '템플릿 삭제 에러');
  }
};
