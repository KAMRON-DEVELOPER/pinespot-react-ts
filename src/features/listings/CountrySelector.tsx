import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { COUNTRIES } from '@/consts';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const CountrySelector = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('Uzbekistan');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => COUNTRIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div
      className='relative'
      ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className='flex items-center px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground border border-border transition'>
        <MapPin className='mr-2 h-4 w-4 text-muted-foreground' />
        {selected}
      </button>

      {open && (
        <div className='absolute z-50 mt-2 w-64 bg-popover text-popover-foreground rounded-xl shadow-md border border-border p-2'>
          <Input
            type='text'
            placeholder='Search country...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='mb-2 focus-visible:ring-1 focus-visible:ring-primary'
          />
          <div className='max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-border'>
            {filteredCountries.map((country) => (
              <div
                key={country.code}
                onClick={() => {
                  setSelected(country.name);
                  setOpen(false);
                  setQuery('');
                }}
                className={`px-2 py-1 flex items-center gap-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                  selected === country.name ? 'bg-accent text-accent-foreground' : ''
                }`}>
                <span className={`fi fi-${country.code.toLowerCase()}`} />
                {country.name}
              </div>
            ))}

            {filteredCountries.length === 0 && <div className='p-2 text-sm text-muted-foreground'>No countries found.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
