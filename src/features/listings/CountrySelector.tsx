import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useState } from 'react';

const CountrySelector = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('Uzbekistan');

  return (
    <div className='relative'>
      <button
        onClick={() => setOpen(!open)}
        className='flex items-center px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700'>
        <MapPin className='mr-2 h-4 w-4' />
        {selected}
      </button>

      {open && (
        <div className='absolute mt-2 w-64 bg-white text-black rounded-xl shadow-lg p-2'>
          <Input
            type='text'
            placeholder='Search country...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='mb-2'
          />
          {/* map through countries fetched from backend */}
          <div
            onClick={() => {
              setSelected('Uzbekistan');
              setOpen(false);
            }}
            className='px-2 py-1 hover:bg-gray-100 cursor-pointer'>
            Uzbekistan
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
