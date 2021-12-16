const valuesReducer = (
  state = {
    orgConstants: {
      locations: [],
      budgets: [],
      projects: [],
      transferReasons: [],
    },
    constants: {},
  },
  action: {
    type: 'SET_CONSTANTS' | 'SET_ORG_CONSTANTS';
    payload: any;
  },
) => {
  switch (action.type) {
    case 'SET_CONSTANTS':
      return {...state, constants: action.payload};
    case 'SET_ORG_CONSTANTS':
      return {...state, orgConstants: action.payload};
    default:
      return state;
  }
};

export default valuesReducer;
