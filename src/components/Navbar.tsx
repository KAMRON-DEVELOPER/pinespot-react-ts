// Navbar.tsx
import { NavLink, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

import { userLoggedOut } from '@/features/auth/authSlice';
import { selectCurrentUser } from '@/features/users/usersSlice';
import { FiUser } from 'react-icons/fi';

function Navbar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const isLoggedIn = !!user;

  const onLogoutClicked = () => {
    dispatch(userLoggedOut());
  };

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        <div className='navContent'>
          <div className='navLinks'>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/posts'>Posts</NavLink>
            <NavLink to='/counter'>Counter</NavLink>
            <NavLink to='/dummy'>Dummy</NavLink>
          </div>

          {isLoggedIn && (
            <div className='userDetails'>
              <FiUser size={36} />
              {user.name}
              <button
                className='button small'
                onClick={onLogoutClicked}>
                Log Out
              </button>
            </div>
          )}

          {!isLoggedIn && (
            <div>
              <Link to='/'>Login</Link>
            </div>
          )}
        </div>
      </section>
    </nav>
  );
}

export default Navbar;
