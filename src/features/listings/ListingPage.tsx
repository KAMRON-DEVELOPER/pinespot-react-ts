import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetListingsQuery } from '../../services/listing';
import { isListingResponse } from '@/features/guards';

function ListingPage() {
  const navigate = useNavigate();
  const { data: listings, isLoading } = useGetListingsQuery();

  useEffect(() => {
    if (listings && 'redirectTo' in listings) {
      navigate('/' + listings.redirectTo);
    }
  }, [listings, navigate]);

  if (listings && 'error' in listings) {
    return <p>Backend error: {listings.error}</p>;
  }

  if (isLoading) return <p>Loading...</p>;

  if (!listings || !isListingResponse(listings)) {
    return <p>No listings available</p>;
  }

  return (
    <div>
      <h1>Listings</h1>
      {listings.listings.map((listing) => (
        <div key={listing.id}>
          {listing.id} - ${listing.price}
        </div>
      ))}
    </div>
  );
}

export default ListingPage;
