import { post, get, delet, put } from '@/utils/request';

export const getQuestion = (id: number) => {
    return get(`/survey/question/${id}`);
};

export const createQuestion = (req: any) => {
    return post('/survey/question', req);
};

export const deleteQuestion = (id: number) => {
    return delet(`/survey/question/${id}`);
};

export const changeQuestion = (id: any, req: any) => {
    return put(`/survey/question/${id}`, req);
};

export const changeAnswer = (id: any, req: any) => {
    return put(`/answer/details/${id}`, req);
};