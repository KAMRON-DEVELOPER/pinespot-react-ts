import { Outlet } from 'react-router-dom';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { useGetProfileQuery } from '@/services/auth';
import { ChatDrawer } from '@/components/chat/ChatDrawer';

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

      {isAuthenticated && <ChatDrawer />}
    </div>
  );
}

export default RootLayout;
