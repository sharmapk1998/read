import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Platform} from 'react-native';
import Header from '../Components/Header';
import {
  mapFollowUpToNotification,
  taskNotification,
} from '../Services/notification';
import {connect, useDispatch} from 'react-redux';
import CustomPicker from '../Components/CustomPicker';
import DateTime from '../Components/DateTime';
import SubmitButton from '../Components/SubmitButton';
import Snackbar from 'react-native-snackbar';
import Loader from '../Components/Modals/Loader';
import DateTimeIOS from '../Components/DateTimeIOS';
import {createTaskFirebase} from '../Services/tasks';
import {updateLeadCountState} from '../Services/leads';
import firestore from '@react-native-firebase/firestore';
import InputWithLogo from '../Components/InputWithLogo';
import theme from '../values/theme';
import {addNoteFirebase} from '../Services/resources';

type props = {
  navigation: any;
  route: any;
  call_back_reasons: any[];
  tasks: {[key: string]: any};
  user: any;
  notes: any[];
};

const CallBackScreen: FunctionComponent<props> = ({
  navigation,
  route,
  call_back_reasons,
  tasks,
  user,
  notes,
}) => {
  const leadData = route.params.leadData;
  const leadId = route.params.leadId;
  const tasksData = tasks[leadId] ? tasks[leadId].tasks : [];
  const initial = new Date();
  const [load, setLoad] = useState(false);
  const [selectedReason, setSelectedReason] = useState('select');
  const [date, setDate] = useState(initial);
  const dispatcher = useDispatch();
  const [note, setNote] = useState('');

  const onSubmit = () => {
    if (selectedReason === 'select') {
      Snackbar.show({
        text: 'Please select a reason!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (date < new Date()) {
      Snackbar.show({
        text: 'Task Cannot be Schedule For Old Date & Time!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      selectedReason;
      if (note.length !== 0) {
        addNoteFirebase(leadId, notes, note, () => {});
      }
      taskNotification(
        date,
        leadData.contact_no,
        leadData.country_code,
        mapFollowUpToNotification('Call Back', leadData.customer_name),
        leadId,
        user.uid,
      );
      const data = {
        call_back_reason: selectedReason,
        due_date: date,
        type: 'Call Back',
        status: 'Pending',
        customer_name: leadData.customer_name,
      };

      const changeLeadData =
        leadData.stage === 'CALLBACK'
          ? {}
          : {
              stage_change_at: firestore.Timestamp.now(),
            };
      createTaskFirebase(
        leadId,
        tasksData,
        data,
        {
          stage: 'CALLBACK',
          call_back_reason: selectedReason,
          next_follow_up_type: 'Call Back',
          next_follow_up_date_time: date,
          modified_at: firestore.Timestamp.now(),
          ...changeLeadData,
        },
        (value: boolean) => setLoad(value),
        navigation,
        user,
        dispatcher,
        () => updateLeadCountState(leadData.stage, 'CALLBACK', dispatcher),
      );
    }
  };

  return (
    <>
      {load === true && <Loader show={load} />}
      <Header title={'Call Back Details'} onBack={() => navigation.goBack()} />
      <View style={styles.parent}>
        <CustomPicker
          title={'CALL BACK REASON'}
          selected={selectedReason}
          setSelected={(value: any) => setSelectedReason(value)}
          data={call_back_reasons}
        />
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
    paddingTop: 30,
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
    call_back_reasons: state.values?.constants?.call_back,
    tasks: state.tasks,
    user: state.user,
    notes: state.notes.notesData,
  };
};
export default connect(mapStateToProps)(CallBackScreen);
