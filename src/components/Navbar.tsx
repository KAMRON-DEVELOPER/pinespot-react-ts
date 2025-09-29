import { selectUser } from '@/features/auth/authSlice';
import { useAppSelector } from '@/hooks/hooks';
import { Link } from 'react-router-dom';

function Navbar() {
  const user = useAppSelector(selectUser);

  return (
    <nav>
      {user ? (
        <div>
          Welcome {user.first_name}!<button>Logout</button>
        </div>
      ) : (
        <div>
          <Link to='/login'>Login</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
