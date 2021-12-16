import axios from 'axios';
import moment from 'moment';
import {setLeadsFilterObject, updateAllLeadCount} from '../redux/actions';
import {BACKEND_URL, TOKEN} from '../values/backend';

const pageSize = 40;

const datesField = [
  'created_at',
  'next_follow_up_date_time',
  'stage_change_at',
  'modified_at',
  'lead_assign_time',
];

export const fetchContacts = (
  uid: string,
  page: number,
  searchString: string,
  filters: any,
  sort: any,
  stage: any,
  missed: boolean,
  setLoad: (value: boolean) => void,
  setLeads: (leads: any[]) => void,
  // setLeadslength: (leadslength: number) => void,
  setFinished: (value: boolean) => void,
  prospect: boolean,
) => {
  let url = BACKEND_URL + '/leads/search';
  if (prospect) {
    delete filters.stage;
    url = BACKEND_URL + '/leads/taskSearch';
  }
  let sorting:any
  if(stage === 'MISSED'){
    sorting= {next_follow_up_date_time: sort[stage] ? 1 : -1}
  }
  else
  if(stage === 'PROSPECT'){
    sorting= {completed_at: sort[stage] ? 1 : -1}
  }
  else
  if(stage === 'WON'|| stage === 'INTERESTED'|| stage === 'CALLBACK' ){   
    sorting= {stage_change_at: sort[stage] ? -1 : 1}
  }
  else{
    sorting={lead_assign_time: sort[stage] ? -1 : 1}
  }
  const apiData = {
    uid: uid,
    page,
    searchString,
    sort: sorting,
    pageSize,
    filter: prospect ? filters : {...filters, transfer_status: ['False']},
    missed,
  };
  if (page === 1) {
    setLoad(true);
  }
// console.log(apiData)
  axios
    .post(url, apiData, {headers: {'x-access-token': TOKEN}})
    .then((res) => {
      const leads: any[] = res.data ? res.data : [];
      if (leads.length < pageSize) {
        setFinished(true);
      }
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
      setLeads(leads);
      setLoad(false);
    })
    .catch((error) => {
      setLoad(false);
      console.log(error);
    });
};

export const fetchStageCount = (uid: string, dispatcher: any) => {
  const url = BACKEND_URL + '/leads/stageCount';
  const apiData = {
    uid,
  };
  axios
    .post(url, apiData, {headers: {'x-access-token': TOKEN}})
    .then(async (res) => {
      const prospectUrl = BACKEND_URL + '/leads/taskStageCount';
      const prospect_res = await axios.post(prospectUrl, apiData, {
        headers: {'x-access-token': TOKEN},
      });
      let prospectCount = prospect_res.data.count ? prospect_res.data.count : 0;
      const stages = [
        'FRESH',
        'CALLBACK',
        'INTERESTED',
        'WON',
        'LOST',
        'MISSED',
        'NOT INTERESTED',
      ];
      if (res.data) {
        let stageCount: any[] = res.data;
        const counts: {[stage: string]: number} = {};
        stageCount.forEach((stage) => {
          counts[stage._id] = stage.count;
        });
        stages.forEach((stage) => {
          if (counts[stage] === undefined) {
            counts[stage] = 0;
          }
        });
        counts['FOLLOWUP'] = counts['INTERESTED'] + counts['CALLBACK'];
        counts['PROSPECT'] = prospectCount;
        dispatcher(updateAllLeadCount(counts));
      }
    });
};

export const getFilterValues = (
  uid: string,
  stage: string,
  dispatcher: any,
) => {
  const url = BACKEND_URL + '/leads/filterValues';
  let apiData: any = {
    uid,
    stage,
  };
  if (stage === 'SEARCH' || stage === 'PROSPECT' || stage === 'DRILLDOWN') {
    apiData = {uid};
  }

  axios
    .post(url, apiData, {headers: {'x-access-token': TOKEN}})
    .then((res) => {
      dispatcher(setLeadsFilterObject(res.data[0] ? res.data[0] : {}));
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getBasicFilters = (stage: string, reason: string) => {
  let filters = {};
  if (stage === 'INTERESTED') {
    filters = {stage: [stage], next_follow_up_type: [reason]};
  } else if (stage === 'MISSED') {
    filters = {stage: [reason]};
  } else if (stage === 'CALLBACK') {
    filters = {stage: [stage], call_back_reason: [reason]};
  } else if (stage === 'PROSPECT') {
    filters = {stage: [reason]};
  }
  return filters;
};

export const inActiveStages = ['LOST', 'WON', 'NOT INTERESTED'];
