import { SOSApi } from "@/api/sos";
import axios from "axios";

export const sendSOS = async (
  roomId: number
) => {
  try {
    const response = await SOSApi.sendSOS(roomId);
    if (response.code === 200) {
      console.log('SOS 보내기 성공');
      return true;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'SOS 보내기 실패 (Axios Error):',
        error.response?.data?.message || error.message
      );
    } else {
      console.error('SOS 보내기 실패 (Unknown Error):', error);
    }
  }
}