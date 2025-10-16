import { Car, ChevronDown, ChevronUp, Filter, Home, MapPin, School, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CountrySelector from '@/components/navbar/CountrySelector';

export type ListingParams = {
  q?: string;
  sort: 'cheap' | 'expensive' | 'newest';
  country: string;
  maxPrice?: number;
  minRooms?: number;
  minBeds?: number;
  minBaths?: number;
  minArea?: number;
  apartmentFloor?: number;
  totalBuildingFloors?: number;
  condition: 'old' | 'new' | 'repaired' | 'any';
  saleType: 'rent' | 'buy';
  furnished?: boolean;
  petsAllowed?: boolean;
  hasElevator?: boolean;
  hasGarden?: boolean;
  hasParking?: boolean;
  hasBalcony?: boolean;
  hasAc?: boolean;
  hasHeating?: boolean;
  maxDistanceToKindergarten?: number;
  maxDistanceToSchool?: number;
  maxDistanceToHospital?: number;
  maxDistanceToMetro?: number;
  maxDistanceToBusStop?: number;
  maxDistanceToShopping?: number;
};

type Props = {
  value: ListingParams;
  onChange: (v: ListingParams) => void;
  onReset: () => void;
  country?: string;
};

export default function AdvancedFilterSection({ value, onChange, onReset, country }: Props) {
  const [localQ, setLocalQ] = useState(value.q ?? '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalQ(value.q ?? '');
  }, [value.q]);

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      if ((value.q ?? '') !== localQ) {
        onChange({ ...value, q: localQ.trim() || undefined });
      }
    }, 450);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [localQ, value, onChange]);

  useEffect(() => {
    // Update filters when country changes from navbar
    if (country && country !== value.country) {
      onChange({ ...value, country });
    }
  }, [country, value, onChange]);

  useEffect(() => {
    if (showAdvanced && expandedSections.size === 0) {
      const initial = new Set<string>();
      initial.add('property');
      initial.add('amenities');
      setExpandedSections(initial);
    }
  }, [showAdvanced, expandedSections.size]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleNumericChange = (key: keyof ListingParams, raw: string) => {
    const v = raw === '' ? undefined : Number(raw);
    onChange({ ...value, [key]: v });
  };

  const handleBooleanChange = (key: keyof ListingParams, checked: boolean) => {
    onChange({ ...value, [key]: checked || undefined });
  };

  const activeFilterCount = () => {
    let count = 0;
    if (value.q) count++;
    if (value.maxPrice) count++;
    if (value.minRooms) count++;
    if (value.minBeds) count++;
    if (value.minBaths) count++;
    if (value.minArea) count++;
    if (value.condition !== 'any') count++;
    return count;
  };

  return (
    <div className='space-y-4'>
      {/* Main Filter Bar */}
      <div className='flex flex-wrap gap-3 items-center'>
        <div className='flex-1 min-w-[200px]'>
          <div className='relative'>
            <input
              aria-label='Search listings'
              placeholder='Search location, title, features...'
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              className='w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground'
            />
            {localQ && (
              <button
                onClick={() => setLocalQ('')}
                className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded'
                aria-label='Clear search'>
                <X className='h-4 w-4' />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filters */}
        <select
          value={value.saleType}
          onChange={(e) => onChange({ ...value, saleType: e.target.value as 'rent' | 'buy' })}
          className='px-3 py-2 border rounded-lg bg-background text-foreground'>
          <option value='rent'>Rent</option>
          <option value='buy'>Buy</option>
        </select>

        <div className='flex gap-2'>
          <input
            type='number'
            placeholder='Max price'
            value={value.maxPrice ?? ''}
            onChange={(e) => handleNumericChange('maxPrice', e.target.value)}
            className='w-28 px-3 py-2 border rounded-lg bg-background text-foreground'
          />
        </div>

        <select
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value as ListingParams['sort'] })}
          className='px-3 py-2 border rounded-lg bg-background text-foreground'>
          <option value='newest'>Newest</option>
          <option value='cheap'>Price ↑</option>
          <option value='expensive'>Price ↓</option>
        </select>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition ${showAdvanced ? 'bg-primary/10 border-primary/30' : 'hover:bg-accent'}`}>
          <Filter className='h-4 w-4' />
          Advanced
          {activeFilterCount() > 0 && <span className='bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full'>{activeFilterCount()}</span>}
          {showAdvanced ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
        </button>

        {activeFilterCount() > 0 && (
          <button
            onClick={onReset}
            className='px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg'>
            Reset all
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className='border rounded-lg p-4 bg-card space-y-4'>
          {/* Country Selector moved from navbar */}
          <div className='border-b pb-3'>
            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-2 font-semibold'>
                <MapPin className='h-4 w-4' /> Country
              </span>
            </div>
            <div className='mt-2'>
              <CountrySelector />
            </div>
          </div>
          {/* Property Details Section */}
          <div className='border-b pb-2'>
            <button
              onClick={() => toggleSection('property')}
              className='w-full flex items-center justify-between py-2 hover:bg-accent rounded px-2'>
              <span className='flex items-center gap-2 font-semibold'>
                <Home className='h-4 w-4' />
                Property Details
              </span>
              {expandedSections.has('property') ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </button>

            {expandedSections.has('property') && (
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-3'>
                <div>
                  <label className='text-sm text-muted-foreground'>Min Rooms</label>
                  <input
                    type='number'
                    value={value.minRooms ?? ''}
                    onChange={(e) => handleNumericChange('minRooms', e.target.value)}
                    className='w-full px-2 py-1 border rounded bg-background text-foreground'
                    min='1'
                  />
                </div>
                <div>
                  <label className='text-sm text-muted-foreground'>Min Area (m²)</label>
                  <input
                    type='number'
                    value={value.minArea ?? ''}
                    onChange={(e) => handleNumericChange('minArea', e.target.value)}
                    className='w-full px-2 py-1 border rounded bg-background text-foreground'
                    min='1'
                  />
                </div>
                <div>
                  <label className='text-sm text-muted-foreground'>Floor</label>
                  <input
                    type='number'
                    value={value.apartmentFloor ?? ''}
                    onChange={(e) => handleNumericChange('apartmentFloor', e.target.value)}
                    className='w-full px-2 py-1 border rounded bg-background text-foreground'
                    min='0'
                  />
                </div>
                <div>
                  <label className='text-sm text-muted-foreground'>Building Floors</label>
                  <input
                    type='number'
                    value={value.totalBuildingFloors ?? ''}
                    onChange={(e) => handleNumericChange('totalBuildingFloors', e.target.value)}
                    className='w-full px-2 py-1 border rounded bg-background text-foreground'
                    min='0'
                  />
                </div>
                <div>
                  <label className='text-sm text-muted-foreground'>Condition</label>
                  <select
                    value={value.condition}
                    onChange={(e) => onChange({ ...value, condition: e.target.value as ListingParams['condition'] })}
                    className='w-full px-2 py-1 border rounded bg-background text-foreground'>
                    <option value='any'>Any</option>
                    <option value='new'>New</option>
                    <option value='repaired'>Renovated</option>
                    <option value='old'>Needs Work</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className='border-b pb-2'>
            <button
              onClick={() => toggleSection('amenities')}
              className='w-full flex items-center justify-between py-2 hover:bg-accent rounded px-2'>
              <span className='font-semibold'>Amenities</span>
              {expandedSections.has('amenities') ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </button>

            {expandedSections.has('amenities') && (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mt-3'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={value.hasElevator ?? false}
                    onChange={(e) => handleBooleanChange('hasElevator', e.target.checked)}
                    className='rounded bg-background'
                  />
                  <span className='text-sm'>Elevator</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={value.hasGarden ?? false}
                    onChange={(e) => handleBooleanChange('hasGarden', e.target.checked)}
                    className='rounded bg-background'
                  />
                  <span className='text-sm'>Garden</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={value.hasParking ?? false}
                    onChange={(e) => handleBooleanChange('hasParking', e.target.checked)}
                    className='rounded bg-background'
                  />
                  <span className='text-sm'>Parking</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={value.hasBalcony ?? false}
                    onChange={(e) => handleBooleanChange('hasBalcony', e.target.checked)}
                    className='rounded bg-background'
                  />
                  <span className='text-sm'>Balcony</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={value.furnished ?? false}
                    onChange={(e) => handleBooleanChange('furnished', e.target.checked)}
                    className='rounded bg-background'
                  />
                  <span className='text-sm'>Furnished</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={value.petsAllowed ?? false}
                    onChange={(e) => handleBooleanChange('petsAllowed', e.target.checked)}
                    className='rounded bg-background'
                  />
                  <span className='text-sm'>Pets Allowed</span>
                </label>
              </div>
            )}
          </div>

          {/* Proximity Section */}
          <div>
            <button
              onClick={() => toggleSection('proximity')}
              className='w-full flex items-center justify-between py-2 hover:bg-accent rounded px-2'>
              <span className='flex items-center gap-2 font-semibold'>
                <MapPin className='h-4 w-4' />
                Nearby Facilities (max distance in km)
              </span>
              {expandedSections.has('proximity') ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </button>

            {expandedSections.has('proximity') && (
              <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mt-3'>
                <div>
                  <label className='text-sm text-muted-foreground flex items-center gap-1'>
                    <School className='h-3 w-3' />
                    Kindergarten
                  </label>
                  <input
                    type='number'
                    value={value.maxDistanceToKindergarten ?? ''}
                    onChange={(e) => handleNumericChange('maxDistanceToKindergarten', e.target.value)}
                    className='w-full px-2 py-1 border rounded bg-background text-foreground'
                    placeholder='0.5'
                    step='any'
                    min='0'
                  />
                </div>
                <div>
                  <label className='text-sm text-muted-foreground flex items-center gap-1'>
                    <School className='h-3 w-3' />
                    School
                  </label>
                  <input
                    type='number'
                    value={value.maxDistanceToSchool ?? ''}
                    onChange={(e) => handleNumericChange('maxDistanceToSchool', e.target.value)}
                    className='w-full px-2 py-1 border rounded bg-background text-foreground'
                    placeholder='1'
                    step='any'
                    min='0'
                  />
                </div>
                <div>
                  <label className='text-sm text-muted-foreground'>Hospital</label>
                  <input
                    type='number'
                    value={value.maxDistanceToHospital ?? ''}
                    onChange={(e) => handleNumericChange('maxDistanceToHospital', e.target.value)}
                    className='w-full px-2 py-1 border rounded bg-background text-foreground'
                    placeholder='2'
                    step='any'
                    min='0'
                  />
                </div>
                <div>
                  <label className='text-sm text-muted-foreground flex items-center gap-1'>
                    <Car className='h-3 w-3' />
                    Metro
                  </label>
                  <input
                    type='number'
                    value={value.maxDistanceToMetro ?? ''}
                    onChange={(e) => handleNumericChange('maxDistanceToMetro', e.target.value)}
                    className='w-full px-2 py-1 border rounded bg-background text-foreground'
                    placeholder='0.5'
                    step='any'
                    min='0'
                  />
                </div>
                <div>
                  <label className='text-sm text-muted-foreground'>Bus Stop</label>
                  <input
                    type='number'
                    value={value.maxDistanceToBusStop ?? ''}
                    onChange={(e) => handleNumericChange('maxDistanceToBusStop', e.target.value)}
                    className='w-full px-2 py-1 border rounded bg-background text-foreground'
                    placeholder='0.2'
                    step='any'
                    min='0'
                  />
                </div>
                <div>
                  <label className='text-sm text-muted-foreground'>Shopping</label>
                  <input
                    type='number'
                    value={value.maxDistanceToShopping ?? ''}
                    onChange={(e) => handleNumericChange('maxDistanceToShopping', e.target.value)}
                    className='w-full px-2 py-1 border rounded bg-background text-foreground'
                    placeholder='1'
                    step='any'
                    min='0'
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
