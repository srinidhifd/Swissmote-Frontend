// src/services/jobService.ts

import axios from "axios";
import { Job } from "../types";

const API_URL = "https://api.trollgold.org/persistventures/assignment";

export const getJobListings = async (): Promise<Job[]> => {
  const response = await axios.get(`${API_URL}/get_listings`);
  return response.data;
};
