import axios from "axios";

const API_BASE_URL = "https://api.trollgold.org/persistventures/assignment";

// Define common response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Define Listing Type
export interface Listing {
  id: string;
  title: string;
  skills: string[];
  type: "virtual" | "in-person";
  jobPartFull: "part" | "full";
  numPosition: number;
  minExperience?: number;
  minSalary?: number;
  maxSalary?: number;
  duration?: number;
  account: string;
  salary?: number;
}

// GET requests
export const getActiveListings = async (): Promise<Listing[]> => {
  try {
    const response = await axios.get<ApiResponse<Listing[]>>(`${API_BASE_URL}/activeListing`);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching active listings:", err);
    throw new Error("Could not fetch active listings.");
  }
};

export const getClosedListings = async (): Promise<Listing[]> => {
  try {
    const response = await axios.get<ApiResponse<Listing[]>>(`${API_BASE_URL}/closedListings`);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching closed listings:", err);
    throw new Error("Could not fetch closed listings.");
  }
};

// POST requests
export const createJob = async (jobData: Listing): Promise<Listing> => {
  try {
    const response = await axios.post<ApiResponse<Listing>>(`${API_BASE_URL}/make_job`, jobData);
    return response.data.data;
  } catch (err) {
    console.error("Error creating job:", err);
    throw new Error("Could not create job.");
  }
};

export const createInternship = async (internshipData: Listing): Promise<Listing> => {
  try {
    const response = await axios.post<ApiResponse<Listing>>(
      `${API_BASE_URL}/make_internship`,
      internshipData
    );
    return response.data.data;
  } catch (err) {
    console.error("Error creating internship:", err);
    throw new Error("Could not create internship.");
  }
};

export const createUnpaidInternship = async (unpaidInternshipData: Listing): Promise<Listing> => {
  try {
    const response = await axios.post<ApiResponse<Listing>>(
      `${API_BASE_URL}/make_unpaid`,
      unpaidInternshipData
    );
    return response.data.data;
  } catch (err) {
    console.error("Error creating unpaid internship:", err);
    throw new Error("Could not create unpaid internship.");
  }
};

export const getListings = async (empType: string, account: string): Promise<Listing[]> => {
  try {
    const response = await axios.post<ApiResponse<Listing[]>>(
      `${API_BASE_URL}/get_listings?emp_type=${empType}&account=${encodeURIComponent(account)}`
    );
    return response.data.data;
  } catch (err) {
    console.error("Error fetching listings:", err);
    throw new Error("Could not fetch listings.");
  }
};

export const automateListing = async (automationData: Listing): Promise<Listing> => {
  try {
    const response = await axios.post<ApiResponse<Listing>>(
      `${API_BASE_URL}/automate_Listing`,
      automationData
    );
    return response.data.data;
  } catch (err) {
    console.error("Error automating listing:", err);
    throw new Error("Could not automate listing.");
  }
};
