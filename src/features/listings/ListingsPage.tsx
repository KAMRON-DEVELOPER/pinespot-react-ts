import { useGetListingsQuery } from '../../services/listing';

function ListingsPage() {
  const { data: listings, isLoading } = useGetListingsQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Listings</h1>
      {listings?.map((listing) => (
        <div key={listing.id}>
          {listing.id} - ${listing.price}
        </div>
      ))}
    </div>
  );
}

export default ListingsPage;
