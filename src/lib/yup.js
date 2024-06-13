import { object, string } from 'yup';

export const msgSchema = object({
  msg: string()
    .trim()
    .required('*required')
    .min(3, 'Should be of minimum 3 characters.')
    .max(500, 'Should be of maximum 500 characters.'),
});
