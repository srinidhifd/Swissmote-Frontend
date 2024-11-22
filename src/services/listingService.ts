const BASE_URL = "https://api.trollgold.org/persistventures/assignment";

export const getAutoListings = async (empType: string, account: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/get_listings?emp_type=${empType}&account=${encodeURIComponent(account)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch auto listings.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getAutoListings:", error);
    throw error;
  }
};

export const getActiveListings = async (empType: string, account: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/get_active_listings?emp_type=${empType}&account=${encodeURIComponent(account)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch active listings.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getActiveListings:", error);
    throw error;
  }
};

export const getClosedListings = async (empType: string, account: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/get_closed_listings?emp_type=${empType}&account=${encodeURIComponent(account)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch closed listings.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getClosedListings:", error);
    throw error;
  }
};

export const getListingStatus = async (empType: string, account: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/get_listing_status?emp_type=${empType}&account=${encodeURIComponent(account)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch listing status.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getListingStatus:", error);
    throw error;
  }
};
