import type { ListingResponse } from '@/features/types';
import { api } from './api';

export const listingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<ListingResponse, void>({
      query: () => 'listings',
      providesTags: ['Listing'],
    }),
  }),
});

export const { useGetListingsQuery } = listingApi;
