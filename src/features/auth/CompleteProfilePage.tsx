import { useGetOAuthUserQuery } from '@/services/auth';

const CompleteProfilePage = () => {
  const { data: oauthUser, isLoading, isError } = useGetOAuthUserQuery();

  console.log(`oauthUser: ${oauthUser}`);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  return <div>CompleteProfilePage</div>;
};

export default CompleteProfilePage;
