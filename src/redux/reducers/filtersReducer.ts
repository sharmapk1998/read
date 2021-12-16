const filtersReducer = (
  state = {
    searchString: '',
    leadFilter: {},
    activeFilters: {},
    analyticsFilter: {
      teamWise: false,
      analyticsType: 'All',
    },
    sort: {
      FRESH: true,
      INTERESTED: true,
      FOLLWUP: true,
      MISSED: false,
      CALLBACK: true,
      WON: true,
      PROSPECT: true,
      DRILLDOWN: true,
      TASKS: true,
      CALL: true,
    },
  },
  action: {
    type:
      | 'SET_LEAD_FILTER_OBJECT'
      | 'SET_FILTERS'
      | 'SET_ANALYTICS_FILTERS'
      | 'SET_SORT'
      | 'SET_SEARCH_STRING';
    payload: any;
  },
) => {
  switch (action.type) {
    case 'SET_LEAD_FILTER_OBJECT':
      return {...state, leadFilter: action.payload};
    case 'SET_FILTERS':
      return {...state, activeFilters: action.payload};
    case 'SET_ANALYTICS_FILTERS':
      return {
        ...state,
        analyticsFilter: {...state.analyticsFilter, ...action.payload},
      };
    case 'SET_SORT':
      return {...state, sort: {...state.sort, ...action.payload}};
    case 'SET_SEARCH_STRING':
      return {...state, searchString: action.payload};
    default:
      return state;
  }
};

export default filtersReducer;
