import { SOSResponse } from "@/types/sos";
import apiClient from "./client";

const sendSOS = async (
  roomId: number
): Promise<SOSResponse> => {
  const response = await apiClient.post<SOSResponse>(
    `/rooms/${roomId}/sos`
  );
  return response.data;
};

export const SOSApi = {
  sendSOS
}