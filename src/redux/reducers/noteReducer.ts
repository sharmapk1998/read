const notesReducer = (state = {}, action: {type: 'SETNOTES'; payload: any}) => {
  switch (action.type) {
    case 'SETNOTES':
      return {notesData: [...action.payload]};
    default:
      return state;
  }
};

export default notesReducer;
