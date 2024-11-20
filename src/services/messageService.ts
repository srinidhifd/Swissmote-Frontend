import axios from "axios";

const API_BASE_URL = "https://api.trollgold.org/persistventures/assignment";

export const getMessage = async (messageType: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getMessage`, {
      params: {
        message: messageType,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching message:", error);
    throw new Error("Failed to fetch message.");
  }
};
