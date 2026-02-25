import moment from 'moment';

export const invalidTime = (time: string): boolean => {
  return !moment(time).isValid();
};
