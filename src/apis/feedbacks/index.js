import { toastifyOptions } from '@/utils/toastify';
import { toast } from 'react-toastify';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const headersList = {
  'Content-Type': 'application/json',
};

export const featureRequest = async (payload, callback) => {
  const toastId = toast.loading('Please Wait...');
  try {
    let bodyContent = JSON.stringify(payload);
    let response = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      body: bodyContent,
      headers: headersList,
    });
    if (response.ok) {
      toast.update(
        toastId,
        toastifyOptions('success', `${payload.formType} Send Successfully!`)
      );
    } else {
      toast.update(
        toastId,
        toastifyOptions('error', `${payload.formType} Send Failed!`)
      );
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
