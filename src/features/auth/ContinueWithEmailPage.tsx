import { useContinueWithEmailMutation } from '../../services/auth';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FcExpired, FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';

export const ContinueWithEmailPage = () => {
  const navigate = useNavigate();
  const [continueWithEmail, { isLoading }] = useContinueWithEmailMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const result = await continueWithEmail({ email, password }).unwrap();

      if ('user' in result && 'tokens' in result) {
        navigate('/');
      } else if ('redirectTo' in result) {
        navigate('/' + result.redirectTo);
      }
    } catch (err) {
      console.log('err while continueWithEmail: ', err);

      const error = err as FetchBaseQueryError;

      if (error.status === 500 && error.data && typeof error.data === 'object' && 'error' in error.data) {
        setErrorMessage((error.data as { error: string }).error);
      } else if (error.status === 'FETCH_ERROR') {
        setErrorMessage('Network error. Please check your connection.');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }

      console.error('Login failed:', err);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold text-gray-800'>Welcome to PineSpot</CardTitle>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer'>
              {isLoading ? 'Loading...' : 'Continue'}
            </Button>
          </form>

          {errorMessage && (
            <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-red-600 text-sm'>{errorMessage}</p>
            </div>
          )}

          <div className='flex items-center my-6'>
            <div className='flex-grow'>
              <Separator />
            </div>
            <span className='mx-3 text-gray-500 text-sm whitespace-nowrap'>or continue with</span>
            <div className='flex-grow'>
              <Separator />
            </div>
          </div>

          <div className='flex flex-col space-y-3 mt-4'>
            <Button
              onClick={() => {
                window.location.href = 'http://localhost:8001/api/v1/auth/google';
              }}
              variant='outline'
              className='w-full flex items-center justify-center gap-2 cursor-pointer'>
              <FcGoogle className='w-5 h-5' />
              Continue with Google
            </Button>
            <Button
              onClick={async () => {
                try {
                  const res = await fetch('http://localhost:8001/api/v1/logout', {
                    credentials: 'include',
                  });
                  console.log('Logout response:', res);
                } catch (e) {
                  console.error('Logout failed:', e);
                }
              }}
              variant='outline'
              className='w-full flex items-center justify-center gap-2 cursor-pointer'>
              <FcExpired className='w-5 h-5' />
              Remove cookies
            </Button>
          </div>

          <CardFooter className='flex flex-col mt-6 items-center'>
            <p className='text-xs'>By continuing, you agree our terms and service</p>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};
