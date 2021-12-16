import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import {
  setOrgUsers,
  setTeamMap,
  updateUser,
  updateUsersList,
} from '../redux/actions';

export const uploadUserImage = async (
  uri: string,
  uid: string,
  deletePrev: boolean,
  dispatcher: any,
) => {
  const path = `userImages/${uid}`;
  const reference = storage().ref(path);
  if (deletePrev) {
    await reference.delete();
  }
  try {
    const snapshot = await reference.putFile(uri);
    const url = await reference.getDownloadURL();
    dispatcher(updateUser({user_image: url}));
    try {
      await firestore().collection('users').doc(uid).set(
        {
          user_image: url,
        },
        {merge: true},
      );
    } catch (error) {
      console.log('User Image Upload Error', error);
      Snackbar.show({
        text: 'Error Try Again!',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  } catch (error) {
    console.log('User Image Upload Error', error);
    Snackbar.show({
      text: 'Error Try Again!',
      duration: Snackbar.LENGTH_SHORT,
    });
  }
};

let usersList: string[] = [];

const createUsersList = (
  email: string,
  data: {[key: string]: {uid: string; email: string}[]},
) => {
  if (data[email] === undefined) {
    return;
  } else {
    data[email].forEach((user) => {
      if (usersList.includes(user.uid)) {
        return;
      }
      usersList.push(user.uid);
      createUsersList(user.email, data);
    });
  }
};

export const setUsersList = async (user: any, dispatcher: any) => {
  if (user.organization_id === undefined) {
    return;
  }
  if (user.role === 'Lead Manager') {
    if (
      (user.branchPermission && user.branchPermission.includes('All')) ||
      user.branchPermission === undefined
    ) {
      dispatcher(updateUsersList([user.uid]));
    } else {
      const permissions: string[] = user.branchPermission;
      const usersData = await firestore()
        .collection('usersList')
        .where('organization_id', '==', user.organization_id)
        .get();
      if (usersData) {
        let orgUsers: any[] = [];
        usersData.docs.forEach((usersList) => {
          Object.keys(usersList.data()).forEach((key) => {
            if (key !== 'count' && key !== 'organization_id') {
              orgUsers.push(usersList.data()[key]);
            }
          });
        });
        orgUsers = orgUsers.filter((user) => permissions.includes(user.branch));
        dispatcher(setOrgUsers(orgUsers));
        let uidList = orgUsers.map((item) => item.uid);
        if (!uidList.includes(user.uid)) {
          uidList = [...uidList, user.uid];
        }
        dispatcher(updateUsersList(uidList));
      }
      return;
    }
  }
  if (user.role === 'Sales') {
    dispatcher(updateUsersList([user.uid]));
  }
  const usersData = await firestore()
    .collection('usersList')
    .where('organization_id', '==', user.organization_id)
    .get();
  if (usersData) {
    const orgUsers: any[] = [];
    usersData.docs.forEach((usersList) => {
      Object.keys(usersList.data()).forEach((key) => {
        if (key !== 'count' && key !== 'organization_id') {
          orgUsers.push(usersList.data()[key]);
        }
      });
    });
    dispatcher(setOrgUsers(orgUsers));
    if (user.role === 'Team Lead') {
      let mapReportingTo: {[key: string]: {email: string; uid: string}[]} = {};
      orgUsers.forEach((item: any) => {
        if (item.reporting_to === '') {
          return;
        }
        if (mapReportingTo[item.reporting_to]) {
          mapReportingTo[item.reporting_to].push({
            email: item.user_email,
            uid: item.uid,
          });
        } else {
          mapReportingTo[item.reporting_to] = [
            {email: item.user_email, uid: item.uid},
          ];
        }
      });
      createUsersList(user.user_email, mapReportingTo);
      dispatcher(updateUsersList([...usersList, user.uid]));
    }
  }
};

export const createTeamMap = (usersList: any[], dispatcher: any) => {
  const teamMap: {[key: string]: string} = {};
  const nameMap: {[key: string]: string} = {};
  const reportMap: {[key: string]: string[]} = {};
  const countTeamMap: {[key: string]: any} = {};
  usersList.forEach((user) => {
    teamMap[user.uid] = user.team;
    nameMap[user.uid] = user.user_name;
    if (countTeamMap[user.team]) {
      countTeamMap[user.team] += 1;
    } else {
      countTeamMap[user.team] = 1;
    }
    if (reportMap[user.reporting_to]) {
      reportMap[user.reporting_to].push(user.uid);
    } else {
      reportMap[user.reporting_to] = [user.uid];
    }
  });
  delete reportMap[''];
  dispatcher(setTeamMap({teamMap, nameMap, countTeamMap, reportMap}));
};

export const updateLeadView = async (
  feildData: {[key: string]: string[]},
  user: any,
) => {
  try {
    await firestore().collection('users').doc(user.uid).set(
      {
        leadView: feildData,
      },
      {merge: true},
    );
    setTimeout(
      () =>
        Snackbar.show({
          text: 'Updated Lead Views!!',
          duration: Snackbar.LENGTH_SHORT,
        }),
      50,
    );
  } catch (error) {
    console.log('Change Lead View Error', error);
    Snackbar.show({
      text: 'Error Try Again!',
      duration: Snackbar.LENGTH_SHORT,
    });
  }
};
