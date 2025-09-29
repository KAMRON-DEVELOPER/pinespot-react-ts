import { useLoginMutation } from '../../services/auth';
import type { AuthResponse } from './types';
import { login as loginStore } from './authSlice';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/store/store';

interface LoginPageFormFields extends HTMLFormControlsCollection {
  email: HTMLSelectElement;
  password: HTMLSelectElement;
}
interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields;
}

export const LoginPage = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<LoginPageFormElements>) => {
    e.preventDefault();

    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;
    console.log('email: ', email);
    console.log('password: ', password);

    const result = await login({ email, password }).unwrap();
    console.log('result: ', result);

    try {
      const result: AuthResponse = await login({ email, password }).unwrap();
      dispatch(loginStore(result));
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
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>email:</label>
        <input
          type='text'
          placeholder='email'
        />
        <label htmlFor='password'>password:</label>
        <input
          type='text'
          placeholder='password'
        />
        <button>Log In</button>
      </form>
    </section>
  );
};
