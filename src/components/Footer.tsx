import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='flex flex-col md:flex-row justify-between items-center px-6 py-4'>
      <Link
        className='link link-hover font-medium'
        to='#'>
        &copy;2025 PineSpot
      </Link>
      <div className='flex flex-col md:flex-row md:space-x-4'>
        <Link
          className='link link-hover'
          to='/'>
          License
        </Link>
        <Link
          className='link link-hover'
          to='/help'>
          Help
        </Link>
        <Link
          className='link link-hover'
          to='/contact'>
          Contact
        </Link>
        <Link
          className='link link-hover'
          to='/policy'>
          Policy
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
