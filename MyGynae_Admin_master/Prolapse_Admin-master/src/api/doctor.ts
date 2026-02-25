import { get, post } from '@/utils/request';

export interface Doctor {
  email: string;
  password: string;
}

export const getDoctor = () => {
  return get('/doctor/list/account');
};

export const createDoctor = (req: Doctor) => {
  return post('/account/register', { ...req, role: 2 });
};
