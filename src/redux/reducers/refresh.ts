const refreshReducer = (
  state = {refresh: false},
  action: {type: 'SET_REFRESH'; payload: boolean},
) => {
  switch (action.type) {
    case 'SET_REFRESH':
      return {refresh: action.payload};
    default:
      return state;
  }
};

export default refreshReducer;
