import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetListingsQuery } from '@/services/listing';
import { isListingResponse } from '@/features/guards';
import { type ListingParams } from '@/components/filter/AdvancedFilters';
import { ListingCard } from '@/components/listings/ListingCard';
import Hero from './Hero';
import AdvancedFilterSection from '@/components/filter/AdvancedFilters';
import { QueryErrorMessage } from '@/components/QueryErrorMessage';

export default function ListingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const filters = useMemo<ListingParams>(() => {
    return {
      q: params.get('q') ?? '',
      sort: params.get('sort') ? (params.get('sort') as ListingParams['sort']) : 'newest',
      country: params.get('country') ?? 'Uzbekistan',
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      minRooms: params.get('minRooms') ? Number(params.get('minRooms')) : undefined,
      minBeds: params.get('minBeds') ? Number(params.get('minBeds')) : undefined,
      minBaths: params.get('minBaths') ? Number(params.get('minBaths')) : undefined,
      minArea: params.get('minArea') ? Number(params.get('minArea')) : undefined,
      apartmentFloor: params.get('apartmentFloor') ? Number(params.get('apartmentFloor')) : undefined,
      totalBuildingFloors: params.get('totalBuildingFloors') ? Number(params.get('totalBuildingFloors')) : undefined,
      hasElevator: params.get('hasElevator') ? params.get('hasElevator') === 'true' : undefined,
      condition: params.get('condition') ? (params.get('condition') as ListingParams['condition']) : 'any',
      saleType: params.get('saleType') ? (params.get('saleType') as ListingParams['saleType']) : 'rent',
      hasGarden: params.get('hasGarden') ? params.get('hasGarden') === 'true' : undefined,
      hasParking: params.get('hasParking') ? params.get('hasParking') === 'true' : undefined,
      hasBalcony: params.get('hasBalcony') ? params.get('hasBalcony') === 'true' : undefined,
      furnished: params.get('furnished') ? params.get('furnished') === 'true' : undefined,
      petsAllowed: params.get('petsAllowed') ? params.get('petsAllowed') === 'true' : undefined,
      hasAc: params.get('hasAc') ? params.get('hasAc') === 'true' : undefined,
      hasHeating: params.get('hasHeating') ? params.get('hasHeating') === 'true' : undefined,
      maxDistanceToKindergarten: params.get('maxDistanceToKindergarten') ? Number(params.get('maxDistanceToKindergarten')) : undefined,
      maxDistanceToSchool: params.get('maxDistanceToSchool') ? Number(params.get('maxDistanceToSchool')) : undefined,
      maxDistanceToHospital: params.get('maxDistanceToHospital') ? Number(params.get('maxDistanceToHospital')) : undefined,
      maxDistanceToMetro: params.get('maxDistanceToMetro') ? Number(params.get('maxDistanceToMetro')) : undefined,
      maxDistanceToBusStop: params.get('maxDistanceToBusStop') ? Number(params.get('maxDistanceToBusStop')) : undefined,
      maxDistanceToShopping: params.get('maxDistanceToShopping') ? Number(params.get('maxDistanceToShopping')) : undefined,
    };
  }, [params]);

  // Ensure mandatory params are present in URL at all times
  useEffect(() => {
    const p = new URLSearchParams(params);
    let changed = false;
    if (!p.get('country')) {
      p.set('country', filters.country || 'Uzbekistan');
      changed = true;
    }
    if (!p.get('sort')) {
      p.set('sort', filters.sort || 'newest');
      changed = true;
    }
    if (!p.get('saleType')) {
      p.set('saleType', filters.saleType || 'rent');
      changed = true;
    }
    if (changed) {
      navigate({ pathname: '/', search: p.toString() }, { replace: true });
    }
    // we want to run whenever params change
  }, [params, navigate, filters.country, filters.sort, filters.saleType]);

  // This query will automatically refetch when the `filters` object changes
  const { data, isLoading, isError, error } = useGetListingsQuery(filters);

  const handleFilterChange = (v: ListingParams) => {
    const p = new URLSearchParams(params);
    // Scalars
    if (v.minBeds !== undefined) p.set('minBeds', String(v.minBeds));
    else p.delete('minBeds');
    if (v.minBaths !== undefined) p.set('minBaths', String(v.minBaths));
    else p.delete('minBaths');
    if (v.minRooms !== undefined) p.set('minRooms', String(v.minRooms));
    else p.delete('minRooms');
    if (v.minArea !== undefined) p.set('minArea', String(v.minArea));
    else p.delete('minArea');
    if (v.maxPrice !== undefined) p.set('maxPrice', String(v.maxPrice));
    else p.delete('maxPrice');
    if (v.apartmentFloor !== undefined) p.set('apartmentFloor', String(v.apartmentFloor));
    else p.delete('apartmentFloor');
    if (v.totalBuildingFloors !== undefined) p.set('totalBuildingFloors', String(v.totalBuildingFloors));
    else p.delete('totalBuildingFloors');

    // Enums
    p.set('sort', v.sort || 'newest');
    p.set('condition', v.condition || 'any');
    p.set('saleType', v.saleType || 'rent');
    p.set('country', v.country || 'Uzbekistan');

    // Booleans (store as explicit strings for consistency)
    v.hasElevator !== undefined ? p.set('hasElevator', String(v.hasElevator)) : p.delete('hasElevator');
    v.hasGarden !== undefined ? p.set('hasGarden', String(v.hasGarden)) : p.delete('hasGarden');
    v.hasParking !== undefined ? p.set('hasParking', String(v.hasParking)) : p.delete('hasParking');
    v.hasBalcony !== undefined ? p.set('hasBalcony', String(v.hasBalcony)) : p.delete('hasBalcony');
    v.furnished !== undefined ? p.set('furnished', String(v.furnished)) : p.delete('furnished');
    v.petsAllowed !== undefined ? p.set('petsAllowed', String(v.petsAllowed)) : p.delete('petsAllowed');
    v.hasAc !== undefined ? p.set('hasAc', String(v.hasAc)) : p.delete('hasAc');
    v.hasHeating !== undefined ? p.set('hasHeating', String(v.hasHeating)) : p.delete('hasHeating');

    // Distances
    v.maxDistanceToKindergarten !== undefined ? p.set('maxDistanceToKindergarten', String(v.maxDistanceToKindergarten)) : p.delete('maxDistanceToKindergarten');
    v.maxDistanceToSchool !== undefined ? p.set('maxDistanceToSchool', String(v.maxDistanceToSchool)) : p.delete('maxDistanceToSchool');
    v.maxDistanceToHospital !== undefined ? p.set('maxDistanceToHospital', String(v.maxDistanceToHospital)) : p.delete('maxDistanceToHospital');
    v.maxDistanceToMetro !== undefined ? p.set('maxDistanceToMetro', String(v.maxDistanceToMetro)) : p.delete('maxDistanceToMetro');
    v.maxDistanceToBusStop !== undefined ? p.set('maxDistanceToBusStop', String(v.maxDistanceToBusStop)) : p.delete('maxDistanceToBusStop');
    v.maxDistanceToShopping !== undefined ? p.set('maxDistanceToShopping', String(v.maxDistanceToShopping)) : p.delete('maxDistanceToShopping');

    // Query
    if (v.q && v.q.trim()) p.set('q', v.q.trim());
    else p.delete('q');

    // Replace history entry to avoid flooding browser history
    navigate({ pathname: '/', search: p.toString() }, { replace: true });
  };

  const handleReset = () => {
    const p = new URLSearchParams(params);
    // Remove optional filters
    [
      'minBeds',
      'minBaths',
      'minRooms',
      'minArea',
      'maxPrice',
      'apartmentFloor',
      'totalBuildingFloors',
      'hasElevator',
      'hasGarden',
      'hasParking',
      'hasBalcony',
      'furnished',
      'petsAllowed',
      'hasAc',
      'hasHeating',
      'maxDistanceToKindergarten',
      'maxDistanceToSchool',
      'maxDistanceToHospital',
      'maxDistanceToMetro',
      'maxDistanceToBusStop',
      'maxDistanceToShopping',
      'q',
    ].forEach((k) => p.delete(k));
    // Restore required defaults
    p.set('sort', 'newest');
    p.set('condition', 'any');
    p.set('saleType', 'rent');
    if (!p.get('country')) p.set('country', 'Uzbekistan');
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

  if (isError) return <QueryErrorMessage error={error} />;

  if (!data || !isListingResponse(data)) {
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

      {/* Advanced Filters */}
      <AdvancedFilterSection
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
