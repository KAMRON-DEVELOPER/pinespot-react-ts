import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import '@/css/index.css';
import { ThemeProvider } from 'next-themes';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider
      storageKey='theme'
      defaultTheme='system'
      attribute='class'
      enableSystem>
      <App />
    </ThemeProvider>
  </Provider>
);
