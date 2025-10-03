import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRefreshTokenMutation } from '@/services/auth';
import { selectAccessToken } from '@/features/auth/authSlice';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshToken] = useRefreshTokenMutation();
  const accessToken = useSelector(selectAccessToken);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refreshToken().unwrap();
      } catch (err) {
        console.error('Failed to refresh token on initial load:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    !accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <p>Loading session...</p>;
  }

  return <Outlet />;
};

export default PersistLogin;
