import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { S3_URL } from '@/consts';
import MapSearchDialog from '@/features/listings/MapSearchDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/navbar/ThemeToggle';
import CountrySelector from '@/features/listings/CountrySelector';
import Notification from './Notification';

export default function Navbar() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (lat: number, lng: number, radius: number) => {
    console.log('Searching at', lat, lng, 'with radius', radius);
  };

  return (
    <nav className='relative flex items-center justify-between px-4 sm:px-6 py-3 bg-background border-b'>
      {/* Logo */}
      <Link
        to='/'
        className='text-xl font-bold text-primary'>
        PineSpot
      </Link>

      {/* Right side */}
      <div className='hidden md:flex items-center space-x-4'>
        {isAuthenticated ? (
          <>
            <CountrySelector />
            {/* Add listing */}
            <Button
              asChild
              className='bg-primary hover:bg-primary/90'>
              <Link to='/listings/new'>+ Add Listing</Link>
            </Button>

            {/* Notification */}
            <Notification />

            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={user?.picture ? `${S3_URL}/${user.picture}` : '/default-avatar.png'}
                  alt='profile'
                  className='w-8 h-8 rounded-full border border-border cursor-pointer'
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-48'>
                <DropdownMenuItem asChild>
                  <Link to='/profile'>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ThemeToggle />
                  <span className='ml-2'>Theme</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link
            to='/email'
            className='px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-white'>
            Get started
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className='md:hidden'>
        <Button
          size='icon'
          variant='ghost'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </Button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className='absolute top-full left-0 w-full bg-background md:hidden z-20 p-4 border-t border-border'>
          <div className='flex flex-col gap-4'>
            <CountrySelector />
            <MapSearchDialog onSearch={handleSearch} />

            <hr className='border-border my-2' />

            {isAuthenticated ? (
              <>
                <Button
                  asChild
                  className='w-full bg-primary hover:bg-primary/90'>
                  <Link to='/listings/new'>+ Add Listing</Link>
                </Button>

                <div className='flex items-center justify-between'>
                  <Link
                    to='/profile'
                    className='flex items-center gap-2 text-foreground'>
                    <img
                      src={user?.picture ? `${S3_URL}/${user.picture}` : '/default-avatar.png'}
                      alt='profile'
                      className='w-8 h-8 rounded-full border border-border'
                    />
                    <span>Profile</span>
                  </Link>
                  <ThemeToggle />
                </div>
              </>
            ) : (
              <Link
                to='/email'
                className='w-full text-center px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-white'>
                Get started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
