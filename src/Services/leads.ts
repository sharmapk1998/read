import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import {
  decLeadCount,
  incLeadCount,
  setGlobalRefresh,
  updateAllLeadCount,
} from '../redux/actions';
import {customFieldsData, leadDataTemplate} from '../values/dataTemplate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LEAD_TYPE} from '../values/customTypes';
import moment from 'moment';
import functions from '@react-native-firebase/functions';
import {getNotificationTime, properFormat} from './format';
import {firebase} from '@react-native-firebase/messaging';

export const toLocalDate = (timestamp: any) => {
  const utcDate = moment.utc(timestamp.toDate());
  const localDate = moment(utcDate).local();
  return localDate.format('DD/MM/YY');
};

export const arrangeLeads = (leads: any[]) => {
  // console.log(leads)
  const data: any = {};
  leads.forEach((lead) => {
    // const timestamp = lead.lead_assign_time;
    // console.log(lead.stage)
    let timestamp:any
  if(lead.stage === 'MISSED'){
    timestamp= lead.next_follow_up_date_time
  }
  else
  if(lead.stage === 'PROSPECT'){
    timestamp= lead.completed_at
  }
  else
  if(lead.stage === 'WON'|| lead.stage === 'INTERESTED'|| lead.stage === 'CALLBACK' ){   
    timestamp= lead.stage_change_at
  }
  else{
    timestamp= lead.lead_assign_time
  }
    const date = toLocalDate(timestamp);
    if (data[date]) {
      data[date].push({id: lead.Id, data: lead});
    } else {
      data[date] = [{id: lead.Id, data: lead}];
    }
    delete lead.Id;
  });
  return data;
};

export const fetchSingleLead = async (leadId: string) => {
  try {
    const doc = await firestore().collection('contacts').doc(leadId).get();
    if (doc) {
      if (doc.data()) {
        return doc.data();
      }
    }
    return {};
  } catch (error) {
    console.log('Fetch Single Lead Error', error);
    return {};
  }
};

export const createLeadFirebase = async (
  leadData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    source: string;
    owner: any;
    organizationID: string;
    user: any;
    country_code: string;
    alternate_no: string;
  },
  setLoad: (value: boolean) => void,
  navigation: any,
  dispatcher: any,
  onComplete: () => void,
) => {
  setLoad(true);
  let result = false;
  if (leadData.alternate_no !== '') {
    const res = await functions().httpsCallable('checkLead')(
      JSON.stringify({
        organization_id: leadData.organizationID,
        contactList: [leadData.phone, leadData.alternate_no],
      }),
    );
    result = res.data;
  } else {
    const res = await functions().httpsCallable('checkLead')(
      JSON.stringify({
        organization_id: leadData.organizationID,
        contact_no: leadData.phone,
      }),
    );
    result = res.data;
  }

  if (result === true) {
    const docRef = firestore().collection('contacts').doc();
    docRef
      .set(
        {
          ...leadDataTemplate({
            ...leadData,
            timeStamp: firestore.Timestamp.now(),
          }),
          modified_at: firestore.Timestamp.now(),
          stage_change_at: firestore.Timestamp.now(),
        },
        {merge: true},
      )
      .then(() => {
        setLoad(false);
        onComplete();
        navigation.navigate('Leads');
        setTimeout(() => dispatcher(setGlobalRefresh(true)), 1500);
        setTimeout(
          () =>
            Snackbar.show({
              text: 'Lead Created!',
              duration: Snackbar.LENGTH_SHORT,
            }),
          100,
        );
      })
      .catch((error) => {
        setLoad(false);
        Snackbar.show({
          text: 'Error!! Try Again',
          duration: Snackbar.LENGTH_SHORT,
          action:{
            text:"Show Error",
            textColor:'green',
            onPress:()=>{
              setTimeout(
                () =>
              Snackbar.show({
                text: error,
                duration: Snackbar.LENGTH_LONG,
              }),
              2000,
              );
            },
          },
        });
        console.log('Lead Create Error', error);
      });
  } else {
    setLoad(false);
    setTimeout(
      () =>
        Snackbar.show({
          text: 'Contact Already Exists!',
          duration: Snackbar.LENGTH_SHORT,
        }),
      100,
    );
  }
};

