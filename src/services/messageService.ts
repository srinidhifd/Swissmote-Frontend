import axios from "axios";

const API_BASE_URL = "https://api.trollgold.org";
const authToken = import.meta.env.VITE_AUTH_TOKEN;

const HEADERS = {
  accept: "application/json",
  Authorization: `Bearer ${authToken}`,
  "Content-Type": "application/json",
};

// Fetch Chat Details
export const fetchChat = async (listing: string, candidateId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/get_chat?listing=${listing}&applicant_id=${candidateId}`,
      { headers: HEADERS }
    ); // Log response
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat data:", error);
    throw error; // Ensure the error propagates for handling
  }
};

// Fetch Chat History
export const fetchChatHistory = async (chatId: string, offsetCmi: number) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/get_chat_history`,
      { chat_id: chatId, offset_cmi: offsetCmi },
      { headers: HEADERS }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

// Mark Messages as Seen
export const markMessagesAsSeen = async (listing: string, chatId: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/mark_received_messages_as_seen`,
      {},
      {
        params: { listing, chat_id: chatId },
        headers: HEADERS,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    throw error;
  }
};

// Send Message
export const sendMessage = async (
  listing: string,
  chatId: string,
  message: string,
  attachedFile?: File
) => {
  try {
    const formData = new FormData();
    formData.append("message", message);
    if (attachedFile) formData.append("attached_file", attachedFile);

    const response = await axios.post(
      `${API_BASE_URL}/send_message`,
      formData,
      {
        params: { listing, chat_id: chatId },
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
