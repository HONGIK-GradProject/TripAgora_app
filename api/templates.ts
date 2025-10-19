import { TemplateCreateRequest, TemplateCreateResponse, TemplateDeleteRequest, TemplateDeleteResponse, TemplateGetItinerariesRequest, TemplateGetItinerariesResponse, TemplateGetListRequest, TemplateGetListResponse, TemplateGetRequest, TemplateGetResponse, TemplateItineraryWithoutId, TemplateSetContentRequest, TemplateSetContentResponse, TemplateSetImagesRequest, TemplateSetImagesResponse, TemplateSetItinerariesRequest, TemplateSetItinerariesResponse, TemplateSetRegionsRequest, TemplateSetRegionsResponse, TemplateSetTagsRequest, TemplateSetTagsResponse, TemplateSetTitleRequest, TemplateSetTitleResponse, TemplateUpdateRequest, TemplateUpdateResponse } from "@/types/templates";
import { createFileFromImageUri } from "@/utils/files";
import apiClient, { apiClientMultipart } from "./client";

/**
 * 특정 여행 템플릿의 상세 정보를 조회합니다.
 * @param id - 조회할 템플릿의 ID
 * @returns 템플릿 상세 정보를 담은 Promise
 */
const getTemplate = async (
  id: string
): Promise<TemplateGetResponse> => {
  const requestData: TemplateGetRequest = {};
  const response = await apiClient.get<TemplateGetResponse>(
    `/templates/${id}`,
    requestData
  );
  return response.data;
};

/**
 * 자신이 작성한 여행 템플릿 목록을 페이지별로 조회합니다.
 * @param page - 조회할 페이지 번호
 * @returns 템플릿 목록 정보를 담은 Promise
 */
const getTemplateList = async (
  page: number
): Promise<TemplateGetListResponse> => {
  const requestData: TemplateGetListRequest = {
    params: {
      page
    }
  };
  const response = await apiClient.get<TemplateGetListResponse>(
    `/templates/my`,
    requestData
  );
  return response.data;
};

/**
 * 특정 여행 템플릿에 속한 모든 상세 일정을 조회합니다.
 * @param id - 일정을 조회할 템플릿의 ID
 * @returns 상세 일정 목록 정보를 담은 Promise
 */
const getItineraries = async (
  id: number
): Promise<TemplateGetItinerariesResponse> => {
  const requestData: TemplateGetItinerariesRequest = {};
  const response = await apiClient.get<TemplateGetItinerariesResponse>(
    `/templates/${id}/itineraries`,
    requestData
  );
  return response.data;
};

/**
 * 비어있는 새로운 여행 템플릿을 생성합니다.
 * @returns 생성된 템플릿의 ID를 포함한 응답 정보를 담은 Promise
 */
const createTemplate = async (): Promise<TemplateCreateResponse> => {
  const requestData: TemplateCreateRequest = {};
  const response = await apiClient.post<TemplateCreateResponse>(
    `/templates`,
    requestData
  );
  return response.data;
};

/**
 * 여행 템플릿의 주요 정보(제목, 내용, 이미지)를 한 번에 수정합니다.
 * @param id - 수정할 템플릿의 ID
 * @param title - 새로운 템플릿 제목
 * @param content - 새로운 템플릿 내용
 * @param imageUrls - 새로운 이미지 URL 목록
 * @returns 수정 결과를 담은 Promise
 */
const updateTemplate = async (
  id: number,
  title: string,
  content: string,
  imageUrls: string[]
): Promise<TemplateUpdateResponse> => {
  const requestData: TemplateUpdateRequest = { title, content, imageUrls };
  const response = await apiClient.put<TemplateUpdateResponse>(
    `/templates/${id}`,
    requestData
  );
  return response.data;
};

/**
 * 여행 템플릿의 제목을 수정합니다.
 * @param id - 수정할 템플릿의 ID
 * @param title - 새로운 템플릿 제목
 * @returns 수정 결과를 담은 Promise
 */
