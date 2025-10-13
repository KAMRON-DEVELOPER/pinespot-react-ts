import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { authApi, useRefreshTokenMutation } from '@/services/auth';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';

const PersistLogin = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [refreshToken] = useRefreshTokenMutation();
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // If we are not authenticated (no in-memory access token),
        // try to refresh using the httpOnly cookie. The authApi.extraReducers will put tokens in state.
        if (!isAuthenticated) {
          await refreshToken()
            .unwrap()
            .catch(() => {
              // refresh failed — leave unauthenticated
            });
        }
        // Whether refresh succeeded or not, try to fetch profile (if available).
        // This is safe: if not authenticated the endpoint should 401 (and will be handled).
        // We call the endpoint directly via dispatch to ensure it runs outside of components that may mount later.
        dispatch(authApi.endpoints.getProfile.initiate(undefined));
      } catch (err) {
        console.error('PersistLogin init error', err);
      } finally {
        if (mounted) setIsChecking(false);
      }
    }

    init();

    return () => {
      mounted = false;
    };
    // we intentionally don't include refreshToken/dispatch in deps to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isChecking) {
    // small improvement: return null to avoid flicker; you can replace with a spinner.
    return null;
  }

  return <Outlet />;
};

export default PersistLogin;
