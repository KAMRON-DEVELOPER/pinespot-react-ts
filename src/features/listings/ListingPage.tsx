import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetListingsQuery } from '@/services/listing';
import { isListingResponse } from '@/features/guards';

function ListingPage() {
  const navigate = useNavigate();
  const { data: listings, isLoading } = useGetListingsQuery();

  useEffect(() => {
    if (listings && 'redirectTo' in listings) {
      navigate('/' + listings.redirectTo);
    }
  }, [listings, navigate]);

  if (isLoading) return <p>Loading...</p>;
  if (!listings || !isListingResponse(listings)) return <p>No listings available</p>;
  if ('error' in listings) return <p>Error: {listings.error as string}</p>;

  return (
    <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-6'>
      {listings.listings.map((listing) => (
        <div
          key={listing.id}
          className='bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='p-4'>
            <h2 className='font-semibold text-lg'>{listing.apartmentId}</h2>
            <p className='text-gray-600'>${listing.price}</p>
            <p className='text-sm text-gray-400'>Created: {new Date(listing.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListingPage;
