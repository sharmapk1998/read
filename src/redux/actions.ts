import {LEAD_TYPE} from '../values/customTypes';

export const updateUser = (user: {}) => {
  return {
    type: 'SET_USER',
    payload: user,
  };
};

export const updateLeads = (leads: any[] | undefined) => {
  return {
    type: 'SET_LEADS',
    payload: leads,
  };
};

export const updateMissedLeads = (leads: any[] | undefined) => {
  return {
    type: 'SET_MISSED',
    payload: leads,
  };
};

export const updateNotes = (notesData: any[]) => {
  return {
    type: 'SETNOTES',
    payload: notesData,
  };
};

export const updateAttachments = (attachments: any[]) => {
  return {
    type: 'SETATT',
    payload: attachments,
  };
};

export const updateAttachmentsProgress = (progress: number) => {
  return {
    type: 'SETPROGRESS',
    payload: progress,
  };
};

export const updateAttachmentsLoad = (load: boolean) => {
  return {
    type: 'SETLOAD',
    payload: load,
  };
};

export const updateConstants = (constants: any) => {
  return {
    type: 'SET_CONSTANTS',
    payload: constants,
  };
};

export const updateOrgConstants = (constants: any) => {
  return {
    type: 'SET_ORG_CONSTANTS',
    payload: constants,
  };
};

export const updateProjects = (constants: any) => {
  return {
    type: 'SET_PROJECTS',
    payload: constants,
  };
};

export const updateAllTasks = (tasks: {}) => {
  return {
    type: 'SET_ALL_TASKS',
    payload: tasks,
  };
};

export const updateAllLeadCount = (leadCount: {}) => {
  return {
    type: 'SET_ALL_COUNT',
    payload: leadCount,
  };
};

export const updateLeadType = (type: LEAD_TYPE) => {
  return {
    type: 'SET_LEAD_TYPE',
    payload: type,
  };
};

export const updateCallLogs = (callLogs: any[]) => {
  return {
    type: 'SET_CALL_LOGS',
    payload: callLogs.reverse(),
  };
};

export const updateGroupedLeads = (data: any) => {
  return {
    type: 'SET_GROUPED_LEADS',
    payload: data,
  };
};

export const resetGroupedLeads = () => {
  return {
    type: 'SET_GROUPED_LEADS',
    payload: {},
  };
};

export const resetTasks = () => {
  return {
    type: 'RESET_TASKS',
    payload: [],
  };
};

export const setNotificationData = (payload: {} | undefined) => {
  return {
    type: 'SET_NOTIFICATION_DATA',
    payload,
  };
};

export const incLeadCount = (leadType: LEAD_TYPE) => {
  return {
    type: 'INC_COUNT',
    payload: leadType,
  };
};

export const decLeadCount = (leadType: LEAD_TYPE) => {
  return {
    type: 'DEC_COUNT',
    payload: leadType,
  };
};

export const setLeadsFilterObject = (filterObject: {}) => {
  return {
    type: 'SET_LEAD_FILTER_OBJECT',
    payload: filterObject,
  };
};

export const setActiveFilters = (filters: {}) => {
  return {
    type: 'SET_FILTERS',
    payload: filters,
  };
};

export const updateUsersList = (usersList: any) => {
  return {
    type: 'SET_USERS_LIST',
    payload: usersList,
  };
};

export const clearUserState = () => {
  return {
    type: 'ClEAR_USER',
    payload: {},
  };
};

export const setOrgUsers = (usersList: any[]) => {
  return {
    type: 'SET_ORG_USERS_LIST',
    payload: usersList,
  };
};

export const setAnalytics = (analytics: any) => {
  return {
    type: 'SET_ANALYTICS',
    payload: {...analytics, exists: true},
  };
};

export const setAnalyticsFilter = (filters: any) => {
  return {
    type: 'SET_ANALYTICS_FILTERS',
    payload: filters,
  };
};

export const setTeamMap = (teamMap: any) => {
  return {
    type: 'SET_TEAM_MAP',
    payload: teamMap,
  };
};

export const clearAnalytics = () => {
  return {
    type: 'CLEAR_ANALYTICS',
    payload: {},
  };
};

export const toggleSelectLeads = (value?: boolean) => {
  if (value === false) {
    return {
      type: 'HIDE_SELECT_LEAD',
      payload: {},
    };
  }
  return {
    type: 'TOGGLE_SELECT_LEADS',
    payload: {},
  };
};

export const setSelectedLeads = (leads: string[]) => {
  return {
    type: 'SET_SELECTED_LEADS',
    payload: leads,
  };
};

export const setSort = (sortObj: any) => {
  return {
    type: 'SET_SORT',
    payload: sortObj,
  };
};

export const setFreshLeads = (leads: any[] | undefined) => {
  return {
    type: 'SET_FRESH_LEADS',
    payload: leads,
  };
};

export const setSearchStringGlobal = (search: string) => {
  return {
    type: 'SET_SEARCH_STRING',
    payload: search,
  };
};

export const setGlobalRefresh = (value: boolean) => {
  return {
    type: 'SET_REFRESH',
    payload: value,
  };
};

export const setRemoteNotification = (value: boolean) => {
  return {
    type: 'SET_REMOTE_NOTIFICATION',
    payload: value,
  };
};
