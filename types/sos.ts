import APIResponse from "./apiResponse";

interface SOSRequest {}
interface SOSData {}
interface SOSResponse extends APIResponse<SOSData> {};

export {
  SOSRequest,
  SOSResponse
};

