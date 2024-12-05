// store.ts
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import autoListingReducer from "./slices/autoListingSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    autoListing: autoListingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
