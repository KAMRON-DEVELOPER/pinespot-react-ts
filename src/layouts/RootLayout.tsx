import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function RootLayout() {
  return (
    <>
      <div className='navbar'>
        <Navbar />
      </div>
      <div className='content'>
        <Outlet />
      </div>
      <div className='footer'>
        <Footer />
      </div>
    </>
  );
}

export default RootLayout;
