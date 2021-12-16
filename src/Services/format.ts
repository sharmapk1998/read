import moment from 'moment';
import {LEAD_TYPE} from '../values/customTypes';

export const formatAMPM = (date: Date) => {
  const utcDate = moment.utc(date);
  const localDate = moment(utcDate).local();
  return localDate.format('LT');
};

export const secToTime = (value: number) => {
  const hour = Math.floor(value / 3600);
  value = value - hour * 3600;
  const min = Math.floor(value / 60);
  value = value - min * 60;
  const sec = value;
  const hourString = hour < 10 ? '0' + String(hour) : String(hour);
  const minString = min < 10 ? '0' + String(min) : String(min);
  const secString = sec < 10 ? '0' + String(sec) : String(sec);
  if (hour === 0) {
    return `${minString}:${secString}`;
  }
  return `${hourString}:${minString}:${secString}`;
};

export const mapTaskToCount = (
  tasks: any[],
  type: 'Call Back' | 'Meeting' | 'Site Visit',
) => {
  if (tasks) {
    const filtered = tasks.filter((task: any) => task.type == type);
    return filtered.length;
  } else {
    return 0;
  }
};

export const getDateValues = (timestamp: any) => {
  const utcDate = moment.utc(timestamp.toDate());
  const localDate = moment(utcDate).local();
  return {
    date: localDate.format('DD'),
    month: localDate.format('MMM'),
    time: localDate.format('LT'),
  };
};

export const mapTypeToQuery = (type: LEAD_TYPE) => {
  if (type === 'FRESH') {
    return 'FRESH';
  } else if (type === 'INTERESTED') {
    return ['INTERESTED'];
  } else if (type === 'CALLBACK') {
    return ['CALLBACK'];
  } else if (type === 'FOLLOWUP') {
    return ['INTERESTED', 'CALLBACK'];
  } else if (type === 'WON') {
    return 'WON';
  } else if (type === 'MISSED') {
    return 'MISSED';
  } else {
    return 'SEARCH';
  }
};

export const getMonthYear = (date: Date) => {
  const utcDate = moment.utc(date);
  const localDate = moment(utcDate).local();
  return localDate.format('MMMM YYYY');
};

export const getDayName = (date: Date) => {
  const utcDate = moment.utc(date);
  const localDate = moment(utcDate).local();
  return localDate.format('ddd');
};

export const getDate = (date: Date) => {
  const utcDate = moment.utc(date);
  const localDate = moment(utcDate).local();
  return localDate.format('DD');
};

export const getDaysArray = (selected: any) => {
  let startDate = new Date(selected);
  startDate.setDate(startDate.getDate() - 3);
  let endDate = new Date(selected);
  endDate.setDate(endDate.getDate() + 3);
  let arr: Date[] = [];
  for (; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
    arr.push(new Date(startDate));
  }
  return arr;
};

export const toYYYYMMDD = (timestamp: any) => {
  let utcDate: any;
  if (timestamp.toDate) {
    utcDate = moment.utc(timestamp.toDate());
  } else {
    utcDate = moment.utc(timestamp);
  }
  const localDate = moment(utcDate).local();
  return localDate.format('YYYY-MM-DD');
};

export const getFullDate = (date: Date) => {
  const utcDate = moment.utc(date);
  const localDate = moment(utcDate).local();
  return localDate.format('ddd MMM DD YYYY');
};

export const getNotificationTime = (date: any) => {
  if (date.toDate) {
    const utcDate = moment.utc(date.toDate());
    const localDate = moment(utcDate).local();
    return localDate.format('DD MMM, LT');
  } else {
    return '';
  }
};

export const getCallLogTime = (date: Date) => {
  const utcDate = moment.utc(date);
  const localDate = moment(utcDate).local();
  return localDate.format('ddd - MMM DD, YYYY');
};

export const getPdfDate = (date: Date) => {
  const utcDate = moment.utc(date);
  const localDate = moment(utcDate).local();
  return localDate.format('DD MMM YYYY');
};

export const properFormat = (name: string) => {
  if (typeof name !== 'string') {
    return name;
  }
  if (name === 'CALLBACK') {
    return 'Call Back';
  }
  if (name === 'FOLLOWUP') {
    return 'Follow Up';
  }
  return name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

export const getLegend = (data: string, clip?: number) => {
  let clipLength = clip ? clip : 14;
  const length = data.length;
  if (data.length > 14) {
    return data.slice(0, clip) + '...';
  }
  return properFormat(data);
};

export const chunk = (arr: any[], chunkSize: number) => {
  if (chunkSize <= 0) {
    return [];
  }
  var R = [];
  for (var i = 0, len = arr.length; i < len; i += chunkSize)
    R.push(arr.slice(i, i + chunkSize));
  return R;
};

export const getFilterDate = (date: Date) => {
  const utcDate = moment.utc(date);
  const localDate = moment(utcDate).local();
  return localDate.format('DD/MM/YY');
};

export const getHeading = (deg: number) => {
  if (deg >= 0 && deg < 90) {
    return 'NE';
  } else if (deg >= 90 && deg < 180) {
    return 'SE';
  } else if (deg >= 180 && deg < 270) {
    return 'SW';
  } else {
    return 'NW';
  }
};
