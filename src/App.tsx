import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import ErrorPage from '@/components/ErrorPage';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LoginPage } from '@/features/auth/LoginPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ListingsPage from '@/features/listings/ListingsPage';
import RegisterPage from '@/features/auth/RegisterPage';

function App() {
  const routes: RouteObject[] = [
    {
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [{ path: '/', element: <ListingsPage /> }],
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
  ];

  const router = createBrowserRouter(routes);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
