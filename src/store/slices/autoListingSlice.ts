import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AutomatedJob,
  NotAutomatedJob,
  ClosedAutomatedJob,
} from "../../types/index";

interface AutoListingState {
  empType: string;
  account: string;
  activeTab: "automated" | "not_automated" | "closed_automated"; // Limit to expected tab names
  currentPage: number;
  automatedListings: AutomatedJob[]; // Use AutomatedJob type
  notAutomatedListings: NotAutomatedJob[]; // Use NotAutomatedJob type
  closedAutomatedListings: ClosedAutomatedJob[]; // Use ClosedAutomatedJob type
}

const initialState: AutoListingState = {
  empType: "internship",
  account: "pv",
  activeTab: "automated",
  currentPage: 1,
  automatedListings: [],
  notAutomatedListings: [],
  closedAutomatedListings: [],
};

const autoListingSlice = createSlice({
  name: "autoListings",
  initialState,
  reducers: {
    setEmpType(state, action: PayloadAction<string>) {
      state.empType = action.payload;
    },
    setAccount(state, action: PayloadAction<string>) {
      state.account = action.payload;
    },
    setActiveTab(
      state,
      action: PayloadAction<"automated" | "not_automated" | "closed_automated">
    ) {
      state.activeTab = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setAutomatedListings(state, action: PayloadAction<AutomatedJob[]>) {
      state.automatedListings = action.payload;
    },
    setNotAutomatedListings(state, action: PayloadAction<NotAutomatedJob[]>) {
      state.notAutomatedListings = action.payload;
    },
    setClosedAutomatedListings(
      state,
      action: PayloadAction<ClosedAutomatedJob[]>
    ) {
      state.closedAutomatedListings = action.payload;
    },
  },
});

export const {
  setEmpType,
  setAccount,
  setActiveTab,
  setCurrentPage,
  setAutomatedListings,
  setNotAutomatedListings,
  setClosedAutomatedListings,
} = autoListingSlice.actions;

export default autoListingSlice.reducer;
