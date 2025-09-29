import type { Listing } from '../features/listings/types';
import { api } from './api';

export const listingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<Listing[], void>({
      query: () => 'listings',
      providesTags: ['Listings'],
    }),
  }),
});

export const { useGetListingsQuery } = listingApi;
