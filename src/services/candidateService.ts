import axios from "axios";

const API_BASE_URL = "https://api.trollgold.org/persistventures/assignment";

// Fetch candidate email
export const getCandidateEmail = async (
  candidateId: number,
  org: string
): Promise<{ success: boolean; email: string }> => {
  const response = await axios.get(`${API_BASE_URL}/candidateEmail`, {
    params: { candidate_id: candidateId, org },
  });
  return response.data;
};

// Fetch organization list dynamically
export const getOrganizations = async (): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/organizations`);
  return response.data.organizations; // Assuming API returns an array under 'organizations'
};
