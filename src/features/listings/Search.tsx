import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

const Search = () => {
  const [searchText, setSearchText] = useState('');
  return (
    <div className='relative w-full max-w-sm'>
      <SearchIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        type='search'
        placeholder='Search listings...'
        className='pl-10 rounded-full bg-background border border-input text-foreground'
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default Search;
