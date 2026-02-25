import { post, get } from '@/utils/request';

export const getUserInfo = () => {
  return get('/user/information');
};

export const saveUserInfo = (req: any) => {
  return post('/user/information', req);
};
