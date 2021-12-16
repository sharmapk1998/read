import axios from 'axios';
import moment from 'moment';
import {setAnalytics} from '../redux/actions';
import {BACKEND_URL, TOKEN} from '../values/backend';
import {toLocalDate} from '../Services/leads';

const getDate = (type: 'All' | 'MTD' | 'PM' | 'T' | 'Y') => {
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

const callingType = (duration: number | string) => {
  if (duration === 0) {
    return '0 Sec';
  } else if (duration === 30) {
    return '0-30 Sec';
  } else if (duration === 60) {
    return '30-60 Sec';
  } else if (duration === 120) {
    return '60-120 Sec';
  } else {
    return '>120 Sec';
  }
};

export const fetchAnalytics = async (
  user: any,
  dispatcher: any,
  type: 'All' | 'MTD' | 'PM',
) => {
  let analytics: any = {};
  let completedCount = 0;
  let pendingCount = 0;

  const {startDate, endDate} = getDate(type);

  const feedbackApiData = {
    uid: user.uid,
    start_date: startDate,
    end_date: endDate,
  };
  // console.log('api',feedbackApiData)
  let feedbackRes: any = {};
  try {
    feedbackRes = await axios.post(
      BACKEND_URL + '/leads/feedbackReport/associate',
      feedbackApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Feedback Report Error - ', error);
  }
  // console.log('res', feedbackRes)
  if(feedbackRes.data.report.length === 0){
    analytics[user.uid] = {
      leadAnalytics: {
        stage: {},
        budget: {},
        location: {},
        project: {},
        propertyType: {},
        propertyStage: {},
        lost_reason: {},
        not_int_reason: {},
      },
    };
  }
  if (feedbackRes.data.report) {
    feedbackRes.data.report.forEach((item: any) => {
      let stage: {[key: string]: number} = {};
      // console.log(stage)
      item.stage.forEach((val: any) => {
        stage[val.stage] = val.count;
      });
      
      analytics[item.owner] = {
        leadAnalytics: {
          stage: stage,
          budget: {},
          location: {},
          project: {},
          propertyType: {},
          propertyStage: {},
          lost_reason: {},
          not_int_reason: {},
        },
      };
    });
  }
  const budgetApiData = {
    uid: user.uid,
    parameter: 'budget',
    start_date: startDate,
    end_date: endDate,
  };
  let budgetRes: any = {};
  try {
    budgetRes = await axios.post(
      BACKEND_URL + '/leads/interestedReport/associate',
      budgetApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Interested Budget Report Error - ', error);
  }

  if (budgetRes.data.report) {
    budgetRes.data.report.forEach((item: any) => {
      let budget: {[key: string]: number} = {};
      item.budget.forEach((val: any) => {
        budget[val.budget] = val.count;
      });
      analytics[item.owner] = {
        leadAnalytics: {
          budget: budget,
          stage: {...analytics[item.owner].leadAnalytics.stage},
          location: {},
          project: {},
          propertyType: {},
          propertyStage: {},
          lost_reason: {},
          not_int_reason: {},
        },
      };
    });
  }
  const locationApiData = {
    uid: user.uid,
    parameter: 'location',
    start_date: startDate,
    end_date: endDate,
  };
  let locationRes: any = {};
  try {
    locationRes = await axios.post(
      BACKEND_URL + '/leads/interestedReport/associate',
      locationApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Location Interested Report Error - ', error);
  }

  if (locationRes.data.report) {
    locationRes.data.report.forEach((item: any) => {
      let location: {[key: string]: number} = {};
      item.location.forEach((val: any) => {
        location[val.location] = val.count;
      });
      analytics[item.owner] = {
        leadAnalytics: {
          location: location,
          budget: {...analytics[item.owner].leadAnalytics.budget},
          stage: {...analytics[item.owner].leadAnalytics.stage},
          project: {},
          propertyType: {},
          propertyStage: {},
          lost_reason: {},
          not_int_reason: {},
        },
      };
    });
  }
  const projectApiData = {
    uid: user.uid,
    parameter: 'project',
    start_date: startDate,
    end_date: endDate,
  };
  let projectRes: any = {};
  try {
    projectRes = await axios.post(
      BACKEND_URL + '/leads/interestedReport/associate',
      projectApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Interested Project Error - ', error);
  }

  if (projectRes.data.report) {
    projectRes.data.report.forEach((item: any) => {
      let project: {[key: string]: number} = {};
      item.project.forEach((val: any) => {
        project[val.project] = val.count;
      });
      analytics[item.owner] = {
        leadAnalytics: {
          project: project,
          location: {...analytics[item.owner].leadAnalytics.location},
          budget: {...analytics[item.owner].leadAnalytics.budget},
          stage: {...analytics[item.owner].leadAnalytics.stage},
          propertyType: {},
          propertyStage: {},
          lost_reason: {},
          not_int_reason: {},
        },
      };
    });
  }
  const propertyTypeApiData = {
    uid: user.uid,
    parameter: 'property_type',
    start_date: startDate,
    end_date: endDate,
  };
  let propertyTypeRes: any = {};
  try {
    propertyTypeRes = await axios.post(
      BACKEND_URL + '/leads/interestedReport/associate',
      propertyTypeApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Interested Property Type Error - ', error);
  }
  // console.log('propertyTypeApiData',propertyTypeApiData)
  // console.log('propertyTypeRes',propertyTypeRes)
  if (propertyTypeRes.data.report) {
    propertyTypeRes.data.report.forEach((item: any) => {
      let propertyType: {[key: string]: number} = {};
      item.property_type.forEach((val: any) => {
        propertyType[val.property_type] = val.count;
      });
      analytics[item.owner] = {
        leadAnalytics: {
          propertyType: propertyType,
          project: {...analytics[item.owner].leadAnalytics.project},
          location: {...analytics[item.owner].leadAnalytics.location},
          budget: {...analytics[item.owner].leadAnalytics.budget},
          stage: {...analytics[item.owner].leadAnalytics.stage},
          propertyStage: {},
          lost_reason: {},
          not_int_reason: {},
        },
      };
    });
  }

  const propertyStageApiData = {
    uid: user.uid,
    parameter: 'property_stage',
    start_date: startDate,
    end_date: endDate,
  };
  let propertyStageRes: any = {};
  try {
    propertyStageRes = await axios.post(
      BACKEND_URL + '/leads/interestedReport/associate',
      propertyStageApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Property Stage Error - ', error);
  }
// console.log('propertyStageApiData',propertyStageApiData)
  if (propertyStageRes.data.report) {
    propertyStageRes.data.report.forEach((item: any) => {
      let propertyStage: {[key: string]: number} = {};
      item.property_stage.forEach((val: any) => {
        propertyStage[val.property_stage] = val.count;
      });
      analytics[item.owner] = {
        leadAnalytics: {
          propertyStage: propertyStage,
          propertyType: {
            ...analytics[item.owner].leadAnalytics.propertyType,
          },
          project: {...analytics[item.owner].leadAnalytics.project},
          location: {...analytics[item.owner].leadAnalytics.location},
          budget: {...analytics[item.owner].leadAnalytics.budget},
          stage: {...analytics[item.owner].leadAnalytics.stage},
          lost_reason: {},
          not_int_reason: {},
        },
      };
    });
  }

  const lostReasonApiData = {
    uid: user.uid,
    parameter: 'lost_reason',
    stage: 'LOST',
    start_date: startDate,
    end_date: endDate,
  };
  let lostReasonRes: any = {};
  try {
    lostReasonRes = await axios.post(
      BACKEND_URL + '/leads/reasonReport/associate',
      lostReasonApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Lost Reason Error - ', error);
  }

  if (lostReasonRes.data.report) {
    lostReasonRes.data.report.forEach((item: any) => {
      let lost_reason: {[key: string]: number} = {};
      item.lost_reason.forEach((val: any) => {
        lost_reason[val.lost_reason] = val.count;
      });
      analytics[item.owner] = {
        leadAnalytics: {
          lost_reason: lost_reason,
          propertyStage: {
            ...analytics[item.owner].leadAnalytics.propertyStage,
          },
          propertyType: {
            ...analytics[item.owner].leadAnalytics.propertyType,
          },
          project: {...analytics[item.owner].leadAnalytics.project},
          location: {...analytics[item.owner].leadAnalytics.location},
          budget: {...analytics[item.owner].leadAnalytics.budget},
          stage: {...analytics[item.owner].leadAnalytics.stage},
          not_int_reason: {},
        },
      };
    });
  }

  const notIntApiData = {
    uid: user.uid,
    parameter: 'not_int_reason',
    stage: 'NOT INTERESTED',
    start_date: startDate,
    end_date: endDate,
  };
  // console.log('NIAPi',notIntApiData)
  let notIntRes: any = {};
  try {
    notIntRes = await axios.post(
      BACKEND_URL + '/leads/reasonReport/associate',
      notIntApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Not Int Reason Error - ', error);
  }
  // console.log('NIRES',notIntRes)
  if (notIntRes.data.report) {
    notIntRes.data.report.forEach((item: any) => {
      let not_int_reason: {[key: string]: number} = {};
      item.not_int_reason.forEach((val: any) => {
        not_int_reason[val.not_int_reason] = val.count;
      });
      analytics[item.owner] = {
        leadAnalytics: {
          not_int_reason: not_int_reason,
          lost_reason: {
            ...analytics[item.owner].leadAnalytics.lost_reason,
          },
          propertyStage: {
            ...analytics[item.owner].leadAnalytics.propertyStage,
          },
          propertyType: {
            ...analytics[item.owner].leadAnalytics.propertyType,
          },
          project: {...analytics[item.owner].leadAnalytics.project},
          location: {...analytics[item.owner].leadAnalytics.location},
          budget: {...analytics[item.owner].leadAnalytics.budget},
          stage: {...analytics[item.owner].leadAnalytics.stage},
        },
      };
    });
  }
  const pendingTaskApiData = {
    uid: user.uid,
    parameter: 'type',
    status: 'Pending',
    start_date: startDate,
    end_date: endDate,
  };
  let pendingTaskRes: any = {};
  try {
    pendingTaskRes = await axios.post(
      BACKEND_URL + '/tasks/tasksReport/associate',
      pendingTaskApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Pending Tasks Error - ', error);
  }
let A= new Date().getDate()
let B= new Date(pendingTaskApiData.start_date).getDate()
  // console.log('A --',A)
  // console.log('B --',B)
  // console.log('Pending -- ',moment().startOf('day').toDate())
  // console.log('Pending date--',pendingTaskApiData.start_date,'--To-- ',pendingTaskApiData.end_date)

  
    if (pendingTaskRes.data.report) {
      if(A===B || pendingTaskApiData.start_date==='' )
  {
    pendingTaskRes.data.report.forEach((item: any) => {
      let pending: {[key: string]: number} = {};
      item.type.forEach((val: any) => {
        pending[val.type] = val.count;
        if (val.type === 'Site Visit' || val.type === 'Meeting') {
          pendingCount += val.count;
        }
      });
      if (analytics[item.owner]) {
        analytics[item.owner].totalTaskCount = {
          Pending: pending,
          Overdue: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
          Completed: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
        };
      } else {
        analytics[item.owner] = {
          totalTaskCount: {
            Pending: pending,
            Overdue: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
            Completed: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
          },
        };
      }
    });
  }}
  const overdueTaskApiData = {
    uid: user.uid,
    parameter: 'type',
    status: 'Overdue',
    start_date: startDate,
    end_date: endDate,
  };

  let overdueTaskRes: any = {};
  try {
    overdueTaskRes = await axios.post(
      BACKEND_URL + '/tasks/tasksReport/associate',
      overdueTaskApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Overdue Tasks Error - ', error);
  }

  if (overdueTaskRes.data.report) {
    overdueTaskRes.data.report.forEach((item: any) => {
      let overdue: {[key: string]: number} = {};
      item.type.forEach((val: any) => {
        overdue[val.type] = val.count;
        if (val.type === 'Site Visit' || val.type === 'Meeting') {
          pendingCount += val.count;
        }
      });
      if (analytics[item.owner] === undefined) {
        analytics[item.owner] = {
          totalTaskCount: {
            Pending: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
            Overdue: overdue,
            Completed: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
          },
        };
      } else if (analytics[item.owner].totalTaskCount === undefined) {
        analytics[item.owner].totalTaskCount = {
          Pending: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
          Overdue: overdue,
          Completed: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
        };
      } else {
        analytics[item.owner].totalTaskCount = {
          Pending: {...analytics[item.owner].totalTaskCount.Pending},
          Overdue: overdue,
          Completed: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
        };
      }
    });
  }

  const completedTaskApiData = {
    uid: user.uid,
    parameter: 'type',
    status: 'Completed',
    start_date: startDate,
    end_date: endDate,
  };
  let completedTaskRes: any = {};
  try {
    completedTaskRes = await axios.post(
      BACKEND_URL + '/tasks/tasksReport/associate',
      completedTaskApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Completed Task Error - ', error);
  }

  if (completedTaskRes.data.report) {
    completedTaskRes.data.report.forEach((item: any) => {
      let completed: {[key: string]: number} = {};
      item.type.forEach((val: any) => {
        completed[val.type] = val.count;
        if (val.type === 'Site Visit' || val.type === 'Meeting') {
          completedCount += val.count;
        }
      });
      if (analytics[item.owner] === undefined) {
        analytics[item.owner] = {
          totalTaskCount: {
            Pending: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
            Overdue: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
            Completed: completed,
          },
        };
      } else if (analytics[item.owner].totalTaskCount === undefined) {
        analytics[item.owner].totalTaskCount = {
          Pending: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
          Overdue: {Meeting: 0, 'Call Back': 0, 'Site Visit': 0},
          Completed: completed,
        };
      } else {
        analytics[item.owner].totalTaskCount = {
          Pending: {...analytics[item.owner].totalTaskCount.Pending},
          Overdue: {...analytics[item.owner].totalTaskCount.Overdue},
          Completed: completed,
        };
      }
    });
  }
  const callLogsApiData = {
    uid: user.uid,
    start_date: startDate,
    end_date: endDate,
  };
  let callLogsRes: any = {};
  try {
    callLogsRes = await axios.post(
      BACKEND_URL + '/callLogs/callingReport',
      callLogsApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('callLogs Analytics Error - ', error);
  }

  const interestedTrendApiData = {
    uid: user.uid,
    parameter: 'stage_change_at',
    start_date: startDate,
    end_date: endDate,
  };
  let interestedTrendRes: any = {};
  try {
    interestedTrendRes = await axios.post(
      BACKEND_URL + '/leads/interestedReport/associate',
      interestedTrendApiData,
      {headers: {'x-access-token': TOKEN}},
    );
  } catch (error) {
    console.log('Interested Trend Analytics Error - ', error);
  }

  Object.keys(analytics).forEach((key) => {
    analytics[key].interestedTrend = {};
    analytics[key].overdue = {};
    analytics[key].pending = {};
    analytics[key].taskAnalytics = {};
    analytics[key].callLogAnalytics = {};
    analytics[key].todayFollowUp = {};
    if (analytics[key].totalTaskCount === undefined) {
      analytics[key].totalTaskCount = {};
    }
    if (analytics[key].leadAnalytics === undefined) {
      analytics[key].leadAnalytics = {stage: {}};
    }
  });

  let callLogReport: any[] = [];

  callLogsRes.data.report.forEach((item: any) => {
    let row: any = {};
    if (item.duration) {
      item.duration.forEach((dur: any) => {
        if (row[item.owner]) {
          row[item.owner] = {
            ...row[item.owner],
            [callingType(dur.duration)]: dur.count,
          };
        } else {
          row[item.owner] = {[callingType(dur.duration)]: dur.count};
        }
      });
    }
    callLogReport.push(row);
  });

  dispatcher(
    setAnalytics({
      analyticsData: analytics,
      callLogAnalytics: Object.assign({}, ...callLogsRes.data.ChartCount),
      callLogReport,
      interestedTrend: interestedTrendRes.data.ChartCount,
      taskCount: {completedCount, pendingCount},
    }),
  );
};

export const fetchAnalyticsUser = async (
  user: any,
  dispatcher: any,
  type: 'All' | 'MTD' | 'PM',
) => {
  let leadAnalytics: any = {};
  const {startDate, endDate} = getDate(type);
  const callLogsApiData = {
    uid: user.uid,
    start_date: startDate,
    end_date: endDate,
  };
// console.log(startDate,endDate)
  const callLogsRes = await axios.post(
    BACKEND_URL + '/callLogs/callingReport',
    callLogsApiData,
    {headers: {'x-access-token': TOKEN}},
  );
  let callLogAnalytics: any = {};
  if (callLogsRes.data) {
    callLogAnalytics = Object.assign({}, ...callLogsRes.data.ChartCount);
  }
  let callLogReport: any[] = [];
  callLogsRes.data.report.forEach((item: any) => {
    let row: any = {};
    if (item.duration) {
      item.duration.forEach((dur: any) => {
        if (row[item.created_at]) {
          row[item.created_at] = {
            ...row[item.created_at],
            [callingType(dur.duration)]: dur.count,
          };
        } else {
          row[item.created_at] = {[callingType(dur.duration)]: dur.count};
        }
      });
    }
    callLogReport.push(row);
  });

  const interestedTrendApiData = {
    uid: user.uid,
    parameter: 'stage_change_at',
    start_date: startDate,
    end_date: endDate,
  };
  const interestedTrendRes = await axios.post(
    BACKEND_URL + '/leads/interestedReport/associate',
    interestedTrendApiData,
    {headers: {'x-access-token': TOKEN}},
  );
  let interestedTrend: any = {};
  if (interestedTrendRes.data.ChartCount) {
    interestedTrend = Object.assign({}, ...interestedTrendRes.data.ChartCount);
  }

  const feedbackApiData = {
    uid: user.uid,
    start_date: startDate,
    end_date: endDate,
  };
  const feedbackRes = await axios.post(
    BACKEND_URL + '/leads/feedbackReport/associate',
    feedbackApiData,
    {headers: {'x-access-token': TOKEN}},
  );
  if (feedbackRes.data) {
    leadAnalytics.stage = feedbackRes.data.ChartCount;
  }
// console.log("feedbackRes",feedbackRes.data)
// console.log("feedbackApiData",feedbackApiData)
  const budgetApiData = {
    uid: user.uid,
    parameter: 'budget',
    start_date: startDate,
    end_date: endDate,
  };
  const budgetRes = await axios.post(
    BACKEND_URL + '/leads/interestedReport/associate',
    budgetApiData,
    {headers: {'x-access-token': TOKEN}},
  );
  if (budgetRes.data) {
    leadAnalytics.budget = budgetRes.data.ChartCount;
  }

  const locationApiData = {
    uid: user.uid,
    parameter: 'location',
    start_date: startDate,
    end_date: endDate,
  };
  const locationRes = await axios.post(
    BACKEND_URL + '/leads/interestedReport/associate',
    locationApiData,
    {headers: {'x-access-token': TOKEN}},
  );
  if (locationRes.data) {
    leadAnalytics.location = locationRes.data.ChartCount;
  }

  const projectApiData = {
    uid: user.uid,
    parameter: 'project',
    start_date: startDate,
    end_date: endDate,
  };
  const projectRes = await axios.post(
    BACKEND_URL + '/leads/interestedReport/associate',
    projectApiData,
    {headers: {'x-access-token': TOKEN}},
  );
  if (projectRes.data) {
    leadAnalytics.project = projectRes.data.ChartCount;
  }

  let completedAnalytics: any = {};
  let pendingAnalytics: any = {};
  let overdueAnalytics: any = {};

  const completedTaskApiData = {
    uid: user.uid,
    parameter: 'type',
    status: 'Completed',
    start_date: startDate,
    end_date: endDate,
  };
  const completedTaskRes = await axios.post(
    BACKEND_URL + '/tasks/tasksReport/associate',
    completedTaskApiData,
    {headers: {'x-access-token': TOKEN}},
  );
  if (completedTaskRes.data) {
    let obj: {
      [key: string]: {
        'Call Back': number;
        'Site Visit': number;
        Meeting: number;
      };
    } = {};
    completedTaskRes.data.report.forEach((item: any) => {
      obj[item.completed_at] = {
        'Call Back': item.Call_Back,
        Meeting: item.Meeting,
        'Site Visit': item.Site_Visit,
      };
    });
    completedAnalytics.chart = completedTaskRes.data.ChartCount;
    completedAnalytics.report = JSON.parse(JSON.stringify(obj));
  }

  const overdueTaskApiData = {
    uid: user.uid,
    parameter: 'type',
    status: 'Overdue',
    start_date: startDate,
    end_date: endDate,
  };
  const overdueTaskRes = await axios.post(
    BACKEND_URL + '/tasks/tasksReport/associate',
    overdueTaskApiData,
    {headers: {'x-access-token': TOKEN}},
  );
  if (overdueTaskRes.data) {
    let obj: {
      [key: string]: {
        'Call Back': number;
        'Site Visit': number;
        Meeting: number;
      };
    } = {};
    overdueTaskRes.data.report.forEach((item: any) => {
      obj[item.due_date] = {
        'Call Back': item.Call_Back,
        Meeting: item.Meeting,
        'Site Visit': item.Site_Visit,
      };
    });
    overdueAnalytics.report = obj;
    overdueAnalytics.chart = overdueTaskRes.data.ChartCount;
  }

  const pendingTaskApiData = {
    uid: user.uid,
    parameter: 'type',
    status: 'Pending',
    start_date: startDate,
    end_date: endDate,
  };
  const pendingTaskRes = await axios.post(
    BACKEND_URL + '/tasks/tasksReport/associate',
    pendingTaskApiData,
    {headers: {'x-access-token': TOKEN}},
  );
  if (pendingTaskRes.data) {
    let obj: {
      [key: string]: {
        'Call Back': number;
        'Site Visit': number;
        Meeting: number;
      };
    } = {};
    pendingTaskRes.data.report.forEach((item: any) => {
      obj[item.due_date] = {
        'Call Back': item.Call_Back,
        Meeting: item.Meeting,
        'Site Visit': item.Site_Visit,
      };
    });
    pendingAnalytics.report = obj;
    pendingAnalytics.chart = pendingTaskRes.data.ChartCount;
  }

  const taskCountApiData = {
    uid: user.uid,
    parameter: 'type',
    start_date: startDate,
    end_date: endDate,
  };
  // console.log("apidata  ",taskCountApiData)
  const taskCountRes = await axios.post(
    BACKEND_URL + '/tasks/tasksSalesCategoryCount/associate',
    taskCountApiData,
    {headers: {'x-access-token': TOKEN}},
  );
  const counts = taskCountRes.data.arr;
  // console.log(taskCountRes.data)
  const taskCount = {
    pendingCount:
      counts['Pending']['Site Visit'] +
      counts['Pending']['Meeting'] +
      counts['Overdue']['Site Visit'] +
      counts['Overdue']['Meeting'],
    completedCount:
      counts['Completed']['Site Visit'] + counts['Completed']['Meeting'],
  };
  

  dispatcher(
    setAnalytics({
      leadAnalytics,
      callLogAnalytics,
      interestedTrend,
      completedAnalytics,
      pendingAnalytics,
      overdueAnalytics,
      callLogReport,
      taskCount,
    }),
  );
};

export const sortDates = (a: string, b: string) => {
  if (moment(a, 'DD-MM-YYYY') > moment(b, 'DD-MM-YYYY')) {
    return 1;
  } else {
    return -1;
  }
};

export const sortAnalyticsTasks = (a: any, b: any) => {
  if (moment(a.date, 'DD-MM-YYYY') > moment(b.date, 'DD-MM-YYYY')) {
    return 1;
  } else {
    return -1;
  }
};

export const sortAnalytics = (
  a: {[key: string]: string},
  b: {[key: string]: string},
) => {
  if (Object.values(a)[0] > Object.values(b)[0]) {
    return -1;
  } else {
    return 1;
  }
};

export const arrangeOrgTasksAnalytics = (
  data: any,
  type: 'Pending' | 'Completed' | 'Overdue',
) => {
  let temp: {[key: string]: number} = {
    'Call Back': 0,
    'Site Visit': 0,
    Meeting: 0,
  };
  let tempTableData: any[] = [];
  Object.keys(data).forEach((key) => {
    const totalTaskCount = data[key].totalTaskCount;
    tempTableData.push({[key]: totalTaskCount[type]});
  });
  Object.values(data).forEach((userAnalytics: any) => {
    const totalTaskCount = userAnalytics.totalTaskCount;
    Object.keys(temp).forEach((taskType) => {
      if (totalTaskCount[type] && totalTaskCount[type][taskType]) {
        temp[taskType] += totalTaskCount[type][taskType];
      }
    });
  });

  return {data: temp, tempTableData};
};

export const arrangeAnalyticsData = (
  analytics: any,
  type:
    | 'budget'
    | 'project'
    | 'location'
    | 'propertyType'
    | 'propertyStage'
    | 'not_int_reason'
    | 'lost_reason',
) => {
  if (analytics.leadAnalytics) {
    if (analytics.leadAnalytics[type] && analytics.leadAnalytics[type]['']) {
      delete analytics.leadAnalytics[type][''];
    }
    let data = {...analytics.leadAnalytics[type]};
    let sum = 0;
    Object.values(data).forEach((val: any) => {
      sum += val;
    });
    const arrayOfObj = Object.entries(data)
      .map((e: any[]) => ({[e[0]]: e[1]}))
      .sort(sortAnalytics);
    let sortedData: {[key: string]: string} = {};
    arrayOfObj.forEach((item) => {
      sortedData = {...sortedData, ...item};
    });
    return {sum, sortedData};
  }

  if (analytics.analyticsData) {
    let sum = 0;
    const dataTotals: any = {};
    let tempTableData: any[] = [];
    Object.keys(analytics.analyticsData).forEach((key) => {
      const leadAnalytics = analytics.analyticsData[key].leadAnalytics;
      tempTableData.push({[key]: leadAnalytics[type]});
    });
    Object.values(analytics.analyticsData).forEach((userAnalytics: any) => {
      const leadAnalytics = userAnalytics.leadAnalytics;
      if (leadAnalytics[type] && leadAnalytics[type]['']) {
        delete leadAnalytics[type][''];
      }
      let data = {...leadAnalytics[type]};
      Object.keys(data).forEach((key) => {
        sum += data[key];
        if (dataTotals[key]) {
          dataTotals[key] += data[key];
        } else {
          dataTotals[key] = data[key];
        }
      });
    });
    const arrayOfObj = Object.entries(dataTotals)
      .map((e: any[]) => ({[e[0]]: e[1]}))
      .sort(sortAnalytics);
    let sortedData: {[key: string]: string} = {};
    arrayOfObj.forEach((item) => {
      sortedData = {...sortedData, ...item};
    });
    return {sortedData, tempTableData, sum};
  }
};

export const sortAnalyticsTable = (a: any, b: any) => {
  if (a.Total > b.Total) {
    return -1;
  } else {
    return 1;
  }
};

export const sortAnalyticsCallLogs = (a: any, b: any) => {
  if (moment(a.Date, 'DD-MM-YYYY') < moment(b.Date, 'DD-MM-YYYY')) {
    return 1;
  } else {
    return -1;
  }
};
