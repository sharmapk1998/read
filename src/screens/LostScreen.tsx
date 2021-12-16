import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, View, TextInput, Text} from 'react-native';
import Header from '../Components/Header';
import {connect, useDispatch} from 'react-redux';
import CustomPicker from '../Components/CustomPicker';
import SubmitButton from '../Components/SubmitButton';
import Loader from '../Components/Modals/Loader';
import {changeLeadStage, updateLeadCountState} from '../Services/leads';
import Snackbar from 'react-native-snackbar';
import theme from '../values/theme';
import {modifyTaskStatus} from '../Services/tasks';
import InputWithLogo from '../Components/InputWithLogo';
import {addNoteFirebase} from '../Services/resources';

type props = {
  navigation: any;
  route: any;
  lost_reasons: any[];
  tasks: {[key: string]: any};
  notes: any[];
};

const LostScreen: FunctionComponent<props> = ({
  navigation,
  route,
  lost_reasons,
  tasks,
  notes,
}) => {
  const leadData = route.params.leadData;
  const leadId = route.params.leadId;
  const tasksData = tasks[leadId] ? tasks[leadId].tasks : [];
  const [load, setLoad] = useState(false);
  const [selectedReason, setSelectedReason] = useState('select');
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
          stage: 'LOST',
          lost_reason: selectedReason,
          other_lost_reason: otherText,
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

  return (
    <>
      {load === true && <Loader show={load} />}
      <Header title={'Lost Details'} onBack={() => navigation.goBack()} />
      <View style={styles.parent}>
        <CustomPicker
          title={'LOST REASON'}
          selected={selectedReason}
          setSelected={(value: any) => setSelectedReason(value)}
          data={lost_reasons}
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
                onChangeText={(value: string) => setOtherText(value)}
                blurOnSubmit={true}
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
    lost_reasons: state.values?.constants?.lost_reasons,
    user: state.user,
    tasks: state.tasks,
    notes: state.notes.notesData,
  };
};
export default connect(mapStateToProps)(LostScreen);
