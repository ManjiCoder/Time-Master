import { toastDuration } from './constants';

export const toastifyOptions = (type, message, time) => {
  return {
    type,
    render: message,
    isLoading: false,
    autoClose: time || toastDuration,
    closeButton: true,
    closeOnClick: true,
  };
};
