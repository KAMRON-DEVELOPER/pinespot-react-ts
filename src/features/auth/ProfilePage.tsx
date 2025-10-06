import { useSelector } from 'react-redux';
import { selectUser } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { S3_URL } from '@/consts';

const ProfilePage = () => {
  const user = useSelector(selectUser);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className='max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl'>
      <div className='flex flex-col items-center'>
        <img
          src={user.picture ? `${S3_URL}/${user.picture}` : '/default-avatar.png'}
          alt='profile'
          className='w-24 h-24 rounded-full border-2 border-gray-200'
        />
        <h2 className='mt-4 text-xl font-semibold'>{user.fullName}</h2>
        <p className='text-gray-500'>{user.email}</p>
        {user.phoneNumber && <p className='text-gray-500'>{user.phoneNumber}</p>}
        <Button className='mt-6 bg-indigo-500 hover:bg-indigo-600'>Edit Profile</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
