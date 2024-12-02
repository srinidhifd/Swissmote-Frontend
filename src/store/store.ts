import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import autoListingReducer from "./slices/autoListingSlice"; // Import the new slice

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    autoListings: autoListingReducer, // Add autoListingSlice to the store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
