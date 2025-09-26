import background1 from '../assets/2.png';
import background2 from '../assets/1.png';
import { useRouteError, NavLink } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();

  if (typeof error === 'object' && error !== null && 'status' in error && (error as any).status === 404) {
    return (
      <div className='flex min-h-screen relative'>
        <div className='min-h-screen w-full bg-cyan-800'>
          <div
            className='w-100 h-100 bg-no-repeat bg-center'
            style={{ backgroundImage: `url(${background1})`, backgroundSize: '450px' }}>
            <NavLink
              className='absolute bottom-[10%] left-[45%] bg-green-400 text-black text-2xl font-bold px-2 rounded-lg shadow'
              to={''}>
              Home
            </NavLink>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='flex min-h-screen'>
        <div className='min-h-screen w-full bg-cyan-800'>
          <div
            className='w-100 h-100 bg-no-repeat bg-center'
            style={{ backgroundImage: `url(${background2})`, backgroundSize: '450px' }}></div>
        </div>
      </div>
    );
  }
}

export default ErrorPage;
