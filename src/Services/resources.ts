import firestore from '@react-native-firebase/firestore';
import {Linking} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {updateAttachments, updateCallLogs, updateNotes} from '../redux/actions';

export const addAttachmentFirestore = async (
  leadId: string,
  data: {},
  attachments: [],
) => {
  let attachmentsData: any[] = [...attachments];
  attachmentsData.unshift(data);
  try {
    await firestore().collection('contactResources').doc(leadId).set(
      {
        attachments: attachmentsData,
      },
      {merge: true},
    );
    return true;
  } catch (error) {
    console.log('atachments firestore', error);
    return false;
  }
};

export const addNoteFirebase = (
  leadId: string,
  notes: any[],
  note: string,
  setLoad: (value: boolean) => void,
) => {
  if (note.length === 0) {
    Snackbar.show({
      text: 'Please Write A Note!',
      duration: Snackbar.LENGTH_SHORT,
    });
    return;
  }
  setLoad(true);
  let noteData = [...notes];
  noteData.unshift({
    note: note,
    created_at: firestore.Timestamp.now(),
  });
  firestore()
    .collection('contactResources')
    .doc(leadId)
    .set(
      {
        notes: noteData,
      },
      {merge: true},
    )
    .then(() => {
      Snackbar.show({text: 'Saved!', duration: Snackbar.LENGTH_SHORT});
      setLoad(false);
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
      console.log('AddNote Error', error);
    });
};

export const createCallLogFirebase = (
  leadId: string,
  user: any,
  callTime: string,
  callStartTime: Date,
) => {
  firestore()
    .collection('contactResources')
    .doc(leadId)
    .set(
      {
        organization_id: user.organization_id,
        uid: user.uid,
        callLogs: firestore.FieldValue.arrayUnion({
          created_at: callStartTime,
          callTime: callTime,
        }),
      },
      {merge: true},
    )
    .then(() => {
      Snackbar.show({
        text: 'Call Log Created',
        duration: Snackbar.LENGTH_SHORT,
      });
    })
    .catch((error) => {
      'call log error';
    });
};

export const fetchLeadResources = (leadId: string, dispatcher: any) => {
  const subscriber = firestore()
    .collection('contactResources')
    .doc(leadId)
    .onSnapshot((resourceData) => {
      console.log(leadId)
      if (resourceData) {
        let callLogData: any[] = [];
        let attachmentsData: any[] = [];
        let notesData: any[] = [];
        const data = resourceData.data();
        console.log(data)
        
        if (data) {
          callLogData = data.callLogs ? data.callLogs : [];
          attachmentsData = data.attachments ? data.attachments : [];
          notesData = data.notes ? data.notes : [];
        }
        dispatcher(updateCallLogs(callLogData));
        dispatcher(updateNotes(notesData));
        dispatcher(updateAttachments(attachmentsData));
      } else {
        dispatcher(updateCallLogs([]));
        dispatcher(updateNotes([]));
        dispatcher(updateAttachments([]));
      }
      
    });
  return subscriber;
};

export const fetchProject = async (
  projectId: string,
  setProject: (data: any) => void,
) => {
  await firestore()
    .collection('projectResources')
    .doc(projectId)
    .get()
    .then((project) => {
      const projectData = project.data();
      if (projectData) {
        setProject(projectData);
      }
    });
};

export const fetchFAQ = async (
  organization_id: string,
  setFaq: (data: any[]) => void,
  setLoad: (value: boolean) => void,
) => {
  try {
    setLoad(true);
    const data = await firestore().collection('faq').doc(organization_id).get();
    if (data) {
      const faqs = data.data();
      if (faqs?.FAQ) {
        setFaq(faqs.FAQ);
      }
    }
    setLoad(false);
  } catch (error) {
    setLoad(false);
    console.log('fetch FAQ error', error);
  }
};

export const openURL = (url: string) => {
  Linking.canOpenURL(url).then(async (supported) => {
    if (supported) {
      try {
        await Linking.openURL(url);
      } catch (error) {
        console.log('Open Url Error');
        Snackbar.show({
          text: 'Unable to open link',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } else {
      console.log('Open Url Error');
      Snackbar.show({
        text: 'Unable to open link',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  });
};

export const fetchNewsData = async (
  organization_id: string,
  setNews: (data: any) => void,
) => {
  let defaultData = {
    Noida: 'https://realty.economictimes.indiatimes.com/search/noida',
    Gurgaon: 'https://realty.economictimes.indiatimes.com/search/gurgaon',
  };
  const newsDoc = await firestore()
    .collection('news')
    .doc(organization_id)
    .get();
  const newsData = newsDoc.data();
  if (newsData) {
    let news: any[] = newsData.news;
    let data: {[key: string]: string} = {};

    if (news.length === 0) {
      setNews(defaultData);
    } else {
      news.forEach((item) => {
        data[item.name] = item.link;
      });
      setNews(data);
    }
  } else {
    setNews(defaultData);
  }
};
