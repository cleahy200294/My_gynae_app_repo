import { post, get, delet, put } from '@/utils/request';

export const getQuestionnaire = (params?: any) => {
  return get('/survey/questionnaire', params);
};

export const getQuestionnaireByParentid = (parentid: number) => {
  return get('/survey/questionnaire', { parentid });
};

export const createQuestionnaire = (req: any) => {
  return post('/survey/questionnaire', req);
};

export const translate = (lang: string) => {
  return get('/survey/translate?lang=' + lang);
};

export const deleteQuestionnaire = (id: number) => {
  return delet(`/survey/questionnaire/${id}`);
};

export const changeQuestionnaire = (id: any, req: any) => {
  return put(`/survey/questionnaire/${id}`, req);
};
