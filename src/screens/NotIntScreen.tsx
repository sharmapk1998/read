import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, View, TextInput, Text} from 'react-native';
import Header from '../Components/Header';
import theme from '../values/theme';
import {connect, useDispatch} from 'react-redux';
import CustomPicker from '../Components/CustomPicker';
import SubmitButton from '../Components/SubmitButton';
import Snackbar from 'react-native-snackbar';
import {changeLeadStage, updateLeadCountState} from '../Services/leads';
import Loader from '../Components/Modals/Loader';
import {modifyTaskStatus} from '../Services/tasks';
import InputWithLogo from '../Components/InputWithLogo';
import {addNoteFirebase} from '../Services/resources';

type props = {
  navigation: any;
  route: any;
  not_int_reasons: string[];
  tasks: {[key: string]: any};
  notes: any[];
};

const NotIntScreen: FunctionComponent<props> = ({
  navigation,
  route,
  not_int_reasons,
  tasks,
  notes,
}) => {
  const leadId = route.params.leadId;
  const leadData = route.params.leadData;
  const tasksData = tasks[leadId] ? tasks[leadId].tasks : [];
  const [load, setLoad] = useState(false);
  const [otherText, setOtherText] = useState('');
  const dispatcher = useDispatch();
  const [note, setNote] = useState('');
  const onSubmit = () => {
    if (selectedReason === 'select') {
      Snackbar.show({
        text: 'Please select a reason!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (
      (selectedReason === 'Other' || selectedReason === 'other') &&
      otherText === ''
    ) {
      Snackbar.show({
        text: 'Please write a reason!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      if (note.length !== 0) {
        addNoteFirebase(leadId, notes, note, () => {});
      }
      changeLeadStage(
        leadId,
        {
          stage: 'NOT INTERESTED',
          not_int_reason: selectedReason,
          other_not_int_reason: otherText,
        },
        (value) => setLoad(value),
        navigation,
        dispatcher,
        {
          status: 'INACTIVE',
          tasks: modifyTaskStatus(tasksData),
        },
        () => updateLeadCountState(leadData.stage, 'NA', dispatcher),
      );
    }
  };
  const [selectedReason, setSelectedReason] = useState('select');
  return (
    <>
      {load === true && <Loader show={load} />}
      <Header
        title={'Not Interested Details'}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.parent}>
        <CustomPicker
          title={'NOT INTERESTED REASON'}
          selected={selectedReason}
          setSelected={(value: any) => setSelectedReason(value)}
          data={not_int_reasons}
        />
        {selectedReason === 'other' ||
          (selectedReason === 'Other' && (
            <View style={{marginTop: 20}}>
              <Text style={{fontWeight: 'bold'}}>
                Other Reason
                <Text style={{color: theme.colors.RED}}> *</Text>
              </Text>
              <TextInput
                placeholder={'Other Reason..'}
                placeholderTextColor={theme.colors.PLACEHOLDER}
                multiline={true}
                style={styles.otherInput}
                value={otherText}
                blurOnSubmit={true}
                onChangeText={(value: string) => setOtherText(value)}
              />
            </View>
          ))}
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
  picker: {
    width: '100%',
    marginTop: 15,
    backgroundColor: theme.colors.GREY_BACKGROUND,
    borderRadius: 10,
  },
  otherInput: {
    borderWidth: 0.5,
    borderColor: theme.colors.GREY_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 7,
    height: 80,
    textAlignVertical: 'top',
    marginTop: 15,
    borderRadius: 10,
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
    not_int_reasons: state.values?.constants?.not_interested,
    tasks: state.tasks,
    notes: state.notes.notesData,
  };
};

export default connect(mapStateToProps)(NotIntScreen);
