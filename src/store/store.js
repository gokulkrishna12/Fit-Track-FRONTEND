// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        // We will add the RTK Query API slice here in Phase 6
    },
    // Adding middleware is required for RTK Query caching & polling features later
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(),
});