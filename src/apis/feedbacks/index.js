import { toastifyOptions } from '@/utils/toastify';
import { toast } from 'react-toastify';

let headersList = {
  'Content-Type': 'application/json',
};

export const featureRequest = async (payload, callback) => {
  const toastId = toast.loading('Please Wait...');
  try {
    let bodyContent = JSON.stringify(payload);
    let response = await fetch('http://localhost:3000/api/feedback', {
      method: 'POST',
      body: bodyContent,
      headers: headersList,
    });
    if (response.ok) {
      toast.update(
        toastId,
        toastifyOptions('success', 'Form Submitted Successfully!')
      );
    } else {
      toast.update(toastId, toastifyOptions('error', 'Form Submition Failed!'));
    }

    let data = await response.json();
    console.log(data);
    callback();

    return true;
  } catch (error) {
    toast.update(
      toastId,
      toastifyOptions('error', 'Something Went Wrong! Please Try Again Later.')
    );
    return false;
  }
};
