import { toastDuration } from './constants';

export const toastifyOptions = (type, message) => {
  return {
    type,
    render: message,
    isLoading: false,
    autoClose: toastDuration,
    closeButton: true,
    closeOnClick: true,
  };
};
