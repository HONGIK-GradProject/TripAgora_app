/**
 * @file 템플릿 관련 API 함수를 제공합니다. (템플릿 생성, 템플릿 조회, 템플릿 수정, 템플릿 삭제)
 * @module api/templates
 */

import {
  CreateTemplateRequest,
  CreateTemplateResponse,
} from '../types/templates';
import apiClient from './client';

export const createTemplate = async (
  request: CreateTemplateRequest
): Promise<CreateTemplateResponse> => {
  const response = await apiClient.post<CreateTemplateResponse>(
    '/templates',
    request
  );
  return response.data;
};