export const editLeadFirebase = async (
  leadData: any,
  setLoad: (value: boolean) => void,
  navigation: any,
  leadId: string,
  dispatcher: any,
) => {
  setLoad(true);
  let result = true;
  if (
    leadData.alternate_no !== '' &&
    leadData.alternate_no &&
    leadData.contact_no
  ) {
    const res = await functions().httpsCallable('checkLead')(
      JSON.stringify({
        organization_id: leadData.organization_id,
        contactList: [leadData.contact_no, leadData.alternate_no],
      }),
    );
    result = res.data;
  } else if (leadData.contact_no) {
    const res = await functions().httpsCallable('checkLead')(
      JSON.stringify({
        organization_id: leadData.organization_id,
        contact_no: leadData.contact_no,
      }),
    );
    result = res.data;
  } else if (leadData.alternate_no !== '' && leadData.alternate_no) {
    const res = await functions().httpsCallable('checkLead')(
      JSON.stringify({
        organization_id: leadData.organization_id,
        contact_no: leadData.alternate_no,
      }),
    );
    result = res.data;
  }
  if (result === false) {
    setLoad(false);
    setTimeout(
      () =>
        Snackbar.show({
          text: 'Contact Number Already Exists!',
          duration: Snackbar.LENGTH_SHORT,
        }),
      100,
    );
    return;
  }

  const docRef = firestore().collection('contacts').doc(leadId);
  docRef
    .set({...leadData, modified_at: firestore.Timestamp.now()}, {merge: true})
    .then(() => {
      setLoad(false);
      navigation.pop(2);
      setTimeout(() => dispatcher(setGlobalRefresh(true)), 1500);
      setTimeout(
        () =>
          Snackbar.show({
            text: 'Lead Updated!',
            duration: Snackbar.LENGTH_SHORT,
          }),
        100,
      );
    })
    .catch((error) => {
      setLoad(false);
      Snackbar.show({
        text: 'Error!! Try Again',
        duration: Snackbar.LENGTH_SHORT,
        action:{
          text:"Show Error",
          textColor:'green',
          onPress:()=>{
            setTimeout(
              () =>
            Snackbar.show({
              text: error,
              duration: Snackbar.LENGTH_LONG,
            }),
            2000,
            );
          },
        },
      });
      console.log('Lead Create Error', error);
    });
};

export const setLocalLeadCounts = async (key: LEAD_TYPE, count: number) => {
  await AsyncStorage.setItem(key, String(count));
};

export const getLocalLeadCount = async (
  localdata: any,
  setData: (data: any) => void,
) => {
  let values = await AsyncStorage.multiGet([
    'INTERESTED',
    'FRESH',
    'FOLLOWUP',
    'MISSED',
    'CALLBACK',
    'WON',
  ]);
  const data: any = {};
  values.forEach((item) => {
    if (item[1] != null) {
      data[item[0]] = item[1];
    }
  });
  setData({...localdata, ...data});
};

export const changeLeadStage = (
  leadId: string,
  leadData: {},
  setLoad: (value: boolean) => void,
  navigation: any,
  dispatcher: any,
  taskData: any,
  onComplete: () => void,
) => {
  setLoad(true);
  const batch = firestore().batch();
  const taskCollection = firestore().collection('tasks').doc(leadId);
  const leadCollection = firestore().collection('contacts').doc(leadId);
  batch.update(leadCollection, {
    ...leadData,
    modified_at: firestore.Timestamp.now(),
    stage_change_at: firestore.Timestamp.now(),
  });

  if (taskData && taskData.tasks.length !== 0) {
    batch.update(taskCollection, {...taskData});
  }

  batch
    .commit()
    .then(() => {
      setLoad(false);
      navigation.pop(2);
      setTimeout(() => dispatcher(setGlobalRefresh(true)), 1500);
      onComplete();
      setTimeout(
        () =>
          Snackbar.show({
            text: 'Lead Updated!',
            duration: Snackbar.LENGTH_SHORT,
          }),
        100,
      );
    })
    .catch((error) => {
      setLoad(false);
      Snackbar.show({
        text: 'Error!! Try Again',
        duration: Snackbar.LENGTH_SHORT,
        action:{
          text:"Show Error",
          textColor:'green',
          onPress:()=>{
            setTimeout(
              () =>
            Snackbar.show({
              text: error,
              duration: Snackbar.LENGTH_LONG,
            }),
            2000,
            );
          },
        },
      });
      console.log('change stage error', error);
    });
};

export const resetAllLeadCount = (dispatcher: any) => {
  dispatcher(
    updateAllLeadCount({
      FRESH: 0,
      INTERESTED: 0,
      FOLLOWUP: 0,
      MISSED: 0,
      CALLBACK: 0,
      WON: 0,
    }),
  );
};

