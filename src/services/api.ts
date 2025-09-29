import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type { AppState } from '@/store/store';

const API_URL = import.meta.env.VITE_API_URL || 'http:://localhost:8001/api/v1/';

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}`,
  prepareHeaders(headers, { getState }) {
    const token = (getState() as AppState).auth.tokens?.access_token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 6 });

export const api = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Auth', 'Listing'],
  endpoints: () => ({}),
});
