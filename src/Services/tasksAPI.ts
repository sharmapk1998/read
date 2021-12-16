import {firebase} from '@react-native-firebase/messaging';
import axios from 'axios';
import {setLeadsFilterObject} from '../redux/actions';
import {BACKEND_URL, TOKEN} from '../values/backend';
import {getTaskColor} from './tasks';

export const getTaskDateStatus = (
  uid: string,
  month: number,
  setMarkedDates: (data: any) => void,
  setLoad: (value: boolean) => void,
) => {
  const url = BACKEND_URL + '/tasks/taskDateStatus';
  let apiData: any = {
    uid,
    month,
  };
  setLoad(true);
  let data: {[key: string]: {dots: {key: string; color: string}[]}} = {};
  axios
    .post(url, apiData, {headers: {'x-access-token': TOKEN}})
    .then((res) => {
      const tasks = res.data;
      Object.keys(tasks).forEach((date, index1) => {
        let dots: {key: string; color: string}[] = [];
        Object.keys(tasks[date]).forEach((status, index2) => {
          if (tasks[date][status] !== 0) {
            dots.push({
              key: String(index1) + String(index2),
              color: getTaskColor(status),
            });
          }
        });
        data[date] = {dots};
      });
      setLoad(false);
      setMarkedDates(data);
    })
    .catch((error) => {
      setLoad(false);
      console.log(error);
    });
};

const datesField = ['created_at', 'completed_at', 'due_date'];

export const getTasksofDate = (
  uid: string,
  date: string,
  setTasks: (data: any) => void,
  setLoad: (value: boolean) => void,
) => {
  const url = BACKEND_URL + '/tasks/getTasksOfDate';
  let apiData: any = {
    uid,
    date,
  };
  setLoad(true);
  axios
    .post(url, apiData, {headers: {'x-access-token': TOKEN}})
    .then((res) => {
      const tasks = res.data;
      if (tasks) {
        let overdue: any[] = [];
        let completed: any[] = [];
        let pending: any[] = [];
        tasks.forEach((item: any) => {
          datesField.forEach((feild) => {
            if (item[feild]) {
              item[feild] = firebase.firestore.Timestamp.fromDate(
                new Date(item[feild]),
              );
            }
          });
          if (item.status === 'Completed') {
            completed.push(item);
          } else if (item.due_date.toDate() < new Date()) {
            item.status = 'Over Due';
            overdue.push(item);
          } else {
            pending.push(item);
          }
        });
        
        setLoad(false);
        setTasks(overdue.concat(pending, completed));
      }
    })
    .catch((error) => {
      setLoad(false);
      console.log(error);
    });
};

export const getTaskFilterValues = (uid: string, dispatcher: any) => {
  const url = BACKEND_URL + '/tasks/filterValues';
  let apiData: any = {
    uid,
  };
  axios
    .post(url, apiData, {headers: {'x-access-token': TOKEN}})
    .then((res) => {
      dispatcher(setLeadsFilterObject(res.data[0] ? res.data[0] : {}));
    })
    .catch((error) => {
      console.log(error);
    });
};
