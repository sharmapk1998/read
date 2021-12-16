import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleSheet, View, Platform,Text} from 'react-native';
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
import InputWithLogo from '../Components/InputWithLogo';
import theme from '../values/theme';
import {addNoteFirebase} from '../Services/resources';

type props = {
  navigation: any;
  route: any;
  follow_up_reasons: any[];
  tasks: {[key: string]: any};
  user: any;
  notes: any[];
};

const CreateTask: FunctionComponent<props> = ({
  navigation,
  route,
  follow_up_reasons,
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
  const [existingTaskSelected, setExistingTaskSelected] = useState('select');
  const [date, setDate] = useState(initial);
  const [Prev, setPrev] = useState(initial);
  const dispatcher = useDispatch();
  const [note, setNote] = useState('');
  const [existingTaskStatus, setExistingTaskStatus] = useState(false);

  // console.log(tasks);

  
  useEffect(() => {
    const func = () => Object.keys(tasks).forEach((key) =>{
      if( tasks[key].tasks[0].status === 'Pending' && tasks[key].tasks[0].type !== 'Call Back'){
        setExistingTaskStatus(true);
      return;
      } else {
        setExistingTaskStatus(false) 
        return;
      }
    })

    func()

  }, [])

  const onSubmit = () => {
    if (selectedReason === 'select') {
      Snackbar.show({
        text: 'Please select a follow up!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (date < new Date()) {
      Snackbar.show({
        text: 'Task Cannot be Schedule For Old Date & Time!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (existingTaskStatus && existingTaskSelected === 'Select') {
      Snackbar.show({
        text: 'Select Exisiting Task Status!!',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
    else {
      if (note.length !== 0) {
        addNoteFirebase(leadId, notes, note, () => {});
      }
      taskNotification(
        date,
        leadData.contact_no,
        leadData.country_code,
        mapFollowUpToNotification(selectedReason, leadData.customer_name),
        leadId,
        user.uid,
      );
      const data = {
        due_date: date,
        type: selectedReason,
        status: 'Pending',
        customer_name: leadData.customer_name,
      };
      createTaskFirebase(
        leadId,
        tasksData,
        data,
        {next_follow_up_type: selectedReason, next_follow_up_date_time: date},
        (value: boolean) => setLoad(value),
        navigation,
        user,
        dispatcher,
        () => {},
        existingTaskStatus && existingTaskSelected === 'Completed'
          ? true
          : false
      );
      
    }
  };

  return (
    
    <>
    
      {load === true && <Loader show={load} />}
      <Header title={'Create Task'} onBack={() => navigation.goBack()} />
      
        <View style={styles.parent}>
          {existingTaskStatus &&  
          <CustomPicker
            title={'EXISTING TASK STATUS'}
            selected={existingTaskSelected}
            setSelected={(value: any) => setExistingTaskSelected(value)}
            data={['Completed', 'Cancelled']}
          />
          }
          <CustomPicker
            title={'NEXT FOLLOW UP '}
            selected={selectedReason}
            setSelected={(value: any) => setSelectedReason(value)}
            data={follow_up_reasons}
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
          
        <SubmitButton style={{marginTop: '55%'}} onPress={onSubmit} />
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
    follow_up_reasons: state.values?.constants?.follow_up_type,
    tasks: state.tasks,
    user: state.user,
    notes: state.notes.notesData,
  };
};
export default connect(mapStateToProps)(CreateTask);
