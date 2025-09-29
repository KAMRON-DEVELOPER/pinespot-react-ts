import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import ErrorPage from '@/components/ErrorPage';
import { LoginPage } from '@/features/auth/LoginPage';
import ListingPage from '@/features/listings/ListingPage';
import RegisterPage from '@/features/auth/RegisterPage';

function App() {
  const routes: RouteObject[] = [
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
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
