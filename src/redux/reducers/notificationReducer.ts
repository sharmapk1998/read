const notificationReducer = (
  state = {notificationData: undefined, remoteNotification: false},
  action: {
    type: 'SET_NOTIFICATION_DATA' | 'SET_REMOTE_NOTIFICATION';
    payload: any;
  },
) => {
  switch (action.type) {
    case 'SET_NOTIFICATION_DATA':
      return {...state, notificationData: action.payload};
    case 'SET_REMOTE_NOTIFICATION':
      return {...state, remoteNotification: action.payload};
    default:
      return state;
  }
};

export default notificationReducer;
