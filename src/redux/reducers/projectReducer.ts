const projectReducer = (
  state = {
    projects: [],
  },
  action: {
    type: 'SET_PROJECTS';
    payload: any;
  },
) => {
  switch (action.type) {
    case 'SET_PROJECTS':
      return {...state, projects: action.payload};

    default:
      return state;
  }
};

export default projectReducer;
