import { delet, download, get, post, put } from '@/utils/request';

export interface Account {
  email: string;
  password: string;
  captcha?: string;
}

export const getPatientList = (params: any) => {
  return get('/patient/list/all', params);
};

export const exportPatientList = (ids: any) => {
  return download('/patient/list/export', { ids });
};

export const getPatientInfo = (id: string) => {
  return get(`/patient/information/${id}`);
};

export const deletePatientDoc = (id: number, name: string) => {
  return delet(`/patient/document/remove/${id}/${name}`);
};

export const resetUserWaiting = (id: number) => {
  return put(`/patient/reset/${id}`, {});
};

export const savePatientInfo = (req: any) => {
  return put('/patient/information', req);
};

export const getAnswerList = (accountid: string) => {
  return get(`/answer/list/${accountid}`);
};

export const updateUrodynamics = (id: number, urodynamics: string) => {
  return post(`/patient/urodynamics/${id}`, { urodynamics });
};

// Operative Notes
export interface OperativeNote {
  ID: number;
  patientId: number;
  answerId: number;
  filePath: string;
  surgeryDate: string;
  surgeonName: string;
  procedureType: number;
  procedureTypeName?: string;
  complications?: string;
  deviceSerialNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  meetingDate?: string;
}

export const uploadOperativeNote = (data: FormData) => {
  return post('/patient/operative-note/upload', data);
};

export const getOperativeNotes = (patientId: number) => {
  return get(`/patient/operative-notes/${patientId}`);
};

export const deleteOperativeNote = (id: number) => {
  return delet(`/patient/operative-note/${id}`);
};

export const updateOperativeNote = (id: number, data: any) => {
  return put(`/patient/operative-note/${id}`, data);
};
