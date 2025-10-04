import { templatesApi } from "@/api/templates";
import { TemplateItineraryWithoutId } from "@/types/templates";
import { isAxiosError } from "axios";

export const createBlankTemplate = async () => {
  try {
    const response = await templatesApi.createTemplate();

    if (response && response.code === 201) {
      return response.data?.templateId;
    }

    throw new Error('템플릿 생성 에러');
  } catch (error) {
    console.error(error);
  }
}

export const setTemplateTitle = async (id: number, title: string) => {
  try {
    const response = await templatesApi.setTitle(id, title);

    if (response && response.code === 200) {
      return response.data?.title;
    }

    throw new Error('템플릿 제목 수정 에러');
  } catch (error) {
    console.error(error);
  }
}

export const setTemplateContent = async (id: number, content: string) => {
  try {
    const response = await templatesApi.setContent(id, content);

    if (response && response.code === 200) {
      return response.data?.content;
    }

    throw new Error('템플릿 본문 수정 에러');
  } catch (error) {
    console.error(error);
  }
}

export const setTemplateImageUrls = async (id: number, imageUrls: string[]) => {
  try {
    const response = await templatesApi.setImageUrls(id, imageUrls);

    if (response && response.code === 200) {
      return response.data?.imageUrls;
    }

    throw new Error('템플릿 이미지 수정 에러');
  } catch (error) {
    console.error(error);
  }
}

export const setTemplateTags = async (id: number, tagIds: number[]) => {
  try {
    const response = await templatesApi.setTags(id, tagIds);

    if (response && response.code === 200) {
      return response.data?.tagIds;
    }

    throw new Error('템플릿 태그 수정 에러');
  } catch (error) {
    console.error(error);
  }
}

export const setTemplateItineraries = async (id: number, itineraries: TemplateItineraryWithoutId[]) => {
  try {
    const response = await templatesApi.setItineraries(id, itineraries);

    if (response && response.code === 200) {
      return true;
    }

    throw new Error('템플릿 일정 수정 에러');
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error.response?.data);
    }
    else {
      console.error(error);
    }
    
  }
}

export const setTemplateRegions = async (id: number, regionIds: number[]) => {
  try {
    const response = await templatesApi.setRegions(id, regionIds);

    if (response && response.code === 200) {
      return response.data?.regionIds;
    }

    throw new Error('템플릿 지역 수정 에러');
  } catch (error) {
    console.error(error);
  }
}

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
}

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
}

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
}

export const getTemplateDetailsAll = async (id: number) => {
  try {
    const details = await getTemplateDetails(id.toString());
    const itineraries = await getItineraries(id);

    if (details && itineraries) {
      return {
        ...details,
        ...itineraries
      };
    }
    
    throw new Error('템플릿의 모든 정보 로드 에러');
  } catch (error) {
    console.error(error);
  }
}

export const deleteTemplate = async (id: number) => {
  try {
    const response = await templatesApi.deleteTemplate(id);
    return response;

  } catch (error) {
    console.error(error);
  }
}