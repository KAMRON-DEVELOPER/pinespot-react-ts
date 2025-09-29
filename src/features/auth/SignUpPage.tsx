import { useSignupMutation } from '../../services/auth';
import type { AuthResponse } from './types';
import { setUser } from './authSlice';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/store/store';

interface SignUpPageFormFields extends HTMLFormControlsCollection {
  email: HTMLSelectElement;
  password: HTMLSelectElement;
}
interface SignUpPageFormElements extends HTMLFormElement {
  readonly elements: SignUpPageFormFields;
}

export const SignUpPage = () => {
  const [login, { isLoading, isError, error }] = useSignupMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<SignUpPageFormElements>) => {
    e.preventDefault();

    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;
    console.log('email: ', email);
    console.log('password: ', password);

    const result = await login({ email, password }).unwrap();
    console.log('result: ', result);

    try {
      const result: AuthResponse = await login({ email, password }).unwrap();
      dispatch(setUser(result));
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (isLoading) return <h3>Loading...</h3>;

  if (isError) {
    if (error && 'status' in error) {
      const fetchError = error as FetchBaseQueryError;
      return <h3>{fetchError.status}</h3>;
    }

    if (error && 'message' in error) {
      const serializedError = error as SerializedError;
      return (
        <>
          <h3>{serializedError.message}</h3>
          <br />
          <h3>{serializedError.code}</h3>
          <br />
          <h3>{serializedError.name}</h3>
          <br />
          <h3>{serializedError.stack}</h3>;
        </>
      );
    }
  }

  return (
    <section>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>email:</label>
        <input
          id='email'
          type='text'
          placeholder='email'
        />
        <label htmlFor='password'>password:</label>
        <input
          id='password'
          type='text'
          placeholder='password'
        />
        <button>Log In</button>
      </form>
    </section>
  );
};
