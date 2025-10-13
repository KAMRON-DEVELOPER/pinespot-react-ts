import { useEffect, useRef, useState } from 'react';

export type Filters = {
  minBeds?: number;
  minBaths?: number;
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
