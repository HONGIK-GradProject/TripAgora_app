import APIResponse from "./apiResponse";

interface Itinerary {
  day: number;
  title: string;
  content: string;
  startTime: string;
  latitude: number;
  longitude: number;
}

interface GetTemplateRequest {}
interface GetTemplateData {
  title: string;
  content: string;
  regionNames: string[];
  tagNames: string[];
  imageUrls: string[];
}
interface GetTemplateResponse extends APIResponse<GetTemplateData> {}

interface CreateTemplateRequest {}
interface CreateTemplateData {
  templateId: number;
}
interface CreateTemplateResponse extends APIResponse<CreateTemplateData> {}

interface SetTemplateRequest {
  title: string;
  content: string;
  imageUrls: string[];
}
interface SetTemplateData {}
interface SetTemplateResponse extends APIResponse<SetTemplateData> {}

interface SetTitleRequest {
  title: string;
}
interface SetTitleData {
  title: string;
}
interface SetTitleResponse extends APIResponse<SetTitleData> {}

interface SetContentRequest {
  content: string;
}
interface SetContentData {
  content: string;
}
interface SetContentResponse extends APIResponse<SetContentData> {}

interface SetImageUrlsRequest {
  imageUrls: string[];
}
interface SetImageUrlsData {
  imageUrls: string[];
}
interface SetImageUrlsResponse extends APIResponse<SetImageUrlsData> {}

interface TemplateSetTagsResponse {
  tagIds: number[];
}
interface TemplateSetTagsData {
  tagNames: string[];
}
interface TemplateSetTagsRequest extends APIResponse<TemplateSetTagsData> {}

interface SetRegionsRequest {
  regionIds: number[];
}
interface SetRegionsData {
  regionNames: string[];
}
interface SetRegionsResponse extends APIResponse<SetRegionsData> {}

interface SetItinerariesRequest {
  itineraries: Itinerary[];
}
interface SetItinerariesData {}
interface SetItinerariesResponse extends APIResponse<SetItinerariesData> {}

export {
  CreateTemplateRequest,
  CreateTemplateResponse, GetTemplateRequest,
  GetTemplateResponse, Itinerary, SetContentRequest,
  SetContentResponse,
  SetImageUrlsRequest,
  SetImageUrlsResponse, SetItinerariesRequest,
  SetItinerariesResponse, SetRegionsRequest,
  SetRegionsResponse, SetTemplateRequest,
  SetTemplateResponse,
  SetTitleRequest,
  SetTitleResponse, TemplateSetTagsRequest,
  TemplateSetTagsResponse
};
