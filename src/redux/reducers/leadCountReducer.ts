const leadCountReducer = (
  state: {allLeadCounts: {[key: string]: number}} = {
    allLeadCounts: {
      FRESH: 0,
      INTERESTED: 0,
      FOLLOWUP: 0,
      MISSED: 0,
      CALLBACK: 0,
      WON: 0,
    },
  },
  action: {type: 'SET_ALL_COUNT' | 'INC_COUNT' | 'DEC_COUNT'; payload: any},
) => {
  switch (action.type) {
    case 'SET_ALL_COUNT':
      return {
        ...state,
        allLeadCounts: {...state.allLeadCounts, ...action.payload},
      };
    case 'INC_COUNT':
      return {
        ...state,
        allLeadCounts: {
          ...state.allLeadCounts,
          [action.payload]: state.allLeadCounts[action.payload] + 1,
        },
      };
    case 'DEC_COUNT':
      return {
        ...state,
        allLeadCounts: {
          ...state.allLeadCounts,
          [action.payload]: state.allLeadCounts[action.payload] - 1,
        },
      };
    default:
      return state;
  }
};

export default leadCountReducer;
