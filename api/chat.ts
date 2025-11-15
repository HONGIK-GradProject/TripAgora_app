import { ChatGetPreviousResponse } from "@/types/chat";
import apiClient from "./client";

const getPreviousChat = async (
  roomId: number
): Promise<ChatGetPreviousResponse> => {
  const response = await apiClient.get<ChatGetPreviousResponse>(
    `chat/room/${roomId}/messages`,
    {
      params: {
        page: 0
      }
    }
  );
  return response.data;
};

/**
 * 공지 관련 API 함수들을 모아놓은 객체입니다.
 */
export const chatApi = {
  getPreviousChat
};
