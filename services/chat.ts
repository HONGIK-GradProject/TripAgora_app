import { chatApi } from "@/api/chat";
import { ChatMessage } from "@/types/chat";

export const fetchPreviousChat = async (
  page: number,
  roomId: number
): Promise<{ data: ChatMessage[]; hasNext: boolean } | null> => {
  try {
    const response = await chatApi.getPreviousChat(roomId, page);

    if (response.data && response.code === 200) {
      const utcMessages = response.data.messages.map(message => {
        return {
          ...message,
          sentAt: message.sentAt + 'Z'
        }
      });

      return {
        data: utcMessages,
        hasNext: response.data.hasNext,
      };
    }

    throw new Error(
      `채팅 목록 조회 실패: ${response?.message || '알 수 없는 오류'}`
    );
  } catch (error) {
    console.error('채팅 목록 조회 에러:', error);
    throw error;
  }
};