import { toastDuration } from '@/utils/constants';
import { useTheme } from 'next-themes';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Toastify() {
  const { systemTheme, theme } = useTheme();
  return (
    <ToastContainer
      className='mt-12'
      theme={theme === 'system' ? systemTheme : theme}
      // theme='colored'
      autoClose={toastDuration}
    />
  );
}
