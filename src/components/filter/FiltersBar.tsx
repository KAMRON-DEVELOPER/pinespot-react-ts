import { useEffect, useRef, useState } from 'react';

export type Filters = {
  minBeds: number;
  minBaths: number;
  maxPrice?: number | undefined;
  sort?: string;
  condition?: string;
  q?: string;
};

type Props = {
  value: Filters;
  onChange: (v: Filters) => void;
  onReset?: () => void;
};

export default function FiltersBar({ value, onChange, onReset }: Props) {
  const [localQ, setLocalQ] = useState(value.q ?? '');
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    // keep localQ in sync if parent changes (e.g. when URL changes programmatically)
    setLocalQ(value.q ?? '');
  }, [value.q]);

  // debounce commit function
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      if ((value.q ?? '') !== localQ) {
        onChange({ ...value, q: localQ.trim() ? localQ.trim() : undefined });
      }
    }, 450);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // intentionally listen to localQ only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQ]);

  const handleNumericChange = (k: keyof Filters, raw: string) => {
    const v = raw === '' ? undefined : Number(raw);
    onChange({ ...value, [k]: v });
  };

  return (
    <div className='flex flex-col md:flex-row items-start md:items-center gap-3 mb-4'>
      <div className='flex-1 min-w-0'>
        <input
          aria-label='Search listings'
          placeholder='Search location, title, features...'
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          className='w-full px-3 py-2 border rounded-md'
        />
      </div>

      <div className='flex gap-2'>
        <input
          aria-label='Min beds'
          type='number'
          placeholder='Min beds'
          value={value.minBeds ?? ''}
          onChange={(e) => handleNumericChange('minBeds', e.target.value)}
          className='w-20 px-2 py-2 border rounded-md'
        />
        <input
          aria-label='Min baths'
          type='number'
          placeholder='Min baths'
          value={value.minBaths ?? ''}
          onChange={(e) => handleNumericChange('minBaths', e.target.value)}
          className='w-20 px-2 py-2 border rounded-md'
        />
        <input
          aria-label='Max price'
          type='number'
          placeholder='Max price'
          value={value.maxPrice ?? ''}
          onChange={(e) => handleNumericChange('maxPrice', e.target.value)}
          className='w-28 px-2 py-2 border rounded-md'
        />
        <select
          aria-label='Sort'
          value={value.sort ?? 'price-asc'}
          onChange={(e) => onChange({ ...value, sort: e.target.value })}
          className='px-2 py-2 border rounded-md'>
          <option value='price-asc'>Price ↑</option>
          <option value='price-desc'>Price ↓</option>
          <option value='newest'>Newest</option>
        </select>
        <button
          onClick={() => onReset && onReset()}
          className='px-3 py-2 bg-gray-100 rounded-md'
          aria-label='Reset filters'>
          Reset
        </button>
      </div>
    </div>
  );
}

export function FiltersBar2({ value, onChange, onReset }: Props) {
  const [localQ, setLocalQ] = useState(value.q ?? '');
  const [openMobile, setOpenMobile] = useState(false);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalQ(value.q ?? '');
  }, [value.q]);

  // debounce commit for search
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      if ((value.q ?? '') !== localQ) {
        onChange({ ...value, q: localQ.trim() ? localQ.trim() : undefined });
      }
    }, 450);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQ]);

  const handleNumericChange = (k: keyof Filters, raw: string) => {
    const v = raw === '' ? undefined : Number(raw);
    onChange({ ...value, [k]: v });
  };

  return (
    <>
      {/* top row: search + mobile filter button */}
      <div className='flex items-center gap-3 mb-3'>
        <div className='flex-1'>
          <input
            aria-label='Search listings'
            placeholder='Search location, title, features...'
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary'
          />
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <button
            className='px-3 py-2 border rounded-md'
            onClick={() => setOpenMobile((s) => !s)}
            aria-expanded={openMobile}>
            Filters
          </button>
          <button
            className='px-3 py-2 bg-gray-100 rounded-md hidden md:inline-block'
            onClick={() => onReset && onReset()}>
            Reset
          </button>
        </div>

        {/* desktop reset button */}
        <div className='hidden md:flex gap-2'>
          <button
            onClick={() => onReset && onReset()}
            className='px-3 py-2 bg-gray-100 rounded-md'
            aria-label='Reset filters'>
            Reset
          </button>
        </div>
      </div>

      {/* filters area: desktop inline, mobile collapsible */}
      <div className={`transition-all ${openMobile ? 'max-h-96' : 'max-h-0'} overflow-hidden md:max-h-none`}>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-3'>
          <input
            aria-label='Min beds'
            type='number'
            placeholder='Min beds'
            value={value.minBeds ?? ''}
            onChange={(e) => handleNumericChange('minBeds', e.target.value)}
            className='w-32 px-2 py-2 border rounded-md'
          />
          <input
            aria-label='Min baths'
            type='number'
            placeholder='Min baths'
            value={value.minBaths ?? ''}
            onChange={(e) => handleNumericChange('minBaths', e.target.value)}
            className='w-32 px-2 py-2 border rounded-md'
          />
          <input
            aria-label='Max price'
            type='number'
            placeholder='Max price'
            value={value.maxPrice ?? ''}
            onChange={(e) => handleNumericChange('maxPrice', e.target.value)}
            className='w-36 px-2 py-2 border rounded-md'
          />
          <select
            aria-label='Sort'
            value={value.sort ?? 'price-asc'}
            onChange={(e) => onChange({ ...value, sort: e.target.value })}
            className='px-2 py-2 border rounded-md'>
            <option value='price-asc'>Price ↑</option>
            <option value='price-desc'>Price ↓</option>
            <option value='newest'>Newest</option>
          </select>
          <select
            aria-label='Condition'
            value={value.condition ?? 'any'}
            onChange={(e) => onChange({ ...value, condition: e.target.value })}
            className='px-2 py-2 border rounded-md'>
            <option value='any'>Any condition</option>
            <option value='new'>New</option>
            <option value='repaired'>Repaired</option>
            <option value='old'>Old</option>
          </select>
        </div>
      </div>
    </>
  );
}
