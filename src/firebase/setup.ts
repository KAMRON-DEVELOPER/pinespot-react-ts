import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDFcuI7aBbVofpkNj10Av8cR0QLhxGBUWo',
  authDomain: 'pinespot2025.firebaseapp.com',
  projectId: 'pinespot2025',
  storageBucket: 'pinespot2025.firebasestorage.app',
  messagingSenderId: '892968007349',
  appId: '1:892968007349:web:932375270100407d39f0fc',
  measurementId: 'G-M4PS4DFWVK',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export default app;
