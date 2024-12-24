// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Using localStorage
import autoListingReducer from "./slices/autoListingSlice";
import themeReducer from "./themeSlice";

// Persist Configuration
const persistConfig = {
  key: "root", // Key for localStorage
  storage,
  whitelist: ["autoListing"], // Only persist the autoListing slice
};

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, autoListingReducer);

export const store = configureStore({
  reducer: {
    theme: themeReducer, // Non-persistent reducer
    autoListing: persistedReducer, // Persistent reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create the persistor
export const persistor = persistStore(store);
