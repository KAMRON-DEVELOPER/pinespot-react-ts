import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetListingsQuery } from '@/services/listing';
import { isListingResponse } from '@/features/guards';
import type { Listing } from '../types';
import { FiltersBar, type Filters } from '@/components/filter/FiltersBar';
import { ListingCard } from '@/components/listings/ListingCard';

function useFilters(listings: Listing[]) {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim().toLowerCase();
  const country = params.get('country') || 'all';
  const minBeds = Number(params.get('minBeds') || 0);
  const minBaths = Number(params.get('minBaths') || 0);
  const maxPrice = params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined;
  const sort = (params.get('sort') as Filters['sort']) || 'price-asc';
  const filtered = useMemo(() => {
    const items = listings.filter((l) => {
      const matchCountry = country === 'all' || l.apartment.address.country === country;
      const matchQ =
        !q || [l.apartment.title, l.apartment.address, l.apartment.address.city, l.tags?.join(' ')].filter(Boolean).join(' ').toLowerCase().includes(q);
      const matchBeds = l.apartment.beds >= minBeds;
      const matchBaths = l.apartment.baths >= minBaths;
      const matchPrice = maxPrice ? l.price <= maxPrice : true;
      return matchCountry && matchQ && matchBeds && matchBaths && matchPrice;
    });
    const sorted = [...items].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'area-desc') return b.apartment.area - a.apartment.area;
      return 0;
    });
    return sorted;
  }, [listings, q, country, minBeds, minBaths, maxPrice, sort]);
  return { filtered, q, country, minBeds, minBaths, maxPrice, sort };
}

function ListingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data: listings, isLoading } = useGetListingsQuery();

  const { filtered, q, country, minBeds, minBaths, maxPrice, sort } = useFilters(listings && isListingResponse(listings) ? listings.listings : []);

  useEffect(() => {
    if (listings && 'redirectTo' in listings) {
      navigate('/' + listings.redirectTo);
    }
  }, [listings, navigate]);

  // Early returns AFTER all hooks
  if (isLoading) return <p>Loading...</p>;
  if (!listings || !isListingResponse(listings)) return <p>No listings available</p>;
  if ('error' in listings) return <p>Error: {listings.error as string}</p>;

  const setParam = (key: string, value?: string) => {
    const p = new URLSearchParams(params);
    if (value && value.length) p.set(key, value);
    else p.delete(key);
    navigate({ pathname: '/', search: p.toString() });
  };

  return (
    <div className='px-2 md:px-6 py-2 md:pt-6 space-y-6'>
      {/* Hero */}
      <section className='flex flex-col md:flex-row gap-x-6'>
        <div className='flex flex-col justify-center order-last md:order-first space-y-4'>
          {/* marketing text */}
          <h1 className='text-md md:text-4xl font-extrabold tracking-tight sm:text-5xl'>Beautiful apartments, curated for modern living</h1>
          <p className='text-sm md:text-lg text-muted-foreground'>
            Discover hand-picked rentals across the globe. Compare prices, amenities, and neighborhoods — all in one place.
          </p>

          {/* stats */}
          <div className='flex justify-around'>
            <div className='flex flex-col items-center text-lg md:text-2xl font-bold'>
              <p>Total users</p>
              <p>28,120</p>
            </div>
            <div className='flex flex-col items-center text-lg md:text-2xl font-bold'>
              <p>Total listings</p>
              <p>892</p>
            </div>
          </div>
        </div>
        <img
          src='src/assets/h1.jpg'
          alt='Apartments'
          className='h-full w-full object-cover rounded-2xl'
        />
      </section>

      {/* filter */}
      <FiltersBar
        value={{ minBeds, minBaths, maxPrice, sort }}
        onChange={(v) => {
          setParam('minBeds', String(v.minBeds));
          setParam('minBaths', String(v.minBaths));
          setParam('maxPrice', v.maxPrice !== undefined ? String(v.maxPrice) : undefined);
          setParam('sort', v.sort);
        }}
        onReset={() => {
          const p = new URLSearchParams(params);
          ['minBeds', 'minBaths', 'maxPrice', 'sort'].forEach((k) => p.delete(k));
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

export default ListingPage;
