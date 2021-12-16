const userReducer = (
  state = {
    uid: undefined,
    usersList: [],
    organization_users: [],
    userMap: {nameMap: {}, teamMap: {}, countTeamMap: {}},
  },
  action: {
    type:
      | 'SET_USER'
      | 'SET_USERS_LIST'
      | 'ClEAR_USER'
      | 'SET_ORG_USERS_LIST'
      | 'SET_TEAM_MAP';
    payload: any;
  },
) => {
  switch (action.type) {
    case 'SET_USER':
      return {...state, ...action.payload};
    case 'SET_USERS_LIST':
      return {...state, usersList: action.payload};
    case 'SET_ORG_USERS_LIST':
      return {...state, organization_users: action.payload};
    case 'SET_TEAM_MAP':
      return {...state, userMap: action.payload};
    case 'ClEAR_USER':
      return {};
    default:
      return state;
  }
};

export default userReducer;
