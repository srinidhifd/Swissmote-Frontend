// src/services/messageService.ts

import axios from "axios";
import { Message } from "../types";

const API_URL = "https://api.trollgold.org/persistventures/assignment";

export const getMessages = async (): Promise<Message[]> => {
  const response = await axios.get(`${API_URL}/getMessage`);
  return response.data;
};
