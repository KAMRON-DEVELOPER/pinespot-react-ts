import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useCompleteProfileMutation, useGetOAuthUserQuery } from '../../services/auth';
import type { SerializedError } from '@reduxjs/toolkit';
import { setUser } from './authSlice';
import { useAppDispatch } from '@/store/store';

interface CompleteProfileFormFields extends HTMLFormControlsCollection {
  full_name: HTMLInputElement;
  email: HTMLInputElement;
  phone_number: HTMLInputElement;
  password: HTMLInputElement;
  picture: HTMLInputElement;
}

interface CompleteProfileFormElements extends HTMLFormElement {
  readonly elements: CompleteProfileFormFields;
}

const CompleteProfile = () => {
  const { data } = useGetOAuthUserQuery();
  const [complete, { isLoading, isError, error }] = useCompleteProfileMutation();
  const dispatch = useAppDispatch();

  const onSubmit = async (e: React.FormEvent<CompleteProfileFormElements>) => {
    e.preventDefault();
    const form = e.currentTarget.elements;

    const formData = new FormData();
    formData.append('full_name', form.full_name.value);
    formData.append('email', form.email.value);
    formData.append('password', form.password.value);
    formData.append('phone_number', form.phone_number.value);

    if (form.picture.files?.[0]) {
      formData.append('picture', form.picture.files[0]);
    }

    try {
      const result = await complete(formData).unwrap();
      dispatch(setUser(result));
    } catch (err) {
      console.error('Complete profile failed:', err);
    }
  };

  const renderError = () => {
    if (!isError || !error) return null;

    if ('status' in error) {
      const fetchError = error as FetchBaseQueryError;
      switch (fetchError.status) {
        case 400:
          return <p>Please check your input. Some fields may be invalid.</p>;
        case 401:
          return <p>You are not authorized. Please log in again.</p>;
        case 403:
          return <p>You don’t have permission to update this profile.</p>;
        case 500:
          return <p>Server error. Please try again later.</p>;
        default:
          return <p>Unexpected error: {fetchError.status}</p>;
      }
    }

    if ('message' in error) {
      const serializedError = error as SerializedError;
      return <p>{serializedError.message || 'Something went wrong.'}</p>;
    }

    return <p>Unknown error occurred.</p>;
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          id='full_name'
          placeholder='full name'
          defaultValue={data?.full_name || ''}
        />
        <input
          id='email'
          placeholder='email'
          defaultValue={data?.email || ''}
        />
        <input
          id='phone_number'
          placeholder='phone number'
          defaultValue={data?.phone_number || ''}
        />
        <input
          id='password'
          placeholder='••••••••'
          defaultValue={data?.password || ''}
        />
        <input
          id='picture'
          type='file'
        />
        <button
          type='submit'
          disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </form>

      {renderError()}

      {data?.picture && (
        <img
          src={data.picture}
          alt={`${data?.full_name || 'User'} profile picture`}
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
      )}
    </div>
  );
};

export default CompleteProfile;
