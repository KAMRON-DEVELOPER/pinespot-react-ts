import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetListingsQuery } from '@/services/listing';
import { isListingResponse } from '@/features/guards';
import FilterSection, { type Filters } from '@/components/filter/FilterSection';
import { ListingCard } from '@/components/listings/ListingCard';
import Hero from './Hero';

export default function ListingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const filters = useMemo<Filters>(() => {
    return {
      q: params.get('q') ?? '',
      sort: params.get('sort') ? (params.get('sort') as Filters['sort']) : 'newest',
      country: params.get('country') ?? '',
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      minRooms: params.get('minRooms') ? Number(params.get('minRooms')) : undefined,
      minBeds: params.get('minBeds') ? Number(params.get('minBeds')) : undefined,
      minBaths: params.get('minBaths') ? Number(params.get('minBaths')) : undefined,
      minArea: params.get('minArea') ? Number(params.get('minArea')) : undefined,
      floor: params.get('floor') ? Number(params.get('floor')) : undefined,
      hasElevator: params.get('hasElevator') ? Boolean(params.get('hasElevator')) : undefined,
      condition: params.get('condition') ? (params.get('condition') as Filters['condition']) : 'any',
      saleType: params.get('saleType') ? (params.get('saleType') as Filters['saleType']) : 'rent',
      hasGarden: params.get('hasGarden') ? Boolean(params.get('hasGarden')) : undefined,
      maxDistanceToKindergarten: params.get('distanceToKindergarten') ? Number(params.get('distanceToKindergarten')) : undefined,
      maxDistanceToSchool: params.get('distanceToSchool') ? Number(params.get('distanceToSchool')) : undefined,
      maxDistanceToHospital: params.get('distanceToHospital') ? Number(params.get('distanceToHospital')) : undefined,
    };
  }, [params]);

  // This query will automatically refetch when the `filters` object changes
  const { data, isLoading, isError } = useGetListingsQuery(filters);

  const handleFilterChange = (v: Filters) => {
    const p = new URLSearchParams(params);
    p.set('minBeds', String(v.minBeds));
    p.set('minBaths', String(v.minBaths));
    if (v.maxPrice !== undefined) p.set('maxPrice', String(v.maxPrice));
    else p.delete('maxPrice');
    p.set('sort', v.sort ?? 'price-asc');
    p.set('condition', v.condition ?? 'any');

    if (v.q) {
      p.set('q', v.q);
    } else {
      p.delete('q');
    }

    // Replace history entry to avoid flooding browser history
    navigate({ pathname: '/', search: p.toString() }, { replace: true });
  };

  const handleReset = () => {
    const p = new URLSearchParams(params);
    p.delete('minBeds');
    p.delete('minBaths');
    p.delete('maxPrice');
    p.delete('sort');
    p.delete('condition');
    p.delete('q');
    navigate({ pathname: '/', search: p.toString() }, { replace: true });
  };

  if (isLoading) {
    return (
      <div className='px-2 md:px-6 py-2 md:pt-6 space-y-6'>
        <Hero />
        <div className='flex items-center justify-center h-64'>
          <p className='text-lg text-muted-foreground'>Loading listings...</p>
        </div>
      </div>
    );
  }

  if (isError || !data || !isListingResponse(data)) {
    return (
      <div className='px-2 md:px-6 py-2 md:pt-6 space-y-6'>
        <Hero />
        <div className='flex items-center justify-center h-64'>
          <p className='text-lg text-destructive'>Failed to load listings. Please try again.</p>
        </div>
      </div>
    );
  }

  const { listings, total } = data;
  const hasActiveFilters =
    filters.minBeds !== undefined ||
    filters.minBaths !== undefined ||
    filters.maxPrice !== undefined ||
    filters.q !== '' ||
    filters.condition !== 'any' ||
    filters.sort !== 'newest';

  return (
    <div className='px-2 md:px-6 py-2 md:pt-6 space-y-6'>
      {/* Hero */}
      <Hero />

      {/* Filters */}
      <FilterSection
        value={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Search hint / Results summary */}
      <div className='flex items-center justify-between border-b pb-3'>
        <div>
          <h2 className='text-xl font-semibold'>
            {listings.length} {listings.length === 1 ? 'apartment' : 'apartments'}
            {filters.q && <span className='text-muted-foreground'> for "{filters.q}"</span>}
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            {hasActiveFilters ? (
              <>
                Showing {listings.length} of {total} total listings (filtered)
              </>
            ) : (
              <>
                Total of {total} {total === 1 ? 'listing' : 'listings'} available
              </>
            )}
          </p>
        </div>
      </div>

      {/* Listing results */}
      {listings.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-64 space-y-4'>
          <p className='text-lg text-muted-foreground'>No apartments found matching your criteria.</p>
          <button
            onClick={handleReset}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition'>
            Clear all filters
          </button>
        </div>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {listings.map((l) => (
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
