import { post, get, delet, put } from '@/utils/request';

export const getMeeting = (params?: any) => {
  return get('/meet/meeting', params);
};

export const createMeeting = (req: any) => {
  return post('/meet/meeting', req);
};

export const deleteMeeting = (id: number) => {
  return delet(`/meet/meeting/${id}`);
};

export const changeMeeting = (id: any, req: any) => {
  return put(`/meet/meeting/${id}`, req);
};
