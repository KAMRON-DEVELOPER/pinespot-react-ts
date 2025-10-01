import { useCompleteProfileMutation, useGetOAuthUserQuery } from '@/services/auth';
import { setUser } from './authSlice';
import { useAppDispatch } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, type FormEvent } from 'react';

// interface CompleteProfileFormFields extends HTMLFormControlsCollection {
//   full_name: HTMLInputElement;
//   email: HTMLInputElement;
//   phone_number: HTMLInputElement;
//   password: HTMLInputElement;
//   picture: HTMLInputElement;
// }

// interface CompleteProfileFormElements extends HTMLFormElement {
//   readonly elements: CompleteProfileFormFields;
// }

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, isSuccess } = useGetOAuthUserQuery();
  const [complete] = useCompleteProfileMutation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [picture, setPicture] = useState('');

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
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('phone_number', phoneNumber);
    formData.append('password', password);

    if (form.picture.files?.[0]) {
      formData.append('picture', form.picture.files[0]);
    }

    try {
      const result = await complete(formData).unwrap();

      if ('user' in result && 'tokens' in result) {
        dispatch(setUser(result));
        navigate('/');
      } else if ('error' in result) {
        console.error('Backend error:', result.error);
      }
    } catch (err) {
      console.error('Complete profile failed:', err);
    }
  };

  if (data === undefined) {
    console.error('data is undefined');
    return <h1>data is undefined</h1>;
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong.</p>;
  if (!data) return <p>No data</p>;

  if ('id' in data) {
    return (
      <div>
        <form onSubmit={onSubmit}>
          <input
            id='full_name'
            placeholder='full name'
            defaultValue={data?.fullName || ''}
          />
          <input
            id='email'
            placeholder='email'
            defaultValue={data?.email || ''}
          />
          <input
            id='phone_number'
            placeholder='phone number'
            defaultValue={data?.phoneNumber || ''}
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

          {picture.length > 0 && (
            <img
              src={picture}
              alt={'profile picture'}
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
          )}

          <button
            type='submit'
            disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </form>
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

export default CompleteProfile;
