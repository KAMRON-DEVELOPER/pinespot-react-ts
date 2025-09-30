import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import ErrorPage from '@/components/ErrorPage';
import { ContinueWithEmailPage } from '@/features/auth/ContinueWithEmailPage';
import ListingPage from '@/features/listings/ListingPage';
import CompleteProfilePage from '@/features/auth/CompleteProfilePage';

function App() {
  const routes: RouteObject[] = [
    {
      path: '/email',
      element: <ContinueWithEmailPage />,
    },
    {
      path: '/complete-profile',
      element: <CompleteProfilePage />,
    },
    {
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [{ path: '/', element: <ListingPage /> }],
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default App;
