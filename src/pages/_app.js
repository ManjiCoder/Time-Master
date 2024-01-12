import BottomNavbar from '@/components/BottomNav';
import store, { persistor } from '@/redux/store';
import '@/styles/globals.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
        <BottomNavbar />
      </PersistGate>
    </Provider>
  );
}
