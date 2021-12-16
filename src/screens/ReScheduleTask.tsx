import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, View, Platform,Text} from 'react-native';
import Header from '../Components/Header';
import {
  mapFollowUpToNotification,
  taskNotification,
} from '../Services/notification';
import {connect,useDispatch} from 'react-redux';
import DateTime from '../Components/DateTime';
import SubmitButton from '../Components/SubmitButton';
import {reScheduleTaskFirebase} from '../Services/tasks';
import Loader from '../Components/Modals/Loader';
import DateTimeIOS from '../Components/DateTimeIOS';
import Snackbar from 'react-native-snackbar';
import InputWithLogo from '../Components/InputWithLogo';
import theme from '../values/theme';
import {addNoteFirebase} from '../Services/resources';
import {setGlobalRefresh } from '../redux/actions';


type props = {
  navigation: any;
  route: any;
  follow_up_reasons: any[];
  tasks: {[key: string]: any};
  user: any;
  notes: any[];
};

const ReScheduleTask: FunctionComponent<props> = ({
  navigation,
  route,
  tasks,
  user,
  notes,
}) => {

  const leadData = route.params.leadData;
  const leadId = route.params.leadId;
  const tasksData = tasks[leadId] ? tasks[leadId].tasks : [];
  const initial = new Date();
  const [load, setLoad] = useState(false);
  const [date, setDate] = useState(initial);
  const [note, setNote] = useState('');
  const dispatcher = useDispatch();
  const onSubmit = async () => {
    
    if (date < new Date()) {
      Snackbar.show({
        text: 'Task Cannot be Schedule For Old Date & Time!',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }
    {
      if (note.length !== 0) {
      addNoteFirebase(leadId, notes, note, () => {});
    }
    taskNotification(
      date,
      leadData.contact_no,
      leadData.country_code,
      mapFollowUpToNotification(tasksData[0].type, leadData.customer_name),
      leadId,
      user.uid,
    );
    setTimeout(() => dispatcher(setGlobalRefresh(true)), 1500);
    setLoad(true);
    await reScheduleTaskFirebase(date, tasksData, leadId, navigation);
    setLoad(false);}
  };

  return (
    <>
      {load === true && <Loader show={load} />}
      <Header title={'Re-Schedule Task'} onBack={() => navigation.goBack()} />
      <View style={styles.parent}>
        {Platform.OS === 'android' ? (
          <DateTime
            style={{marginTop: 30}}
            title={'NEXT FOLLOW UP DATE AND TIME'}
            setDate={setDate}
            date={date}
          />
        ) : (
          <DateTimeIOS
            style={{marginTop: 30}}
            title={'NEXT FOLLOW UP DATE AND TIME'}
            setDate={setDate}
            date={date}
          />
        )}
        <View style={styles.inputView}>
              <Text style={styles.headStyle}>NOTES</Text>
              <InputWithLogo
                style={styles.inputBoxStyle}
                inputProps={{
                  placeholder: 'Note..',
                  value: note,
                  onChangeText: (value: string) => setNote(value),
                }}
                logo={'pencil'}
                shadow={false}
                fontSize={13}
              />
            </View>

        <SubmitButton style={{marginTop: 'auto'}} onPress={onSubmit} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    flex: 1,
    paddingHorizontal: '5%',
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  headStyle: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  inputView: {
    marginTop: 20,
  },
  inputBoxStyle: {
    marginTop: 13,
    backgroundColor: theme.colors.GREY_BACKGROUND,
    borderRadius: 10,
  },
});

const mapStateToProps = (state: any) => {
  return {
    tasks: state.tasks,
    user: state.user,
    notes: state.notes.notesData,
  };
};
export default connect(mapStateToProps)(ReScheduleTask);
