// src/services/announcementService.ts

import axios from "axios";
import { Announcement } from "../types";

const API_URL = "https://api.trollgold.org/persistventures/assignment";

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const response = await axios.post(`${API_URL}/announcement`);
  return response.data;
};
