import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import ErrorPage from '@/components/ErrorPage';
import { SignInPage } from '@/features/auth/SignInPage';
import ListingPage from '@/features/listings/ListingPage';
import { SignUpPage } from '@/features/auth/SignUpPage';
import CompleteProfilePage from '@/features/auth/CompleteProfilePage';

function App() {
  const routes: RouteObject[] = [
    {
      path: '/signup',
      element: <SignUpPage />,
    },
    {
      path: '/signin',
      element: <SignInPage />,
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
