// src/store/slices/dashboardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Listing {
  listing_number: string;
  [key: string]: any;
}

interface FollowupStats {
  day2: {
    sent: number;
    pending: number;
  };
  day4: {
    sent: number;
    pending: number;
  };
  reviews: {
    added: number;
    pending: number;
  };
}

interface DashboardState {
  automatedListings: Listing[];
  notAutomatedListings: Listing[];
  expiredListings: Listing[];
  activeListings: Listing[];
  closedListings: Listing[];
  followupStats: FollowupStats;
  isFetched: boolean; // Determines if data is already fetched
}

const initialState: DashboardState = {
  automatedListings: [],
  notAutomatedListings: [],
  expiredListings: [],
  activeListings: [],
  closedListings: [],
  followupStats: {
    day2: { sent: 0, pending: 0 },
    day4: { sent: 0, pending: 0 },
    reviews: { added: 0, pending: 0 },
  },
  isFetched: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData(state, action: PayloadAction<Partial<DashboardState>>) {
      return { ...state, ...action.payload };
    },
    resetDashboardData() {
      return initialState;
    },
  },
});

export const { setDashboardData, resetDashboardData } = dashboardSlice.actions;

export default dashboardSlice.reducer;
