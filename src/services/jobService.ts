import axios from "axios";

const API_BASE_URL = "https://api.trollgold.org/persistventures/assignment";

export const getActiveListings = async () => {
  const response = await axios.get(`${API_BASE_URL}/activeListing`);
  return response.data;
};

export const getClosedListings = async () => {
  const response = await axios.get(`${API_BASE_URL}/closedListings`);
  return response.data;
};
