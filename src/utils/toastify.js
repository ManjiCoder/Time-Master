export const toastifyOptions = (type, message) => {
  return {
    type,
    render: message,
    isLoading: false,
    autoClose: 2000,
    closeButton: true,
    closeOnClick: true,
  };
};
