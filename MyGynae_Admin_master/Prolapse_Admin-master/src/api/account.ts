import { post } from '@/utils/request';

export interface Account {
    email: string;
    password: string;
    captcha?: string;
}

export const logIn = (req: Account) => {
    return post('/account/login', { ...req, role: 3 });
};
