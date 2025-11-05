import APIResponse from "./apiResponse";
import { SessionInfo } from "./sessions";

interface WishlistGetRequest {}

interface WishlistGetData {
  sessions: SessionInfo[];
  hasNext: boolean;
}

interface WishlistGetResponse extends APIResponse<WishlistGetData> {}

interface WishlistAddRequest {}

interface WishlistAddData {}

interface WishlistAddResponse extends APIResponse<WishlistAddData> {}

interface WishlistDeleteRequest {}

interface WishlistDeleteData {}

interface WishlistDeleteResponse extends APIResponse<WishlistDeleteData> {}

export {
  WishlistAddData,
  WishlistAddRequest,
  WishlistAddResponse,
  WishlistDeleteData,
  WishlistDeleteRequest,
  WishlistDeleteResponse, WishlistGetData, WishlistGetRequest,
  WishlistGetResponse
};
