const callReducer = (
  state = {callLogs: undefined},
  action: {type: 'SET_CALL_LOGS'; payload: any},
) => {
  switch (action.type) {
    case 'SET_CALL_LOGS':
      return {callLogs: [...action.payload]};
    default:
      return state;
  }
};

export default callReducer;
