import React, {FunctionComponent, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import theme from '../../values/theme';
import Modal from 'react-native-modal';
import SubmitButton from '../SubmitButton';
import {useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import CustomPicker from '../CustomPicker';
import Loader from './Loader';
import {transferLeads} from '../../Services/leads';
import CheckBox from '@react-native-community/checkbox';
import Snackbar from 'react-native-snackbar';
import {setSelectedLeads} from '../../redux/actions';

type props = {
  onBack: () => void;
  show: boolean;
  user: any;
  selectedLeads: string[];
  transferReasons: string[];
};
const EditModal: FunctionComponent<props> = ({
  onBack,
  show,
  user,
  selectedLeads,
  transferReasons,
}) => {
  const dispatcher = useDispatch();
  const [orgUsers, setOrgUsers] = useState<string[]>([]);
  const [owner, setOwner] = useState('select');
  const [load, setLoad] = useState(false);
  const [fresh, setFresh] = useState(false);
  const [notes, setNotes] = useState(false);
  const [attachments, setAttachments] = useState(false);
  const [tasks, setTasks] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [contactDetails, setcontactDetails] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [nextPage, setNextPage] = useState(false);
  const [reason, setReason] = useState('select');
  useEffect(() => {
    if (user.role === 'Lead Manager') {
      if (user.organization_users) {
        const orgUsersList: string[] = [];
        user.organization_users.forEach((item: any) => {
          if (item.uid !== user.uid && item.status === 'ACTIVE') {
            orgUsersList.push(item.user_name + ` (${item.user_email})`);
          }
        });
        setOrgUsers(orgUsersList);
      }
    } else if (user.role === 'Team Lead') {
      if (user.organization_users) {
        const orgUsersList: string[] = [];
        user.usersList.forEach((uid: any) => {
          const selectedUser = user.organization_users.filter(
            (item: any) =>
              item.uid === uid && user.uid !== uid && item.status === 'ACTIVE',
          );
          if (selectedUser.length > 0) {
            orgUsersList.push(
              selectedUser[0].user_name + ` (${selectedUser[0].user_email})`,
            );
          }
        });
        setOrgUsers(orgUsersList);
      }
    }
  }, [user.role]);

  const onSubmit = async () => {
    if (reason === 'select') {
      Snackbar.show({
        text: 'Please Select Transfer Reason!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      setLoad(true);
      await transferLeads(
        {fresh, tasks, notes, attachments, contactDetails},
        selectedLeads,
        user,
        owner,
        reason,
        dispatcher,
      );
      setLoad(false);
      dispatcher(setSelectedLeads([]));
      setTimeout(() => onBack(), 200);
    }
  };
  useEffect(() => {
    if (show) {
      setNextPage(false);
    }
  }, [show]);

  useEffect(() => {
    if (fresh) {
      setShowTasks(false);
      setShowContactDetails(true);
    } else {
      setShowTasks(true);
      setShowContactDetails(false);
    }
  }, [fresh]);
  const next = () => {
    if (owner === 'select') {
      Snackbar.show({
        text: 'Please Select Owner!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      setNextPage(true);
    }
  };

  return (
    <>
      <Modal
        useNativeDriver={true}
        isVisible={show}
        onBackButtonPress={onBack}
        onBackdropPress={onBack}
        style={styles.parent}>
        <View style={styles.dialogue}>
          {nextPage === false ? (
            <>
              <CustomPicker
                title={'Owner'}
                selected={owner}
                setSelected={(value: any) => setOwner(value)}
                data={orgUsers}
                titleStyle={styles.headStyle}
                style={styles.inputView}
                search={true}
              />
              <View>
                <View style={styles.options}>
                  <Text style={styles.optionText}>
                    Do you want to transfer lead(s) As Fresh?
                  </Text>
                  <CheckBox
                    animationDuration={0.2}
                    onValueChange={(checked) => setFresh(checked)}
                    value={fresh}
                  />
                </View>
                <Text style={styles.optionHead}>Select Options</Text>
                {showContactDetails && (
                  <View style={styles.options}>
                    <Text style={styles.optionText}>
                      Transfer Contact Details?
                    </Text>
                    <CheckBox
                      animationDuration={0.2}
                      onValueChange={(checked) => setcontactDetails(checked)}
                      value={contactDetails}
                    />
                  </View>
                )}
                {showTasks && (
                  <View style={styles.options}>
                    <Text style={styles.optionText}>Open Tasks</Text>
                    <CheckBox
                      animationDuration={0.2}
                      onValueChange={(checked) => setTasks(checked)}
                      value={tasks}
                    />
                  </View>
                )}
                <View style={styles.options}>
                  <Text style={styles.optionText}>Attachments</Text>
                  <CheckBox
                    animationDuration={0.2}
                    onValueChange={(checked) => setAttachments(checked)}
                    value={attachments}
                  />
                </View>
                <View style={styles.options}>
                  <Text style={styles.optionText}>Notes</Text>
                  <CheckBox
                    animationDuration={0.2}
                    onValueChange={(checked) => setNotes(checked)}
                    value={notes}
                  />
                </View>
              </View>
              <SubmitButton
                title={'Next'}
                style={{width: '42%', height: 40, marginTop: 40}}
                textStyle={{fontSize: 15}}
                onPress={next}
              />
            </>
          ) : (
            <>
              <CustomPicker
                title={'Transfer Reason'}
                selected={reason}
                setSelected={(value: any) => setReason(value)}
                data={transferReasons}
                titleStyle={styles.headStyle}
                style={styles.inputView}
              />
              <SubmitButton
                title={'Update'}
                style={{width: '42%', height: 40, marginTop: 40}}
                textStyle={{fontSize: 15}}
                onPress={onSubmit}
              />
            </>
          )}
        </View>
      </Modal>
      <Loader show={load} />
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogue: {
    width: '85%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: '5%',
    justifyContent: 'space-evenly',
    paddingBottom: 20,
  },
  headStyle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  inputView: {
    marginTop: 20,
  },
  optionText: {
    fontSize: 13,
  },
  optionHead: {
    marginTop: 17,
    color: theme.colors.PRIMARY,
    fontSize: 14,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    selectedLeads: state.leads.selectedLeads,
    transferReasons: state.values?.orgConstants.transferReasons,
  };
};

export default connect(mapStateToProps)(EditModal);
