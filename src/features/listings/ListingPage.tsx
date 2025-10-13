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

function useFilters(listings: Listing[]) {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim().toLowerCase();
  const country = params.get('country') || 'all';
  const minBeds = Number(params.get('minBeds') || 0);
  const minBaths = Number(params.get('minBaths') || 0);
  const maxPrice = params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined;
  const sort = (params.get('sort') as Filters['sort']) || 'price-asc';
  const condition = (params.get('condition') as Filters['condition']) || 'any';

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const matchCountry = country === 'all' || l.apartment.address.country === country;
      const matchQ = !q || l.apartment.title.toLowerCase().includes(q);
      const matchBeds = l.apartment.beds >= minBeds;
      const matchBaths = l.apartment.baths >= minBaths;
      const matchPrice = maxPrice ? l.price <= maxPrice : true;
      const matchCondition = condition === 'any' || l.apartment.condition === condition;
      return matchCountry && matchQ && matchBeds && matchBaths && matchPrice && matchCondition;
    });
  }, [listings, q, country, minBeds, minBaths, maxPrice, condition]);
  return { filtered, q, country, minBeds, minBaths, maxPrice, sort, condition };
}

export default function ListingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data: listings, isLoading } = useGetListingsQuery();
  const dispatch = useDispatch();
  const stats = useSelector(selectStats);

  const { filtered, q, country, minBeds, minBaths, maxPrice, sort, condition } = useFilters(listings && isListingResponse(listings) ? listings.listings : []);

  // Update stats after response
  useEffect(() => {
    if (listings && isListingResponse(listings)) {
      dispatch(setStats({ users: 28120, listings: listings.listings.length }));
    }
  }, [listings, dispatch]);

  const [usersDisplay, setUsersDisplay] = useState(stats.users);
  const [listingsDisplay, setListingsDisplay] = useState(stats.listings);
  useEffect(() => {
    animate(usersDisplay, stats.users, {
      duration: 1.2,
      onUpdate: (v) => setUsersDisplay(Math.round(v)),
    });
    animate(listingsDisplay, stats.listings, {
      duration: 1.2,
      onUpdate: (v) => setListingsDisplay(Math.round(v)),
    });
  }, [stats]);

  const setParam = (key: string, value?: string) => {
    const p = new URLSearchParams(params);
    if (value && value.length) p.set(key, value);
    else p.delete(key);
    navigate({ pathname: '/', search: p.toString() });
  };

  if (isLoading) return <p>Loading...</p>;
  if (!listings || !isListingResponse(listings)) return <p>No listings available</p>;

  return (
    <div className='px-2 md:px-6 py-2 md:pt-6 space-y-6'>
      {/* Hero */}
      <section className='flex flex-col md:flex-row gap-6 items-center'>
        <img
          src='src/assets/h1.jpg'
          alt='Apartments'
          className='h-52 md:h-80 w-full md:w-1/2 object-cover rounded-2xl order-first md:order-last'
        />
        <div className='flex flex-col justify-center space-y-4 text-center md:text-left'>
          <h1 className='text-lg md:text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight'>Beautiful apartments, curated for modern living</h1>
          <p className='text-sm md:text-lg text-muted-foreground max-w-lg mx-auto md:mx-0'>
            Discover hand-picked rentals across the globe. Compare prices, amenities, and neighborhoods — all in one place.
          </p>

          {/* Animated stats */}
          <div className='flex justify-center md:justify-start gap-10 pt-2'>
            <div className='flex flex-col items-center md:items-start'>
              <p className='text-xs md:text-sm text-muted-foreground'>Total users</p>
              <motion.p className='text-xl md:text-3xl font-bold'>{usersDisplay}</motion.p>
            </div>
            <div className='flex flex-col items-center md:items-start'>
              <p className='text-xs md:text-sm text-muted-foreground'>Total listings</p>
              <motion.p className='text-xl md:text-3xl font-bold'>{listingsDisplay}</motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <FiltersBar
        value={{ minBeds, minBaths, maxPrice, sort, condition }}
        onChange={(v) => {
          setParam('minBeds', String(v.minBeds));
          setParam('minBaths', String(v.minBaths));
          setParam('maxPrice', v.maxPrice !== undefined ? String(v.maxPrice) : undefined);
          setParam('sort', v.sort);
          setParam('condition', v.condition);
        }}
        onReset={() => {
          const p = new URLSearchParams(params);
          ['minBeds', 'minBaths', 'maxPrice', 'sort', 'condition'].forEach((k) => p.delete(k));
          navigate({ pathname: '/', search: p.toString() });
        }}
      />

      {/* Results */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>
            {filtered.length} apartments {q && <span className='text-muted-foreground'>for "{q}"</span>}
          </h2>
          {country && country !== 'all' && <p className='text-sm text-muted-foreground'>Country: {country}</p>}
        </div>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {filtered.map((l) => (
          <ListingCard
            key={l.id}
            listing={l}
          />
        ))}
      </div>
    </div>
  );
}
