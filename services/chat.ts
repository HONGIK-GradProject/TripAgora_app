import { chatApi } from "@/api/chat";

export const getPreviousChat = async (roomId: number) => {
  try {
    const response = await chatApi.getPreviousChat(roomId);

    if (response && response.code === 200) {
      return response.data;
    }

    throw new Error(
      `채팅 목록 조회 실패: ${response?.message || '알 수 없는 오류'}`
    );
  } catch (error) {
    console.error('채팅 목록 조회 에러:', error);
    throw error;
  }
};