import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import ErrorPage from '@/components/ErrorPage';
import { ContinueWithEmailPage } from '@/features/auth/ContinueWithEmailPage';
import ListingPage from '@/features/listings/ListingPage';
import CompleteProfilePage from '@/features/auth/CompleteProfilePage';
import PersistLogin from '@/layouts/PersistLogin';
import NewListingPage from '@/features/listings/NewListingPage';
import ProfilePage from '@/features/auth/ProfilePage';
// import { APIProvider } from '@vis.gl/react-google-maps';
// import { GOOGLE_MAPS_API_KEY } from '@/consts';
import ChatPage from '@/features/chat/ChatPage';

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
      element: <PersistLogin />,
      children: [
        {
          element: <RootLayout />,
          errorElement: <ErrorPage />,
          children: [
            { path: '/', element: <ListingPage /> },
            { path: '/listings/new', element: <NewListingPage /> },
            { path: '/profile', element: <ProfilePage /> },
            { path: '/chats', element: <ChatPage /> },
          ],
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);

  return (
    // <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
    <RouterProvider router={router} />
    // {/* </APIProvider> */}
  );
}

export default App;
