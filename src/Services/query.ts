import axios from 'axios';
import {BACKEND_URL, TOKEN} from '../values/backend';

export const fetchquery = async (
    uid: string,
    dispatcher: any,
    setQuery: (leads: any[]) => void,
    setLoad: (value: boolean) => void,) => {
    const url = BACKEND_URL + '/query/getQueries';
    let apiData= {
      uid,
    };
    setLoad(true);
    axios.post(url, apiData, {headers: {'x-access-token': TOKEN}})
      .then((res) => {
        const query: any[] = res.data ? res.data : [];
        setQuery(query)
        console.log(res)
      })
      .catch((error) => {
        console.log(error);
      });
}; 