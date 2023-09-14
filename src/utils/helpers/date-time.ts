import moment from 'moment' 

export const timeLapsedFromNow = (date : Date) => moment(date).fromNow()
export const getDate = (date? : Date) => !date ? undefined : moment(date).toDate()
export const formatDate = (date : Date) => moment(date).format('YYYY-MM-DD');