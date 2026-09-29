// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice'; // 👇 Import the new API slice

export const store = configureStore({
    reducer: {
        // 👇 Add the generated reducer as a specific top-level slice
        [apiSlice.reducerPath]: apiSlice.reducer,
    },

    // 👇 Attach the API middleware to enable caching, invalidation, and polling
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});