import { templatesApi } from "@/api/templates";
import { TemplateItinerary } from "@/types/templates";

export const createTemplate = async () => {
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

export const setTemplateTitle = async ({ id, title } : { id: number, title: string }) => {
  try {
    const response = await templatesApi.setTitle(id, title);

    if (response && response.code === 201) {
      return response.data?.title;
    }

    throw new Error('템플릿 제목 수정 에러');
  } catch (error) {
    console.error(error);
  }
}

export const setTemplateContent = async ({ id, content } : { id: number, content: string }) => {
  try {
    const response = await templatesApi.setContent(id, content);

    if (response && response.code === 201) {
      return response.data?.content;
    }

    throw new Error('템플릿 본문 수정 에러');
  } catch (error) {
    console.error(error);
  }
}

export const setTemplateImageUrls = async ({ id, imageUrls } : { id: number, imageUrls: string[] }) => {
  try {
    const response = await templatesApi.setImageUrls(id, imageUrls);

    if (response && response.code === 201) {
      return response.data?.imageUrls;
    }

    throw new Error('템플릿 이미지 수정 에러');
  } catch (error) {
    console.error(error);
  }
}

export const setTemplateTags = async ({ id, tagIds } : { id: number, tagIds: number[] }) => {
  try {
    const response = await templatesApi.setTags(id, tagIds);

    if (response && response.code === 201) {
      return response.data?.tagNames;
    }

    throw new Error('템플릿 태그 수정 에러');
  } catch (error) {
    console.error(error);
  }
}

export const setTemplateItineraries = async ({ id, itineraries } : { id: number, itineraries: TemplateItinerary[] }) => {
  try {
    const response = await templatesApi.setItineraries(id, itineraries);

    if (response && response.code === 201) {
      return true;
    }

    throw new Error('템플릿 일정 수정 에러');
  } catch (error) {
    console.error(error);
  }
}

export const setTemplateRegions = async ({ id, regionIds } : { id: number, regionIds: number[] }) => {
  try {
    const response = await templatesApi.setRegions(id, regionIds);

    if (response && response.code === 201) {
      return response.data?.regionNames;
    }

    throw new Error('템플릿 지역 수정 에러');
  } catch (error) {
    console.error(error);
  }
}