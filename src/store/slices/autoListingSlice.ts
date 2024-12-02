import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  automatedListings: [],
};

const autoListingSlice = createSlice({
  name: "autoListings",
  initialState,
  reducers: {
    automateListing(state, action: PayloadAction<any>) {
      state.automatedListings.push(action.payload);
    },
  },
});

export const { automateListing } = autoListingSlice.actions;
export default autoListingSlice.reducer;
