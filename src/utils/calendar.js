import moment from 'moment';

export const toCalendarDateString = date =>
  moment(date).format('YYYY-MM-DD');

export const parseCalendarDateString = dateString =>
  moment(dateString, 'YYYY-MM-DD').startOf('day').toDate();

export const getTodayCalendarString = () => toCalendarDateString(new Date());
