import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function RootLayout() {
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
    </div>
  );
}

export default RootLayout;
