const analyticsReducer = (
  state = {filters: {teamWise: false}},
  action: {
    type: 'SET_ANALYTICS' | 'CLEAR_ANALYTICS';
    payload: any;
  },
) => {
  switch (action.type) {
    case 'SET_ANALYTICS':
      return {...state, ...action.payload};
    case 'CLEAR_ANALYTICS':
      return {filters: {teamWise: false}};
    default:
      return state;
  }
};

export default analyticsReducer;
