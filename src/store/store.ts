import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Add slices here as we create them
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;