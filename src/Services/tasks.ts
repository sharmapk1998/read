import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import Snackbar from 'react-native-snackbar';
import {resetTasks, setGlobalRefresh, updateAllTasks} from '../redux/actions';
import theme from '../values/theme';

export const fetchLeadTasks = (leadID: string, dispatcher: any) => {
  const subscriber = firestore()
    .collection('tasks')
    .doc(leadID)
    .onSnapshot((tasks) => {
      if (tasks.data()) {
        let data = {
          [tasks.id]: {
            status: tasks.data()?.status,
            tasks: tasks.data()?.tasks,
          },
        };
        dispatcher(updateAllTasks(data));
      }
    });
  return subscriber;
};

export const createTaskFirebase = (
  leadId: string,
  tasks: any[],
  task: any,
  leadDataUpdate: {},
  setLoad: (value: boolean) => void,
  navigation: any,
  user: any,
  dispatcher: any,
  onComplete: () => void,
  completed?: boolean
) => {
  if (completed === false) tasks = cancelTaskStatus(tasks);
  else tasks = modifyTaskStatus(tasks);
  task = {
    ...task,
    created_at: firestore.Timestamp.now(),
    leadId,
    created_by: user.user_email,
  };
  setLoad(true);
  tasks.unshift(task);
  const batch = firestore().batch();
  const taskCollection = firestore().collection('tasks').doc(leadId);
  const leadCollection = firestore().collection('contacts').doc(leadId);
  batch.set(
    taskCollection,
    {
      status: 'ACTIVE',
      tasks,
      uid: user.uid,
      organization_id: user.organization_id,
    },
    {merge: true},
  );
  batch.update(leadCollection, leadDataUpdate);
  batch
    .commit()
    .then(() => {
      onComplete();
      setLoad(false);
      navigation.pop(2);
      setTimeout(() => dispatcher(setGlobalRefresh(true)), 1500);

      setTimeout(
        () =>
          Snackbar.show({
            text: 'Task Created!',
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
      console.log('Task Create Error', error);
    });
};

export const reScheduleTaskFirebase = async (
  date: Date,
  tasks: any[],
  leadId: string,
  navigation: any,
) => {
  let task = {...tasks[0]};
  task.due_date = date;
  tasks[0] = task;
  try {
    const batch = firestore().batch();
    const taskCollection = firestore().collection('tasks').doc(leadId);
    const leadCollection = firestore().collection('contacts').doc(leadId);
    batch.set(taskCollection, {tasks}, {merge: true});
    batch.update(leadCollection, {
      next_follow_up_date_time: date,
      modified_at: firestore.Timestamp.now(),
    });
    await batch.commit();
    navigation.pop(2);
    setTimeout(
      () =>
        Snackbar.show({
          text: 'Task Reshduled!',
          duration: Snackbar.LENGTH_SHORT,
        }),
      100,
    );
  } catch (error) {
    Snackbar.show({
      text: 'Error!! Try Again',
      duration: Snackbar.LENGTH_SHORT,
    });
    console.log('Reschdule Error', error);
  }
};

export const modifyTaskStatus = (tasks: any[]) => {
  if (tasks.length < 1) {
    return tasks;
  }
  let taskData = {...tasks[0]};
  taskData.status = 'Completed';
  taskData = {...taskData, completed_at: firestore.Timestamp.now()};
  tasks[0] = taskData;
  return tasks;
};

export const cancelTaskStatus = (tasks: any[]) => {
  if (tasks.length < 1) {
    return tasks;
  }
  let taskData = { ...tasks[0] };
  taskData.status = 'Cancelled';
  tasks[0] = taskData;
  return tasks;
};

export const sortTask = (a: any, b: any) => {
  if (a.due_date.toDate() > b.due_date.toDate()) {
    return -1;
  } else {
    return 1;
  }
};

export const getTaskColor = (status: string) => {
  if (status === 'Completed') {
    return theme.colors.GREEN;
  } else if (status === 'Pending') {
    return theme.agenda.PENDING;
  } else {
    return theme.colors.RED;
  }
};

const toLocalDate = (timestamp: any) => {
  const utcDate = moment.utc(timestamp.toDate());
  const localDate = moment(utcDate).local();
  return localDate.format('DD/MM/YY');
};

export const arrangeTasks = (tasks: any[], feild: string) => {
  const data: any = {};
  tasks.forEach((task) => {
    const timestamp = task[feild];
    const date = toLocalDate(timestamp);
    if (data[date]) {
      data[date].push({leadId: task.leadId, data: task});
    } else {
      data[date] = [{leadId: task.leadId, data: task}];
    }
  });
  return data;
};
