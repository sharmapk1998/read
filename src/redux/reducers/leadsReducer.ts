const leadsReducer = (
  state = {
    leadType: '',
    groupedLeads: {},
    selectLeads: false,
    selectedLeads: [],
  },
  action: {
    type:
      | 'SET_LEADS'
      | 'SET_MISSED'
      | 'SET_FRESH_LEADS'
      | 'SET_LEAD_TYPE'
      | 'SET_GROUPED_LEADS'
      | 'TOGGLE_SELECT_LEADS'
      | 'HIDE_SELECT_LEAD'
      | 'SET_SELECTED_LEADS';

    payload: any;
  },
) => {
  switch (action.type) {
    case 'SET_LEADS':
      return {...state, leadsData: action.payload};
    case 'SET_MISSED':
      return {...state, missedLeads: action.payload};
    case 'SET_FRESH_LEADS':
      return {...state, freshLeads: action.payload};
    case 'SET_LEAD_TYPE':
      return {
        ...state,
        leadType: action.payload,
      };
    case 'SET_GROUPED_LEADS':
      return {
        ...state,
        groupedLeads: action.payload,
      };
    case 'TOGGLE_SELECT_LEADS':
      return {...state, selectLeads: !state.selectLeads};
    case 'HIDE_SELECT_LEAD':
      return {...state, selectLeads: false};
    case 'SET_SELECTED_LEADS':
      return {...state, selectedLeads: action.payload};
    default:
      return state;
  }
};

export default leadsReducer;
