import APIResponse from "./apiResponse";
import { UserRole } from "./users";

interface ChatMessage {
  chatMessageId: number;
  roomId: number;
  senderId: number;
  senderNickname: string;
  senderImageUrl: string;
  content: string;
  sentAt: string;
  senderRole: UserRole;
}

interface ChatRequest {
  content: string;
}

type ChatResponse = ChatMessage;

interface ChatGetPreviousRequest {

}

interface ChatGetPreviousData {
  messages: ChatMessage[];
  hasNext: boolean;
}

interface ChatGetPreviousResponse extends APIResponse<ChatGetPreviousData> {};

export {
  ChatGetPreviousRequest,
  ChatGetPreviousResponse, ChatMessage,
  ChatRequest,
  ChatResponse
};

