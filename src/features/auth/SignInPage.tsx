import { useSigninMutation } from '../../services/auth';
import type { AuthResponse } from './types';
import { setUser } from './authSlice';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { getAdditionalUserInfo, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/firebase/setup';

interface SignInPageFormFields extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}
interface SignInPageFormElements extends HTMLFormElement {
  readonly elements: SignInPageFormFields;
}

export const SignInPage = () => {
  const [signin, { isLoading, isError, error }] = useSigninMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<SignInPageFormElements>) => {
    e.preventDefault();

    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;

    try {
      const result: AuthResponse = await signin({ email, password }).unwrap();
      dispatch(setUser(result));
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) return;

      const user = result.user;
      const additionalUserInfo = getAdditionalUserInfo(result);

      console.log('user:', user);
      console.log('additionalUserInfo:', additionalUserInfo);

      const idToken = await user.getIdToken();
      console.log('Firebase ID token:', idToken);
      // fetch("/api/login", { method: "POST", body: JSON.stringify({ idToken }) });
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.error('ErrorCode:', errorCode);
      console.error('ErrorMessage:', errorMessage);
      console.error('Email:', email);
      console.error('Credential:', credential);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold text-gray-800'>Sign in to PineSpot</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                required
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                required
              />
            </div>

            <Button
              type='submit'
              className='w-full bg-indigo-600 hover:bg-indigo-700'>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {isError && (
            <p className='text-red-600 text-sm mt-2'>
              {error && 'status' in error ? (error as FetchBaseQueryError).status : (error as SerializedError).message}
            </p>
          )}

          <div className='flex items-center my-6'>
            <Separator className='flex-grow' />
            <span className='mx-2 text-gray-500 text-sm'>or continue with</span>
            <Separator className='flex-grow' />
          </div>

          <div className='flex space-x-3'>
            <Button
              onClick={googleSignIn}
              variant='outline'
              className='flex items-center justify-center gap-2'>
              <FcGoogle className='w-5 h-5' />
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className='text-center text-sm text-gray-500'>
          Don’t have an account?{' '}
          <Link
            to='/signup'
            className='text-indigo-600 hover:underline'>
            Sign Up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
