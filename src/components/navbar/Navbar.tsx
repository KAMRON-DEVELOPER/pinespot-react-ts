import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import Notification from './Notification';
import { AvatarMenu } from './AvatarMenu';
import CountrySelector from './CountrySelector';
import { Plus } from 'lucide-react';

export default function Navbar() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  return (
    <nav className='relative flex items-center justify-between px-2 md:px-6 py-2 bg-background border-b'>
      <Link
        to='/'
        className='text-xl font-bold text-primary'>
        PineSpot
      </Link>

      <div className='flex items-center gap-3'>
        <CountrySelector />

        {isAuthenticated ? (
          <>
            <Button
              asChild
              size='icon'
              className='rounded-full'
              aria-label='Add Listing'
              title='Add Listing'>
              <Link to='/listings/new'>
                <Plus className='h-5 w-5' />
              </Link>
            </Button>
            <Notification />
            <AvatarMenu user={user} />
          </>
        ) : (
          <Button asChild>
            <Link to='/email'>Get started</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
