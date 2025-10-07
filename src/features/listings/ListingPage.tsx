import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetListingsQuery } from '@/services/listing';
import { isListingResponse } from '@/features/guards';
import MapSearchDialog from './MapSearchDialog';
import Search from './Search';
import { Card } from '@/components/ui/card';
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

  // Call useFilters with empty array when loading to maintain hook order
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
    <div className=''>
      {/* Hero */}
      <section className='relative overflow-hidden'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-50%,hsl(var(--primary)/0.25),transparent_60%)]' />
        <div className='container grid gap-8 py-14 md:grid-cols-2 md:gap-12 md:py-20'>
          <div className='space-y-6'>
            <div className='inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur'>
              <div className='h-2 w-2 rounded-full bg-primary' /> Find your next home
            </div>
            <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl'>Beautiful apartments, curated for modern living</h1>
            <p className='text-lg text-muted-foreground'>
              Discover hand-picked rentals across the globe. Compare prices, amenities, and neighborhoods — all in one place.
            </p>
            <div className='grid grid-cols-3 gap-3'>
              {(() => {
                const total = 192;
                const avg = 400;
                const cities = 18;
                return (
                  <>
                    <Card className='p-4'>
                      <div className='text-xs text-muted-foreground'>Listings</div>
                      <div className='text-2xl font-bold'>{total}</div>
                    </Card>
                    <Card className='p-4'>
                      <div className='text-xs text-muted-foreground'>Avg price</div>
                      <div className='text-2xl font-bold'>${avg.toLocaleString()}</div>
                    </Card>
                    <Card className='p-4'>
                      <div className='text-xs text-muted-foreground'>Cities</div>
                      <div className='text-2xl font-bold'>{cities}</div>
                    </Card>
                  </>
                );
              })()}
            </div>
          </div>
          <div className='relative order-first aspect-[4/3] overflow-hidden rounded-xl bg-muted md:order-none'>
            <img
              src='/placeholder.svg'
              alt='Apartments'
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-background/60 to-transparent' />
          </div>
        </div>
      </section>

      {/* <Search /> */}
      {/* <MapSearchDialog onSearch={handleSearch} /> */}
      {listings.listings.map((listing) => (
        <div
          key={listing.id}
          className='bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='p-4'>
            <h2 className='font-semibold text-lg'>{listing.apartment.id}</h2>
            <p className='text-gray-600'>${listing.price}</p>
            <p className='text-sm text-gray-400'>Created: {new Date(listing.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}

      {/* Results */}
      <section className='container pb-16'>
        <div className='mb-4'>
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
        </div>
        <div className='mb-6 flex items-center justify-between'>
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
      </section>
    </div>
  );
}

export default ListingPage;
