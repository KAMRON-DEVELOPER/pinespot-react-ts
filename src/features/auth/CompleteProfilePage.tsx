const CompleteProfilePage = () => {
  const { data: listings, isLoading } = useGetListingsQuery();

  if (isLoading) return <p>Loading...</p>;

  return <div>CompleteProfilePage</div>;
};

export default CompleteProfilePage;
