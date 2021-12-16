import React, {FunctionComponent, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import Header from '../Components/Header';
import {heightToDp, widthToDp} from '../values/size';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../values/theme';
import IconIon from 'react-native-vector-icons/Ionicons';
import {getNotificationTime} from '../Services/format';
import NoteModal from '../Components/Modals/NoteModal';

const NoteView = ({item, index}: {item: any; index: number}) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <NoteModal
        note={item.note}
        date={getNotificationTime(item.created_at)}
        show={show}
        hide={() => setShow(false)}
        color={
          (index + 1) % 3 == 0
            ? theme.notes.GREEN
            : (index + 1) % 3 == 2
            ? theme.notes.YELLOW
            : theme.notes.PINK
        }
      />
      <TouchableOpacity
        style={
          (index + 1) % 3 == 0
            ? {...styles.noteView, backgroundColor: theme.notes.GREEN}
            : (index + 1) % 3 == 2
            ? {...styles.noteView, backgroundColor: theme.notes.YELLOW}
            : {...styles.noteView, backgroundColor: theme.notes.PINK}
        }
        onPress={() => setShow(true)}>
        <Text style={{height: '82%', flexWrap: 'wrap'}}>
          <Icon name={'edit-3'} size={widthToDp(6)} />
          <Text style={{fontSize: 15}}>{`   ${item.note}`}</Text>
        </Text>

        <Text style={styles.date}>{getNotificationTime(item.created_at)}</Text>
      </TouchableOpacity>
    </>
  );
};

type props = {
  navigation: any;
  notes: any[];
};

const NotesScreen: FunctionComponent<props> = ({navigation, notes}) => {
  return (
    <>
      <Header title={'Notes'} onBack={() => navigation.goBack()} />

      {notes && notes.length !== 0 ? (
        <FlatList
          style={{height: '100%', width: '100%'}}
          keyExtractor={(item, index) => index.toString()}
          data={notes}
          renderItem={({item, index}) => <NoteView item={item} index={index} />}
          contentContainerStyle={{
            paddingBottom: heightToDp(2),
            paddingHorizontal: '5%',
            paddingTop: '2%',
          }}
        />
      ) : (
        <View style={styles.noDataParent}>
          <IconIon
            name={'document'}
            size={90}
            color={theme.nav_colors.PRIMARY}
          />
          <Text style={styles.noDataText}>No Notes Available</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  noteView: {
    width: '100%',
    height: 105,
    marginTop: 14,
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
  noDataParent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.GREY,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state: any) => {
  return {
    notes: state.notes.notesData,
  };
};
export default connect(mapStateToProps)(NotesScreen);
