// src/store/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    // The unique key for this slice in the Redux store
    reducerPath: 'api',

    baseQuery: fetchBaseQuery({
        // 🚀 Using your live Render URL to ensure it connects correctly
        baseUrl: 'https://fit-track-backend-02ef.onrender.com/api',
        prepareHeaders: (headers) => {
            // Replicating your Axios logic: Grab token and attach to every request
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    // These tags help us selectively clear the cache later (e.g., when a new workout is added)
    tagTypes: ['Analytics', 'Workouts'],

    // Define our API endpoints here
    endpoints: (builder) => ({
        getAnalytics: builder.query({
            query: () => '/workouts/analytics',
            providesTags: ['Analytics'],
        }),
    }),
});

// RTK Query automatically generates this custom React Hook for us!
export const { useGetAnalyticsQuery } = apiSlice;