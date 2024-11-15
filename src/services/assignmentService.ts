// src/services/assignmentService.ts

import axios from "axios";
import { Assignment } from "../types";

const API_URL = "https://api.trollgold.org/persistventures/assignment";

export const getAssignments = async (): Promise<Assignment[]> => {
  const response = await axios.post(`${API_URL}/getAssignments`);
  return response.data;
};
