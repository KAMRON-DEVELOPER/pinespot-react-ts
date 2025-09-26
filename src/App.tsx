import { createBrowserRouter, Navigate, type RouteObject, RouterProvider } from 'react-router-dom';

import { PostsList } from '@/features/posts/PostsList';
import RootLayout from '@/layouts/RootLayout';
import Counter from '@/features/counter/Counter';
import ErrorPage from '@/components/ErrorPage';
import AddPostForm from '@/features/posts/AddPostForm';
import { SinglePostPage } from '@/features/posts/SinglePostPage';

import { selectCurrentUsername } from '@/features/auth/authSlice';
import { useAppSelector } from '@/app/hooks';
import { LoginPage } from '@/features/auth/LoginPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const username = useAppSelector(selectCurrentUsername);

  if (!username) {
    return (
      <Navigate
        to='/'
        replace
      />
    );
  }

  return children;
};

function App() {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      element: (
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/posts',
          element: (
            <>
              <AddPostForm />
              <PostsList />
            </>
          ),
          children: [
            {
              path: '/posts/:postId',
              element: <SinglePostPage />,
            },
          ],
        },
        {
          path: '/counter',
          element: <Counter />,
        },
        {
          path: '/dummy',
          element: <h1>Dummy</h1>,
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default App;
