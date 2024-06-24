import axios from 'axios';
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const headersList = {
  'Content-Type': 'application/json',
};
export const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: headersList,
});
