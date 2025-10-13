import type { GetListingsResponse } from '@/features/types';
import { api } from './api';

export const listingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<GetListingsResponse, Record<string, any> | void>({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            if (v === undefined || v === null || v === '') return;
            qs.set(k, String(v));
          });
        }
        const queryString = qs.toString();
        return `listings${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Listing'],
    }),
  }),
});

export const { useGetListingsQuery } = listingApi;
