import BottomNavbar from '@/components/BottomNav';
import DynamicHead from '@/components/DynamicHead';
import Toastify from '@/components/Toastify';
import store, { persistor } from '@/redux/store';
import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <DynamicHead />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider attribute='class'>
            <Component {...pageProps} />
            <BottomNavbar />
            <Toastify />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
