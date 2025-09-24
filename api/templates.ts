import { TemplateCreateRequest, TemplateCreateResponse, TemplateGetRequest, TemplateGetResponse, TemplateItinerary, TemplateSetContentRequest, TemplateSetContentResponse, TemplateSetImageUrlsRequest, TemplateSetImageUrlsResponse, TemplateSetItinerariesRequest, TemplateSetItinerariesResponse, TemplateSetRegionsRequest, TemplateSetRegionsResponse, TemplateSetTagsRequest, TemplateSetTagsResponse, TemplateSetTitleRequest, TemplateSetTitleResponse, TemplateUpdateRequest, TemplateUpdateResponse } from "@/types/templates";
import apiClient from "./client";

export const getTemplate = async (
  id: number
): Promise<TemplateGetResponse> => {
  const requestData: TemplateGetRequest = {};
  const response = await apiClient.get<TemplateGetResponse>(
    `/templates/${id}`,
    requestData
  );
  return response.data;
};

export const createTemplate = async (): Promise<TemplateCreateResponse> => {
  const requestData: TemplateCreateRequest = {};
  const response = await apiClient.post<TemplateCreateResponse>(
    `/templates`,
    requestData
  );
  return response.data;
};

export const updateTemplate = async (
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

export const setTitle = async (
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

export const setContent = async (
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

export const setImageUrls = async (
  id: number,
  imageUrls: string[],
): Promise<TemplateSetImageUrlsResponse> => {
  const requestData: TemplateSetImageUrlsRequest = { imageUrls };
  const response = await apiClient.patch<TemplateSetImageUrlsResponse>(
    `/templates/${id}/images`,
    requestData
  );
  return response.data;
};

export const setTags = async (
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

export const setRegions = async (
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

export const setItineraries = async (
  id: number,
  itineraries: TemplateItinerary[]
): Promise<TemplateSetItinerariesResponse> => {
  const requestData: TemplateSetItinerariesRequest = { itineraries };
  const response = await apiClient.patch<TemplateSetItinerariesResponse>(
    `/templates/${id}/itineraries`,
    requestData
  );
  return response.data;
};