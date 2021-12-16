import React, {FunctionComponent, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../../values/theme';
import {widthToDp} from '../../values/size';
import CustomButton from '../CustoButton';
import {addNoteFirebase} from '../../Services/resources';
import {getNotificationTime} from '../../Services/format';
import NoteModal from '../Modals/NoteModal';
import {inActiveStages} from '../../Services/contactsAPI';

const Note = ({
  note,
  date,
  index,
}: {
  note: string;
  date: any;
  index: number;
}) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <NoteModal
        note={note}
        date={getNotificationTime(date.toDate())}
        show={show}
        hide={() => setShow(false)}
        color={index == 0 ? theme.notes.PINK : theme.notes.YELLOW}
      />
      <TouchableOpacity
        style={
          index == 0
            ? {...styles.noteView, backgroundColor: theme.notes.PINK}
            : {...styles.noteView, backgroundColor: theme.notes.YELLOW}
        }
        onPress={() => setShow(true)}>
        <Text style={{height: '82%', flexWrap: 'wrap'}}>
          <Icon name={'edit-3'} size={widthToDp(6)} />
          <Text style={{fontSize: 13}}>{`   ${note}`}</Text>
        </Text>

        <Text style={styles.date}>{getNotificationTime(date)}</Text>
      </TouchableOpacity>
    </>
  );
};

type props = {
  notes: any[];
  leadId: string;
  leadData: any;
};
const NotesSection: FunctionComponent<props> = ({notes, leadId, leadData}) => {
  const [addNote, setAddNote] = useState(false);
  const [noteText, setNote] = useState('');
  const [load, setLoad] = useState(false);
  const changeLoad = (value: boolean) => {
    setLoad(value);
  };
  return (
    <>
      <View style={styles.parent}>
        {!addNote && notes && notes.length !== 0 && (
          <View style={styles.notesConatiner}>
            {notes && notes[0] && (
              <Note note={notes[0].note} date={notes[0].created_at} index={0} />
            )}
            {notes && notes[1] && (
              <Note note={notes[1].note} date={notes[1].created_at} index={1} />
            )}
          </View>
        )}
        {!addNote && notes && notes.length === 0 && (
          <View style={styles.noNoteView}>
            <Text style={styles.noNoteText}>No Notes</Text>
          </View>
        )}
        {!inActiveStages.includes(leadData.stage) && !leadData.transfer_status && (
          <>
            {addNote && (
              <View style={styles.addNoteContainer}>
                <TextInput
                  placeholder={'Write Note..'}
                  multiline={true}
                  style={styles.addNote}
                  value={noteText}
                  onChangeText={(value) => setNote(value)}
                />
                <View style={styles.addNoteButtons}>
                  <CustomButton
                    color={theme.colors.RED}
                    title={'Cancel'}
                    width={widthToDp(20)}
                    onPress={() => {
                      setAddNote(false);
                      setNote('');
                    }}
                    size={11}
                    style={{borderRadius: 20}}
                  />
                  <CustomButton
                    color={theme.colors.GREEN}
                    title={'Save'}
                    width={widthToDp(20)}
                    onPress={() => {
                      addNoteFirebase(leadId, notes, noteText, changeLoad);
                      setAddNote(!addNote);
                      setNote('');
                    }}
                    size={11}
                    style={{borderRadius: 20}}
                  />
                </View>
              </View>
            )}
            {!addNote && (
              <Icon
                name={'plus-circle'}
                size={25}
                style={styles.addIcons}
                color={theme.logo_colors.ADD}
                onPress={() => setAddNote(true)}
              />
            )}
          </>
        )}
      </View>
      {load && (
        <View style={styles.loader}>
          <ActivityIndicator size={'large'} color={theme.colors.PRIMARY} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    paddingHorizontal: '5%',
  },
  notesConatiner: {
    height: '75%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteView: {
    width: '48%',
    height: '100%',
    paddingHorizontal: '4%',
    paddingTop: '2%',
    borderRadius: 10,
    paddingBottom: '1.5%',
  },
  date: {
    marginTop: 'auto',
    textAlign: 'right',
    fontSize: 10,
  },
  addIcons: {
    marginTop: 'auto',
    alignSelf: 'flex-end',
  },
  addNoteContainer: {
    height: '100%',
    width: '100%',
  },
  addNote: {
    height: '70%',
    width: '95%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: theme.notes.YELLOW,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
    fontSize: 17,
  },
  addNoteButtons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 'auto',
  },
  loader: {
    position: 'absolute',
    height: 180,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#00000030',
  },
  noNoteView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  noNoteText: {
    fontSize: 17,
    color: theme.colors.GREY_LIGHT,
  },
});

const mapStateToProps = (state: any) => {
  return {
    notes: state.notes.notesData,
  };
};

export default connect(mapStateToProps)(NotesSection);
