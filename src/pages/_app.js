import BottomNavbar from '@/components/BottomNav';
import DynamicHead from '@/components/DynamicHead';
import Toastify from '@/components/Toastify';
import store, { persistor } from '@/redux/store';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { Baloo_Bhai_2 } from 'next/font/google';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
const inter = Baloo_Bhai_2({ subsets: ['latin'] });
const queryClient = new QueryClient();
export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className={inter.className}>
        <DynamicHead />
        <Provider store={store}>
          <PersistGate
            loading={
              <ThemeProvider attribute='class'>
                <Component {...pageProps} />
                <BottomNavbar />
                <Toastify />
              </ThemeProvider>
            }
            persistor={persistor}
          >
            <ThemeProvider attribute='class'>
              <Component {...pageProps} />
              <BottomNavbar />
              <Toastify />
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </main>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
