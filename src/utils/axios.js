import { axios as axiosClient } from 'axios';
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const headersList = {
  'Content-Type': 'application/json',
};

export const axios = axiosClient.create({
  baseURL,
  headers: headersList,
});
