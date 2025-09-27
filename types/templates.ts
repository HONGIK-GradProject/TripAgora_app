import APIResponse from "./apiResponse";

/**
 * 템플릿의 여행 일정 정보를 나타냅니다.
 */
interface TemplateItinerary {
  day: number;
  title: string;
  content: string;
  startTime: string;
  latitude: number;
  longitude: number;
}

interface TemplateInfo {
  templateId: number;
  title: string;
  firstImageUrl: string;
  regionNames: string[];
}

interface TemplateDetails {
  title: string;
  content: string;
  regionNames: string[];
  tagNames: string[];
  imageUrls: string[];
}

interface TemplateGetRequest {}
type TemplateGetData = TemplateDetails;
interface TemplateGetResponse extends APIResponse<TemplateGetData> {}

interface TemplateGetListRequest {
  params: {
    page: number;
  }
}
interface TemplateGetListData {
  templates: TemplateInfo[];
  hasNext: boolean;
}
interface TemplateGetListResponse extends APIResponse<TemplateGetListData> {}

interface TemplateGetItinerariesRequest {};
type TemplateGetItinerariesData = TemplateItinerary;
interface TemplateGetItinerariesResponse extends APIResponse<TemplateGetItinerariesData> {}

interface TemplateCreateRequest {}
interface TemplateCreateData {
  templateId: number;
}
interface TemplateCreateResponse extends APIResponse<TemplateCreateData> {}

/**
 * 템플릿의 여러 정보를 한 번에 수정합니다.
 */
interface TemplateUpdateRequest {
  title: string;
  content: string;
  imageUrls: string[];
}
interface TemplateUpdateData {}
interface TemplateUpdateResponse extends APIResponse<TemplateUpdateData> {}

interface TemplateSetTitleRequest {
  title: string;
}
interface TemplateSetTitleData {
  title: string;
}
interface TemplateSetTitleResponse extends APIResponse<TemplateSetTitleData> {}

interface TemplateSetContentRequest {
  content: string;
}
interface TemplateSetContentData {
  content: string;
}
interface TemplateSetContentResponse extends APIResponse<TemplateSetContentData> {}

interface TemplateSetImageUrlsRequest {
  imageUrls: string[];
}
interface TemplateSetImageUrlsData {
  imageUrls: string[];
}
interface TemplateSetImageUrlsResponse extends APIResponse<TemplateSetImageUrlsData> {}

/**
 * 템플릿의 태그를 설정합니다.
 */
interface TemplateSetTagsRequest {
  tagIds: number[];
}
interface TemplateSetTagsData {
  tagNames: string[];
}
interface TemplateSetTagsResponse extends APIResponse<TemplateSetTagsData> {}

interface TemplateSetRegionsRequest {
  regionIds: number[];
}
interface TemplateSetRegionsData {
  regionNames: string[];
}
interface TemplateSetRegionsResponse extends APIResponse<TemplateSetRegionsData> {}

interface TemplateSetItinerariesRequest {
  itineraries: TemplateItinerary[];
}
interface TemplateSetItinerariesData {}
interface TemplateSetItinerariesResponse extends APIResponse<TemplateSetItinerariesData> {}

export {
  TemplateCreateData,
  TemplateCreateRequest,
  TemplateCreateResponse, TemplateDetails, TemplateGetData, TemplateGetItinerariesData,
  TemplateGetItinerariesRequest,
  TemplateGetItinerariesResponse,
  TemplateGetListData,
  TemplateGetListRequest,
  TemplateGetListResponse, TemplateGetRequest,
  TemplateGetResponse, TemplateInfo, TemplateItinerary, TemplateSetContentData,
  TemplateSetContentRequest,
  TemplateSetContentResponse,
  TemplateSetImageUrlsData,
  TemplateSetImageUrlsRequest,
  TemplateSetImageUrlsResponse,
  TemplateSetItinerariesData,
  TemplateSetItinerariesRequest,
  TemplateSetItinerariesResponse,
  TemplateSetRegionsData,
  TemplateSetRegionsRequest,
  TemplateSetRegionsResponse,
  TemplateSetTagsData,
  TemplateSetTagsRequest,
  TemplateSetTagsResponse,
  TemplateSetTitleData,
  TemplateSetTitleRequest,
  TemplateSetTitleResponse,
  TemplateUpdateData,
  TemplateUpdateRequest,
  TemplateUpdateResponse
};

