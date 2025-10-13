import { motion } from 'motion/react';
import { selectStats } from './statsSlice';
import { useSelector } from 'react-redux';

const Hero = () => {
  const { totalUsers, totalListings } = useSelector(selectStats);

  return (
    <section className='flex flex-col md:flex-row gap-6 items-center'>
      <img
        src='src/assets/h1.jpg'
        alt='Apartments'
        className='h-52 md:h-80 w-full md:w-1/2 object-cover rounded-2xl order-first md:order-last'
      />
      <div className='flex flex-col justify-center space-y-4 text-center md:text-left'>
        <h1 className='text-lg md:text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight'>Beautiful apartments, curated for modern living</h1>
        <p className='text-sm md:text-lg text-muted-foreground max-w-lg mx-auto md:mx-0'>
          Discover hand-picked rentals across the globe. Compare prices, amenities, and neighborhoods — all in one place.
        </p>

        {/* Animated stats */}
        <div className='flex justify-center md:justify-start gap-10 pt-2'>
          <div className='flex flex-col items-center md:items-start'>
            <p className='text-xs md:text-sm text-muted-foreground'>Total users</p>
            <motion.p className='text-xl md:text-3xl font-bold'>{totalUsers}</motion.p>
          </div>
          <div className='flex flex-col items-center md:items-start'>
            <p className='text-xs md:text-sm text-muted-foreground'>Total listings</p>
            <motion.p className='text-xl md:text-3xl font-bold'>{totalListings}</motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
