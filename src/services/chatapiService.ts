import axios from "axios";

export interface ChatResponse {
  session_id: string;
  response: string;
}

export const sendChatMessage = async (
  sessionId: string,
  query: string
): Promise<ChatResponse> => {
  const response = await axios.post<ChatResponse>(
    "http://127.0.0.1:8000/api/chat", // gọi về proxy backend Django
    {
      session_id: sessionId,
      query: query,
    }
  );
  return response.data;
};
