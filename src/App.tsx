import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import ErrorPage from '@/components/ErrorPage';
import { SignInPage } from '@/features/auth/SignInPage';
import ListingPage from '@/features/listings/ListingPage';
import { SignUpPage } from '@/features/auth/SignUpPage';
import { GoogleOAuthProvider, useGoogleOneTapLogin } from '@react-oauth/google';

function GoogleOneTapLogin() {
  useGoogleOneTapLogin({
    auto_select: true,
    onSuccess: (credentialResponse) => {
      console.log('ID token:', credentialResponse.credential);
      // sendIdTokenToBackend(credentialResponse.credential);
    },
    onError: () => console.log('One Tap failed'),
  });

  return null;
}

function App() {
  const routes: RouteObject[] = [
    {
      path: '/signin',
      element: <SignInPage />,
    },
    {
      path: '/signup',
      element: <SignUpPage />,
    },
    {
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [{ path: '/', element: <ListingPage /> }],
    },
  ];

  const router = createBrowserRouter(routes);

  return (
    // <GoogleOAuthProvider clientId='836345097998-mkn65r5bm9a41qvlpi6eus3nhi8olm9v.apps.googleusercontent.com'>
    // {/* <GoogleOneTapLogin /> */}
    <RouterProvider router={router} />
    // {/* </GoogleOAuthProvider> */}
  );
}

export default App;
