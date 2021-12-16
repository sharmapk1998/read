const attachmentReducer = (
  state = {
    load: false,
    progress: 0,
    attachments: [],
  },
  action: {type: 'SETATT' | 'SETPROGRESS' | 'SETLOAD'; payload: any},
) => {
  switch (action.type) {
    case 'SETATT':
      return {...state, attachments: [...action.payload]};
    case 'SETLOAD':
      return {...state, load: action.payload};
    case 'SETPROGRESS':
      return {...state, progress: action.payload};
    default:
      return state;
  }
};

export default attachmentReducer;