export const onEdit = (leadId: string, leadData: any, navigation: any) => {
  if (leadData.stage === 'FRESH' || leadData.stage === 'CALLBACK') {
    const name = leadData.customer_name.split(' ');
    navigation.navigate('AddContact', {
      data: {
        firstName: name[0],
        lastName: name.slice(1).join(' '),
        phone: leadData.contact_no,
        email: leadData.email,
        altPhone: leadData.alternate_no,
        country_code:leadData.country_code,
      },
      leadId,
      edit: true,
    });
  } else {
    navigation.navigate('Interested', {leadData, leadId, edit: true});
  }
};

export const updateLeadCountState = (
  leadTypeBefore: LEAD_TYPE | 'NA',
  leadTypeAfter: LEAD_TYPE | 'NA',
  dispatcher: any,
) => {
  if (leadTypeBefore === leadTypeAfter) {
    return;
  }
  if (leadTypeAfter !== 'NA') {
    dispatcher(incLeadCount(leadTypeAfter));
  }
  if (leadTypeBefore !== 'NA') {
    dispatcher(decLeadCount(leadTypeBefore));
  }
  if (
    leadTypeBefore !== 'CALLBACK' &&
    (leadTypeAfter === 'CALLBACK' || leadTypeAfter === 'INTERESTED')
  ) {
    dispatcher(incLeadCount('FOLLOWUP'));
  } else if (
    leadTypeAfter !== 'INTERESTED' &&
    (leadTypeBefore === 'CALLBACK' || leadTypeBefore === 'INTERESTED')
  ) {
    dispatcher(decLeadCount('FOLLOWUP'));
  }
};

export const getFeildData = (lead: any, index: number, feildData: any) => {
  const dateFeilds = [
    'next_follow_up_date_time',
    'lead_assign_time',
    'created_at',
  ];

  const feild = customFieldsData[feildData[index]];
  if (feild === undefined) {
    return '';
  }
  if (dateFeilds.includes(feild)) {
    if (lead.data[feild] && lead.data[feild] !== '') {
      return getNotificationTime(lead.data[feild]);
    }
    return '';
  } else {
    if (feild === 'email' || feild === 'contact_owner_email') {
      return lead.data[feild].toLowerCase();
    }
    return properFormat(lead.data[feild]);
  }
};

const datesField = [
  'created_at',
  'next_follow_up_date_time',
  'stage_change_at',
  'modified_at',
  'lead_assign_time',
  'feedback_time',
];

export const transferLeads = async (
  options: {
    fresh: boolean;
    tasks: boolean;
    notes: boolean;
    attachments: boolean;
    contactDetails: boolean;
  },
  selectedLeads: any[],
  user: any,
  selectedOwner: string,
  reason: string,
  dispatcher: any,
) => {
  let leadsList: any[] = [];
  selectedLeads.forEach((row) => {
    let newRow = {...row};
    newRow.contactId = newRow.id;
    delete newRow.id;
    datesField.forEach((feild) => {
      if (newRow[feild] && newRow[feild].toDate !== undefined) {
        newRow[feild] = moment(newRow[feild].toDate()).toString();
      }
    });
    leadsList.push(newRow);
  });
  const split = selectedOwner.split(' ');
  const value = split[split.length - 1];
  const ownerEmail = value.slice(1, value.length - 1);
  let ownerData: {email: string; uid: string; organization_id: string} = {
    email: '',
    uid: '',
    organization_id: '',
  };
  const selectedUser = user.organization_users.filter(
    (item: any) => item.user_email === ownerEmail,
  );
  if (selectedUser.length !== 0) {
    ownerData = {
      email: ownerEmail,
      uid: selectedUser[0].uid,
      organization_id: user.organization_id,
    };
  }
  if (ownerData.uid !== '') {
    // console.log('');
    try {
      await functions().httpsCallable('transferLead')({
        leadsData: leadsList,
        options,
        owner: ownerData,
        reason,
      });
      setTimeout(() => dispatcher(setGlobalRefresh(true)), 1500);
    } catch (error) {
      console.log('Transfer Error - ', error);
    }
  }
};

export const converLeadData = (data: any) => {
  const datesField = [
    'created_at',
    'next_follow_up_date_time',
    'stage_change_at',
    'modified_at',
    'lead_assign_time',
  ];
  const tempData = {...data};
  datesField.forEach((key) => {
    if (tempData.data[key]) {
      tempData.data[key] = firebase.firestore.Timestamp.fromDate(
        tempData.data[key].toDate(),
      );
    }
  });
  return tempData;
};
