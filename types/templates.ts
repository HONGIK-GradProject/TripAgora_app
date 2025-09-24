// import APIResponse from "./apiResponse";

import APIResponse from './apiResponse';

interface CreateTemplateRequest {
  accessToken: string;
}

interface CreateTemplateResponse extends APIResponse<CreateTemplateData> {}

interface CreateTemplateData {
  templateId: number;
}

export { CreateTemplateData, CreateTemplateRequest, CreateTemplateResponse };
