import axios from 'axios';
import moment from 'moment';
import {BACKEND_URL, TOKEN} from '../values/backend';

export const getFilterDates = (type: 'All' | 'MTD' | 'PM' | 'T' | 'Y') => {
  let startDate: string | Date = '';
  let endDate: string | Date = '';
  if (type === 'MTD') {
    const startOfMonth = moment().startOf('month').toDate();
    startDate = startOfMonth;
    endDate = moment().toDate();
  } else if (type === 'PM') {
    const prevMonth = moment().subtract(1, 'M');
    const prevMonthStart = prevMonth.startOf('month').toDate();
    const prevMonthEnd = prevMonth.endOf('month').toDate();
    startDate = prevMonthStart;
    endDate = prevMonthEnd;
  } else if (type === 'T') {
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();
    startDate = todayStart;
    endDate = todayEnd;
  } else if (type === 'Y') {
    const prevDay = moment().subtract(1, 'day');
    const prevDayStart = prevDay.startOf('day').toDate();
    const prevDayEnd = prevDay.endOf('day').toDate();
    startDate = prevDayStart;
    endDate = prevDayEnd;
  }
  return {startDate, endDate};
};

const pageSize = 40;

const datesField = [
  'created_at',
  'next_follow_up_date_time',
  'stage_change_at',
  'modified_at',
  'lead_assign_time',
];

const taskDateFeilds = ['completed_at', 'due_date', 'created_at'];

export const getDrillDownData = (
  uid: string,
  page: number,
  searchString: string,
  filters: any,
  sort: any,
  role: boolean,
  setLoad: (value: boolean) => void,
  setLeads: (leads: any[]) => void,
  setFinished: (value: boolean) => void,
) => {
  let url = BACKEND_URL + '/leads/drillDownSearch';
  const apiData = {
    uid: uid,
    page,
    searchString,
    sort,
    pageSize,
    taskFilter: {},
    leadFilter: {...filters, associate_status: ['True']},
    role,
  };
  if (page === 1) {
    setLoad(true);
  }
  // console.log('lead --',apiData)
  axios
    .post(url, apiData, {headers: {'x-access-token': TOKEN}})
    .then((res) => {
      let leads: any[] = res.data ? res.data : [];
      if (leads.length < pageSize) {
        setFinished(true);
      }
      // console.log('leadsData --',leads);
      if (leads.length) {
        leads.forEach((lead) => {
          lead.id = lead.ID;
          Object.keys(lead).forEach((key) => {
            if (datesField.includes(key) && lead[key] !== '') {
              if (lead[key] !== null) {
                lead[key] = moment(lead[key]);
              } else {
                lead[key] = '';
              }
            }
          });
        });
      } else {
        leads = [];
      }
      setLeads(leads);
      setLoad(false);
    })
    .catch((error) => {
      setLoad(false);
      console.log('DrillDown Error - ', error);
    });
};

export const getTaskDrillDownData = (           
  uid: string,
  page: number,
  searchString: string,
  filters: any,
  sort: any,
  role: boolean,
  setLoad: (value: boolean) => void,
  setTasks: (leads: any[]) => void,
  setFinished: (value: boolean) => void,
) => {
  let url = BACKEND_URL + '/tasks/drillDownSearch';
  const apiData = {
    uid: uid,
    page,
    searchString,
    sort,
    pageSize,
    taskFilter: filters,
    leadFilter: {},
    role,
  };
  apiData.leadFilter = {'leads.associate_status' : ["True"]}
  if (page === 1) {
    setLoad(true);
  }
  // console.log('Task --',filters);
  axios
    .post(url, apiData, {headers: {'x-access-token': TOKEN}})
    .then((res) => {
      let tasks: any[] = res.data ? res.data : [];
      if (tasks.length < pageSize) {
        setFinished(true);
      }
      // console.log('TaskData --',tasks);
      if (tasks.length) {
        tasks.forEach((task) => {
          Object.keys(task).forEach((key) => {
            if (taskDateFeilds.includes(key) && task[key] !== '') {
              if (task[key] !== null) {
                task[key] = moment(task[key]);
              } else {
                task[key] = '';
              }
            }
          });
        });
      } else {
        tasks = [];
      }
      setTasks(tasks);
      setLoad(false);
    })
    .catch((error) => {
      setLoad(false);
      console.log('DrillDown Error - ', error);
    });
};

const getCallingSec = (duration: string) => {
  if (duration === '0 Sec') {
    return [0];
  } else if (duration === '0-30 Sec') {
    return [30];
  } else if (duration === '30-60 Sec') {
    return [60];
  } else if (duration === '60-120 Sec') {
    return [120];
  } else {
    return [121];
  }
};

export const getCallLogDrillDownData = (
  uid: string,
  page: number,
  searchString: string,
  filters: any,
  sort: any,
  role: boolean,
  setLoad: (value: boolean) => void,
  setTasks: (leads: any[]) => void,
  setFinished: (value: boolean) => void,
) => {
  let url = BACKEND_URL + '/callLogs/drillDownSearch';
  if (filters['duration']) {
    filters['duration'] = getCallingSec(filters['duration']);
  }
  const apiData = {
    uid: uid,
    page,
    searchString,
    sort,
    pageSize,
    taskFilter: {},
    leadFilter: {},
    callFilter: filters,
    role,
  };
  if (page === 1) {
    setLoad(true);
  }
  // console.log('call --',apiData);
  axios
    .post(url, apiData, {headers: {'x-access-token': TOKEN}})
    .then((res) => {
      let callLogs: any[] = res.data ? res.data : [];

      // console.log('callLogs --',callLogs);
      
      if (callLogs.length < pageSize) {
        setFinished(true);
      }
      if (callLogs.length) {
        callLogs.forEach((callLog) => {
          Object.keys(callLog).forEach((key) => {
            if (taskDateFeilds.includes(key) && callLog[key] !== '') {
              if (callLog[key] !== null) {
                callLog[key] = moment(callLog[key]);
              } else {
                callLog[key] = '';
              }
            }
          });
        });
      } else {
        callLogs = [];
      }
      setTasks(callLogs);
      setLoad(false);
    })
    .catch((error) => {
      setLoad(false);
      console.log('DrillDown Error - ', error);
    });
};

export const getLeadCountFilter = (filter: any, stage: string) => {
  const {startDate, endDate} = getFilterDates(filter);
  if (filter === 'All') {
    return {
      stage: [stage],
    };
  } else {
    return {
      stage_change_at: [startDate, endDate],
      stage: [stage],
    };
  }
};