const setTitle = async (
  id: number,
  title: string,
): Promise<TemplateSetTitleResponse> => {
  const requestData: TemplateSetTitleRequest = { title };
  const response = await apiClient.patch<TemplateSetTitleResponse>(
    `/templates/${id}/title`,
    requestData
  );
  return response.data;
};

/**
 * 여행 템플릿의 내용을 수정합니다.
 * @param id - 수정할 템플릿의 ID
 * @param content - 새로운 템플릿 내용
 * @returns 수정 결과를 담은 Promise
 */
const setContent = async (
  id: number,
  content: string,
): Promise<TemplateSetContentResponse> => {
  const requestData: TemplateSetContentRequest = { content };
  const response = await apiClient.patch<TemplateSetContentResponse>(
    `/templates/${id}/content`,
    requestData
  );
  return response.data;
};

/**
 * 여행 템플릿의 이미지 URL 목록을 수정합니다.
 * @param id - 수정할 템플릿의 ID
 * @param imageUrls - 새로운 이미지 URL 목록
 * @returns 수정 결과를 담은 Promise
 */
const setImages = async (
  id: number,
  imageUrls: string[],
): Promise<TemplateSetImagesResponse> => {
  const requestData: TemplateSetImagesRequest = new FormData();
  
  imageUrls.forEach(url => {
    const file = createFileFromImageUri(url);
    requestData.append('images', file);
  });

  const response = await apiClientMultipart.patch<TemplateSetImagesResponse>(
    `/templates/${id}/images`,
    requestData
  );
  return response.data;
};

/**
 * 여행 템플릿의 태그를 수정합니다.
 * @param id - 수정할 템플릿의 ID
 * @param tagIds - 새로운 태그 ID 목록
 * @returns 수정 결과를 담은 Promise
 */
const setTags = async (
  id: number,
  tagIds: number[]
): Promise<TemplateSetTagsResponse> => {
  const requestData: TemplateSetTagsRequest = { tagIds };
  const response = await apiClient.patch<TemplateSetTagsResponse>(
    `/templates/${id}/tags`,
    requestData
  );
  return response.data;
};

/**
 * 여행 템플릿의 지역을 수정합니다.
 * @param id - 수정할 템플릿의 ID
 * @param regionIds - 새로운 지역 ID 목록
 * @returns 수정 결과를 담은 Promise
 */
const setRegions = async (
  id: number,
  regionIds: number[]
): Promise<TemplateSetRegionsResponse> => {
  const requestData: TemplateSetRegionsRequest = { regionIds };
  const response = await apiClient.patch<TemplateSetRegionsResponse>(
    `/templates/${id}/regions`,
    requestData
  );
  return response.data;
};

/**
 * 여행 템플릿의 상세 일정 전체를 덮어쓰기 방식으로 수정합니다.
 * @param id - 수정할 템플릿의 ID
 * @param itineraries - 새로운 상세 일정 목록
 * @returns 수정 결과를 담은 Promise
 */
const setItineraries = async (
  id: number,
  itineraries: TemplateItineraryWithoutId[]
): Promise<TemplateSetItinerariesResponse> => {
  const requestData: TemplateSetItinerariesRequest = { itineraries };
  const response = await apiClient.put<TemplateSetItinerariesResponse>(
    `/templates/${id}/itineraries`,
    requestData
  );
  return response.data;
};

/**
 * 특정 여행 템플릿을 삭제합니다.
 * @param id - 삭제할 템플릿의 ID
 * @returns 삭제 결과를 담은 Promise
 */
const deleteTemplate = async (
  id: number
): Promise<TemplateDeleteResponse> => {
  const requestData: TemplateDeleteRequest = {};
  const response = await apiClient.delete<TemplateDeleteResponse>(
    `/templates/${id}`,
    requestData
  );
  return response.data;
}

/**
 * 여행 템플릿 관련 API 함수들을 모아놓은 객체입니다.
 */
export const templatesApi = {
  getTemplate,
  createTemplate,
  updateTemplate,
  setTitle,
  setContent,
  setImages,
  setTags,
  setRegions,
  setItineraries,
  getItineraries,
  getTemplateList,
  deleteTemplate
};