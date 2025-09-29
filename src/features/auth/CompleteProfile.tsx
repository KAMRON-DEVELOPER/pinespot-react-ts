import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { useCompleteProfileMutation, useGetOauthUserQuery } from '../../services/auth';
import type { SerializedError } from '@reduxjs/toolkit';
import { login } from './authSlice';
import { useAppDispatch } from '@/hooks/hooks';

interface CompleteProfileFormFields extends HTMLFormControlsCollection {
  first_name: HTMLInputElement;
  last_name: HTMLInputElement;
  email: HTMLInputElement;
  phone_number: HTMLInputElement;
  picture: HTMLInputElement;
}

interface CompleteProfileFormElements extends HTMLFormElement {
  readonly elements: CompleteProfileFormFields;
}

const CompleteProfile = () => {
  const { data } = useGetOauthUserQuery();
  const [complete, { isLoading, isError, error }] = useCompleteProfileMutation();
  const dispatch = useAppDispatch();

  const onSubmit = async (e: React.FormEvent<CompleteProfileFormElements>) => {
    e.preventDefault();
    const form = e.currentTarget.elements;

    const formData = new FormData();
    formData.append('first_name', form.first_name.value);
    formData.append('last_name', form.last_name.value);
    formData.append('email', form.email.value);
    formData.append('phone_number', form.phone_number.value);

    if (form.picture.files?.[0]) {
      formData.append('picture', form.picture.files[0]);
    }

    try {
      const result = await complete(formData).unwrap();
      dispatch(login(result));
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
          id='first_name'
          placeholder='first name'
          defaultValue={data?.given_name || ''}
        />
        <input
          id='last_name'
          placeholder='last name'
          defaultValue={data?.family_name || ''}
        />
        <input
          id='email'
          placeholder='email'
          defaultValue={data?.email || ''}
        />
        <input
          id='name'
          placeholder='name'
          defaultValue={data?.name || ''}
        />
        <input
          id='phone_number'
          placeholder='phone number'
          defaultValue={data?.phone_number || ''}
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
          alt={`${data?.name || 'User'} profile picture`}
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
      )}
    </div>
  );
};

export default CompleteProfile;
