export const toastifyOptions = (type, message) => {
  return {
    type,
    render: message,
    isLoading: false,
    autoClose: 5000,
    closeButton: true,
    closeOnClick: true,
  };
};
