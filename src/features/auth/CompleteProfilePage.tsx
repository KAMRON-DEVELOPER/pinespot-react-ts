import { useCompleteProfileMutation, useGetOAuthUserQuery } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, type FormEvent } from 'react';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { isErrorResponse } from '../guards';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, isSuccess } = useGetOAuthUserQuery();
  const [complete, { isLoading: isLoadingRequest }] = useCompleteProfileMutation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [picture, setPicture] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSuccess && data && 'fullName' in data) {
      setFullName(data.fullName || '');
      setEmail(data.email || '');
      setPassword(data.email || '');
      setPhoneNumber(data.phoneNumber || '');
      setPicture(data.picture || '');
    }
  }, [data, isSuccess]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('phone_number', phoneNumber);
    formData.append('password', password);

    if ((form.elements.namedItem('picture') as HTMLInputElement)?.files?.[0]) {
      formData.append('picture', (form.elements.namedItem('picture') as HTMLInputElement).files![0]);
    }

    try {
      const result = await complete(formData).unwrap();
      if ('user' in result && 'tokens' in result) {
        navigate('/');
      } else if ('error' in result) {
        console.error('Backend error:', result.error);
      }
    } catch (err) {
      console.error('Complete profile failed:', err);
      const error = err as FetchBaseQueryError;

      if (error.data && isErrorResponse(error.data)) {
        setErrorMessage(error.data.error);
      } else {
        console.log('error is ', error);
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;
  if (!data) return <p>No data</p>;

  if ('id' in data) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-muted/30 p-4'>
        <Card className='w-full max-w-md shadow-lg rounded-2xl'>
          <CardHeader>
            <CardTitle className='text-center text-xl font-bold'>Complete Your Profile</CardTitle>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className='space-y-4'>
              <div className='flex justify-center'>
                <Avatar className='w-20 h-20'>
                  <AvatarImage
                    src={picture}
                    alt={fullName}
                  />
                  <AvatarFallback>{fullName ? fullName[0] : '?'}</AvatarFallback>
                </Avatar>
              </div>

              {errorMessage && (
                <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-md'>
                  <p className='text-red-600 text-sm'>{errorMessage}</p>
                </div>
              )}

              <div className='space-y-2'>
                <Label htmlFor='full_name'>Full Name</Label>
                <Input
                  id='full_name'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder='John Doe'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@example.com'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='phone_number'>Phone Number</Label>
                <Input
                  id='phone_number'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder='+1234567890'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='picture'>Profile Picture</Label>
                <Input
                  id='picture'
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setPicture(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type='submit'
                className='w-full'
                disabled={isLoadingRequest}>
                {isLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  } else if ('redirectTo' in data) {
    navigate('/' + data.redirectTo);
  } else if ('error' in data) {
    console.error('Backend error:', data.error);
    navigate('/');
    return <h1>{data.error}</h1>;
  }
};

export default CompleteProfilePage;
