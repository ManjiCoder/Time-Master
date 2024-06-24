import BottomNavbar from '@/components/BottomNav';
import DynamicHead from '@/components/DynamicHead';
import Toastify from '@/components/Toastify';
import store, { persistor } from '@/redux/store';
import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { Baloo_Bhai_2 } from 'next/font/google';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
const inter = Baloo_Bhai_2({ subsets: ['latin'] });

export default function App({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <DynamicHead />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {() => {
            return (
              <ThemeProvider attribute='class'>
                <Component {...pageProps} />
                <BottomNavbar />
                <Toastify />
              </ThemeProvider>
            );
          }}
        </PersistGate>
      </Provider>
    </main>
  );
}
