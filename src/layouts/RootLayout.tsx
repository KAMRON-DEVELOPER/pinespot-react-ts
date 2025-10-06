import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { useGetProfileQuery } from '@/services/auth';
import { Button } from '@/components/ui/button';

function RootLayout() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='navbar bg-gray-950'>
        <Navbar />
      </div>
      <div className='content min-h-screen'>
        <Outlet />
      </div>
      <div className='footer flex-col bg-gray-950'>
        <Footer />
      </div>
      <div>
        <Button
          className='absolute h-10 w-10 rounded-full right-10 bottom-10'
          // onClick={}
        />
      </div>
    </div>
  );
}

export default RootLayout;
