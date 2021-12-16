import axios from 'axios';
import {setLeadsFilterObject} from '../redux/actions';
import {BACKEND_URL, TOKEN} from '../values/backend';

export const getCallLogFilterValues = (uid: string, dispatcher: any) => {
  const url = BACKEND_URL + '/callLogs/filterValues';
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
