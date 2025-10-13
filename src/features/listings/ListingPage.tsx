import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetListingsQuery } from '@/services/listing';
import { isListingResponse } from '@/features/guards';
import { FiltersBar, type Filters } from '@/components/filter/FiltersBar';
import { ListingCard } from '@/components/listings/ListingCard';
import { motion, animate } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { selectStats, setStats } from './statsSlice';
import type { Listing } from '../types';
import Hero from './Hero';

export default function ListingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const dispatch = useDispatch();

  // parse params to filters with stable defaults
  const filters = useMemo<Filters>(() => {
    return {
      minBeds: Number(params.get('minBeds') ?? 0),
      minBaths: Number(params.get('minBaths') ?? 0),
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      sort: (params.get('sort') as Filters['sort']) ?? 'price-asc',
      condition: (params.get('condition') as Filters['condition']) ?? 'any',
      // optional: include search query param
      // q: params.get('q') ?? '',
    };
  }, [params]);

  // query will automatically refetch when `filters` object changes (different keys/values)
  const { data, isLoading, isError } = useGetListingsQuery(filters);

  const handleFilterChange = (v: Filters) => {
    const p = new URLSearchParams(params);
    p.set('minBeds', String(v.minBeds));
    p.set('minBaths', String(v.minBaths));
    if (v.maxPrice !== undefined) p.set('maxPrice', String(v.maxPrice));
    else p.delete('maxPrice');
    p.set('sort', v.sort ?? 'price-asc');
    p.set('condition', v.condition ?? 'any');
    // replace to avoid history flood and keep the UI stable
    navigate({ pathname: '/', search: p.toString() }, { replace: true });
  };

  const handleReset = () => {
    const p = new URLSearchParams(params);
    p.delete('minBeds');
    p.delete('minBaths');
    p.delete('maxPrice');
    p.delete('sort');
    p.delete('condition');
    navigate({ pathname: '/', search: p.toString() }, { replace: true });
  };

  if (isLoading) return <p>Loading...</p>;
  if (!data || !isListingResponse(data)) return <p>No listings available</p>;

  return (
    <div className='px-2 md:px-6 py-2 md:pt-6 space-y-6'>
      {/* Hero */}
      <Hero />

      {/* Filters */}
      <FiltersBar
        value={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Search results | hint */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>
            {filtered.length} apartments {q && <span className='text-muted-foreground'>for "{q}"</span>}
          </h2>
          {country && country !== 'all' && <p className='text-sm text-muted-foreground'>Country: {country}</p>}
          <p>found {data.total} listing</p>
        </div>
      </div>

      {/* Listing results */}
      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {data.listings.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
            />
          ))}
        </div>
      )}
    </div>
  );
}
