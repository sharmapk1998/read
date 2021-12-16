const tasksReducer = (
  state = {},
  action: {type: 'SET_ALL_TASKS' | 'RESET_TASKS'; payload: any},
) => {
  switch (action.type) {
    case 'SET_ALL_TASKS':
      return {...state, ...action.payload};
    case 'RESET_TASKS': {
      return {};
    }
    default:
      return state;
  }
};

export default tasksReducer;
