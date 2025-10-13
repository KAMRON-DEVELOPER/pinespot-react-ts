import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import Notification from './Notification';
import { AvatarMenu } from './AvatarMenu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function Navbar() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const currency = params.get('currency') || 'USD';
  const setCurrency = (v: string) => {
    const p = new URLSearchParams(params);
    p.set('currency', v);
    navigate({ pathname: '/', search: p.toString() });
  };

  return (
    <nav className='relative flex items-center justify-between px-2 md:px-6 py-2 bg-background border-b'>
      <Link
        to='/'
        className='text-xl font-bold text-primary'>
        PineSpot
      </Link>

      <div className='flex items-center gap-3'>
        <div className='hidden md:block'>
          <Select
            value={currency}
            onValueChange={setCurrency}>
            <SelectTrigger className='w-[100px]'>
              <SelectValue placeholder='Currency' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='USD'>$ USD</SelectItem>
              <SelectItem value='EUR'>€ EUR</SelectItem>
              <SelectItem value='UZS'>UZS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isAuthenticated ? (
          <>
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
