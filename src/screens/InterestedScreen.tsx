import React, {FunctionComponent, useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Platform,
  Keyboard,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import CustomPicker from '../Components/CustomPicker';
import DateTime from '../Components/DateTime';
import DateTimeIOS from '../Components/DateTimeIOS';
import Header from '../Components/Header';
import InputWithLogo from '../Components/InputWithLogo';
import Loader from '../Components/Modals/Loader';
import SubmitButton from '../Components/SubmitButton';
import {editLeadFirebase, updateLeadCountState} from '../Services/leads';
import {
  mapFollowUpToNotification,
  taskNotification,
} from '../Services/notification';
import {addNoteFirebase} from '../Services/resources';
import {createTaskFirebase} from '../Services/tasks';
import theme from '../values/theme';
import {validateInterested, validateEdit} from '../values/validators';
import {setGlobalRefresh } from '../redux/actions';

type props = {
  navigation: any;
  route: any;
  constants: any;
  orgConstants: any;
  tasks: {[key: string]: any};
  user: any;
  notes: any[];
};

const InterstedScreen: FunctionComponent<props> = ({
  navigation,
  route,
  constants,
  orgConstants,
  tasks,
  user,
  notes,
}) => {
  const leadId = route.params.leadId;
  const leadData = route.params.leadData;
  const edit = route.params.edit;
  const tasksData = tasks[leadId] ? tasks[leadId].tasks : [];
  const custName = leadData.customer_name.split(' ');

  const lastNameRef: any = useRef();
  const initial = new Date();
  const [date, setDate] = useState(initial);
  const [firstName, setFirstName] = useState(custName[0]);
  const [lastName, setLastName] = useState(custName.slice(1).join(' '));
  const [propertyType, setPropertyType] = useState(
    leadData.property_type === '' ? 'select' : leadData.property_type,
  );
  const [propertySubType, setPropertySubType] = useState(
    leadData.property_sub_type
      ? leadData.property_sub_type !== ''
        ? leadData.property_sub_type
        : 'select'
      : 'select',
  );
  const [propertyStage, setPropertyStage] = useState(
    leadData.property_stage === '' ? 'select' : leadData.property_stage,
  );
  const [location, setLocation] = useState(
    leadData.location === '' ? 'select' : leadData.location,
  );
  const [project, setProject] = useState(
    leadData.project === '' ? 'select' : leadData.project,
  );
  const [budget, setBudget] = useState(
    leadData.budget === '' ? 'select' : leadData.budget,
  );
  const [altPhone, setAltPhone] = useState<string>(leadData.alternate_no);
  const [phone, setPhone] = useState<string>(leadData.contact_no);
  const [followUp, setFollowUp] = useState('select');
  const [load, setLoad] = useState(false);
  const [note, setNote] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const dispatcher = useDispatch();

  const onSubmit = () => {
    setTimeout(() => dispatcher(setGlobalRefresh(true)), 1500);
    const data = validateInterested(
      firstName,
      lastName,
      propertyType,
      propertySubType,
      propertyStage,
      location,
      project,
      budget,
      followUp,
      date,
      orgConstants,
    );
    const taskData = {
      call_back_reason: '',
      due_date: date,
      type: followUp,
      status: 'Pending',
      customer_name: leadData.customer_name,
    };
    if (data != undefined) {
      if (note.length !== 0) {
        addNoteFirebase(leadId, notes, note, () => {});
      }
      taskNotification(
        date,
        leadData.contact_no,
        leadData.country_code,
        mapFollowUpToNotification(followUp, leadData.customer_name),
        leadId,
        user.uid,
      );

      createTaskFirebase(
        leadId,
        tasksData,
        taskData,
        data,
        (value: boolean) => setLoad(value),
        navigation,
        user,
        dispatcher,
        () => updateLeadCountState('FRESH', 'INTERESTED', dispatcher),
      );
    }
  };

  const onEdit = () => {
    const data = validateEdit(
      firstName,
      lastName,
      propertyType,
      propertyStage,
      location,
      project,
      budget,
      leadData.alternate_no === altPhone ? undefined : altPhone,
      leadData.contact_no === phone ? undefined : phone,
    );
    if (data != undefined) {
      editLeadFirebase(
        {...data, organization_id: user.organization_id},
        (value: boolean) => setLoad(value),
        navigation,
        leadId,
        dispatcher,
      );
    }
  };

  return (
    <>
      {load === true && <Loader show={load} />}
      <Header title={'Interested Details'} onBack={() => navigation.goBack()} />
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        style={styles.parent}
        contentContainerStyle={
          Platform.OS === 'ios' && isKeyboardVisible
            ? {paddingBottom: '60%'}
            : {paddingBottom: '5%'}
        }>
        <View style={styles.inputView}>
          <Text style={styles.headStyle}>
            FIRST NAME <Text style={{color: theme.colors.RED}}>*</Text>
          </Text>
          <InputWithLogo
            style={styles.inputBoxStyle}
            inputProps={{
              placeholder: 'First Name',
              value: firstName,
              onChangeText: (value: string) => setFirstName(value),
              returnKeyType: 'next',
              onSubmitEditing: () => lastNameRef.current?.focus(),
            }}
            logo={'person'}
            shadow={false}
            fontSize={13}
          />
        </View>

        <View style={styles.inputView}>
          <Text style={styles.headStyle}>
            LAST NAME <Text style={{color: theme.colors.RED}}>*</Text>
          </Text>
          <InputWithLogo
            ref={lastNameRef}
            style={styles.inputBoxStyle}
            inputProps={{
              placeholder: 'Last Name',
              value: lastName,
              onChangeText: (value: string) => setLastName(value),
            }}
            fontSize={13}
            logo={'person'}
            shadow={false}
          />
        </View>
        <CustomPicker
          title={'PROPERTY TYPE'}
          selected={propertyType}
          setSelected={(value: any) => setPropertyType(value)}
          data={constants.property_type}
          titleStyle={styles.headStyle}
          style={styles.inputView}
        />
        {propertyType !== 'select' && (
          <CustomPicker
            title={'PROPERTY SUB TYPE'}
            selected={propertySubType}
            setSelected={(value: any) => setPropertySubType(value)}
            data={
              propertyType === 'Residential'
                ? orgConstants.resTypes
                : orgConstants.comTypes
            }
            titleStyle={styles.headStyle}
            style={styles.inputView}
          />
        )}
        <CustomPicker
          title={'PROPERTY STAGE'}
          selected={propertyStage}
          setSelected={(value: any) => setPropertyStage(value)}
          data={constants.property_stage}
          titleStyle={styles.headStyle}
          style={styles.inputView}
        />
        <CustomPicker
          title={'LOCATION'}
          selected={location}
          setSelected={(value: any) => setLocation(value)}
          data={orgConstants.locations}
          titleStyle={styles.headStyle}
          style={styles.inputView}
          search={true}
        />
        <CustomPicker
          title={'BUDGET'}
          selected={budget}
          setSelected={(value: any) => setBudget(value)}
          data={orgConstants.budgets}
          titleStyle={styles.headStyle}
          style={styles.inputView}
        />
        <CustomPicker
          title={'PROJECT'}
          selected={project}
          setSelected={(value: any) => setProject(value)}
          data={orgConstants.projects}
          titleStyle={styles.headStyle}
          style={styles.inputView}
          search={true}
        />

        {edit && user.role === 'Lead Manager' && (
          <View style={styles.inputView}>
            <Text style={styles.headStyle}>Mobile No</Text>
            <InputWithLogo
              style={styles.inputBoxStyle}
              inputProps={{
                placeholder: 'Mobile No',
                value: phone,
                onChangeText: (value: string) => setPhone(value),
                keyboardType: 'number-pad',
                returnKeyType: 'next',
              }}
              fontSize={13}
              logo={'call'}
              shadow={false}
            />
          </View>
        )}
        {edit && (
          <View style={styles.inputView}>
            <Text style={styles.headStyle}>Alternate Mobile No</Text>
            <InputWithLogo
              style={styles.inputBoxStyle}
              inputProps={{
                placeholder: 'Alternate Mobile No',
                value: altPhone,
                onChangeText: (value: string) => setAltPhone(value),
                keyboardType: 'number-pad',
                returnKeyType: 'next',
              }}
              fontSize={13}
              logo={'call'}
              shadow={false}
            />
          </View>
        )}
        {edit === undefined && (
          <>
            <CustomPicker
              title={'NEXT FOLLOW UP TYPE'}
              selected={followUp}
              setSelected={(value: any) => setFollowUp(value)}
              data={constants.follow_up_type}
              titleStyle={styles.headStyle}
              style={styles.inputView}
            />
            {Platform.OS === 'android' ? (
              <DateTime
                style={styles.inputView}
                title={'NEXT FOLLOW UP DATE AND TIME'}
                setDate={setDate}
                date={date}
                titleStyle={styles.headStyle}
              />
            ) : (
              <DateTimeIOS
                style={styles.inputView}
                title={'NEXT FOLLOW UP DATE AND TIME'}
                setDate={setDate}
                date={date}
                titleStyle={styles.headStyle}
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
          </>
        )}
        <SubmitButton
          title={'Update'}
          style={{marginTop: 50}}
          onPress={edit ? onEdit : onSubmit}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '6%',
    backgroundColor: '#fff',
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
    constants: state.values?.constants,
    orgConstants: state.values?.orgConstants,
    tasks: state.tasks,
    user: state.user,
    notes: state.notes.notesData,
  };
};

export default connect(mapStateToProps)(InterstedScreen);
