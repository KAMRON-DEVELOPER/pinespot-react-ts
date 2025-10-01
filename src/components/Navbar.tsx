import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';

import { LuSearch } from 'react-icons/lu';
import { useState, type ChangeEvent } from 'react';

function NavbarSearch() {
  const [searchText, setSearchText] = useState<string>('');

  const navbar_search = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    console.log('Input value changed:', e.target.value);
  };

  return (
    <>
      <div className='navbar-search'>
        <LuSearch className='navbar-search-icon' />
        <input
          value={searchText}
          onChange={navbar_search}
          placeholder='search'
          type='text'
          className='navbar-search-input rounded-full'
        />
      </div>
    </>
  );
}

export default function Navbar() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  return (
    <nav className='flex items-center justify-between px-6 py-3 bg-[#0f172a] text-white'>
      <div className='flex items-center space-x-6'>
        <Link
          to='/'
          className='flex items-center text-xl font-bold text-indigo-400'>
          PineSpot
        </Link>

        {/* <div className='flex'>
          <input
            type='text'
            id='simple-search'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Search branch name...'
            required
          />
        </div> */}

        <div className='flex'>
          <NavbarSearch />
        </div>

        {isAuthenticated && (
          <div className='flex space-x-4'>
            <NavLink
              to='/dashboard'
              className={({ isActive }) => `px-3 py-1 rounded-md ${isActive ? 'bg-black text-white' : 'text-gray-300 hover:text-white'}`}>
              Dashboard
            </NavLink>
            <NavLink
              to='/team'
              className={({ isActive }) => `px-3 py-1 rounded-md ${isActive ? 'bg-black text-white' : 'text-gray-300 hover:text-white'}`}>
              Team
            </NavLink>
            <NavLink
              to='/projects'
              className={({ isActive }) => `px-3 py-1 rounded-md ${isActive ? 'bg-black text-white' : 'text-gray-300 hover:text-white'}`}>
              Projects
            </NavLink>
            <NavLink
              to='/calendar'
              className={({ isActive }) => `px-3 py-1 rounded-md ${isActive ? 'bg-black text-white' : 'text-gray-300 hover:text-white'}`}>
              Calendar
            </NavLink>
          </div>
        )}
      </div>

      {/* Right side: Auth controls */}
      <div className='flex items-center space-x-4'>
        {isAuthenticated ? (
          <>
            <Button
              asChild
              className='bg-indigo-500 hover:bg-indigo-600'>
              <Link to='/jobs/new'>+ New Job</Link>
            </Button>
            <button className='text-gray-400 hover:text-white'>
              <span className='sr-only'>Notifications</span>
              🔔
            </button>
            <Link to='/profile'>
              <img
                src={user?.picture || '/default-avatar.png'}
                alt='profile'
                className='w-8 h-8 rounded-full'
              />
            </Link>
          </>
        ) : (
          <>
            <NavLink
              to='/email'
              className='px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white'>
              Get started
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
