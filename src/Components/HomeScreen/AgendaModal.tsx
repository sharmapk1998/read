import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  formatAMPM,
  getDaysArray,
  getMonthYear,
  getDayName,
  getDate,
  toYYYYMMDD,
  getPdfDate
} from '../../Services/format';
import {getTaskColor, sortTask} from '../../Services/tasks';
import theme from '../../values/theme';
import Modal from 'react-native-modal';
import {fetchSingleLead} from '../../Services/leads';
import {connect, useDispatch} from 'react-redux';
import moment from 'moment';
import {getTasksofDate} from '../../Services/tasksAPI';
import {FlatList} from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';

type props = {
  show: boolean;
  hide: () => void;
  selectedDate: any;
  navigation: any;
  markedDates: {[key: string]: {dots: {key: string; color: string}[]}};
  user: any;
};

const AgendaModal: FunctionComponent<props> = ({
  show,
  hide,
  selectedDate,
  navigation,
  markedDates,
  user,
}) => {
  const [Agenda, setAgenda] = useState(show);
  const [load, setLoad] = useState(false);
  const [dateArray, setDateArray] = useState<Date[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(3);
  const [taskToShow, setTaskToShow] = useState<any[]>([]);
  useEffect(() => {
    if (show === true) {
      const dateRange = getDaysArray(selectedDate);
      setDateArray(dateRange);
      setSelectedIndex(3);
    }
  }, [show]);

  useEffect(() => {
    if (dateArray.length === 0) {
      return;
    }
    if (user.uid) {
      getTasksofDate(
        user.uid,
        moment(dateArray[selectedIndex]).format('DD-MM-YYYY'),
        (data) => setTaskToShow(data),
        (value) => setLoad(value),
      );
    }
  }, [user.uid, dateArray, selectedIndex]);
  
  const onPress = async (leadId: string) => {
    hide();
    const data = await fetchSingleLead(leadId);
    const leadData = {
      id: leadId,
      data,
    };
    navigation.navigate('LeadDeatils', {
      leadData,
    });
  };
  
  const renderItem = ({item, index}: {item: any; index: number}) => {
    // console.log(item)
    // console.log(item.leadId,item.customer_name)
    return (
      <TouchableOpacity
        key={index}
        style={styles.taskViewParent}
        onPress={() => {item.transfer_status===true ?[hide(),Snackbar.show({
          text: "This Lead is Transferred, Can't access by you!!",
          duration: Snackbar.LENGTH_LONG,
        })]:onPress(item.leadId)}}>
        <View>
          <Text style={styles.taskTime}>
          {item.completed_at?getPdfDate(item.completed_at.toDate()):getPdfDate(item.due_date.toDate())}
        </Text>
        
        <Text style={styles.taskTime}>
          {item.completed_at?formatAMPM(item.completed_at.toDate()):formatAMPM(item.due_date.toDate())}
        </Text>
        </View>
        <View style={styles.taskView}>
          <View
            style={{
              backgroundColor: getTaskColor(item.status),
              width: 3.2,
              height: 45,
              borderRadius: 4,
            }}
          />
          <View style={styles.taskContentParent}>
            <View style={styles.taskContent}>
              <Text numberOfLines={1} style={styles.name}>
                {item?.customer_name}
              </Text>
              <Text style={styles.type}>{item.type}</Text>
            </View>
            <View style={styles.taskStatusContainer}>
              <Text
                style={[styles.taskStaus, {color: getTaskColor(item.status)}]}>
                {item.status}
              </Text>
              <Text style={styles.owner} numberOfLines={1}>
                {user?.userMap.nameMap[item.uid]
                  ? user?.userMap.nameMap[item.uid]
                  : ''}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={show}
      style={styles.conatiner}
      onBackdropPress={hide}
      onBackButtonPress={hide}
      animationInTiming={400}
      animationOutTiming={400}
      hideModalContentWhileAnimating={true}
      useNativeDriver={true}>
      <View style={styles.agendaParent}>
        <View style={styles.header}>
          {dateArray[3] && (
            <Text style={styles.monthName}>{getMonthYear(dateArray[3])}</Text>
          )}
          <View style={styles.dateViewParent}>
            {dateArray.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={
                  selectedIndex === index
                    ? [styles.dateView, {backgroundColor: theme.agenda.PRIMARY}]
                    : [styles.dateView]
                }
                onPress={() => setSelectedIndex(index)}>
                <Text
                  style={
                    selectedIndex === index
                      ? [styles.dayText, {color: '#fff'}]
                      : [styles.dayText, {color: '#000'}]
                  }>
                  {getDayName(item)}
                </Text>
                <Text
                  style={
                    selectedIndex === index
                      ? [styles.dateText, {color: '#fff'}]
                      : [styles.dateText, {color: '#000'}]
                  }>
                  {getDate(item)}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  {markedDates[toYYYYMMDD(item)] &&
                    markedDates[toYYYYMMDD(item)].dots.map((item) => (
                      <View
                        key={item.key}
                        style={[styles.dot, {backgroundColor: item.color}]}
                      />
                    ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {load === false ? (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={taskToShow}
              renderItem={renderItem}
              style={{marginTop: 20}}
              contentContainerStyle={{paddingBottom: 120}}
              nestedScrollEnabled={true}
            />
          ) : (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={theme.colors.PRIMARY} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    width: '100%',
    margin: 0,
  },
  agendaParent: {
    height: '70%',
    paddingTop: '5%',
    marginTop: 'auto',
    backgroundColor: '#fff',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  header: {},
  monthName: {
    textAlign: 'center',
    color: theme.agenda.PRIMARY,
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateViewParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    marginTop: 16,
  },
  dateView: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: '3%',
    paddingBottom: 2,
  },
  dayText: {
    fontSize: 9,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  taskViewParent: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  taskTime: {
    fontSize: 13,
    color: theme.colors.GREY,
    textAlign: 'center',
  },
  taskView: {
    height: 60,
    alignItems: 'center',
    width: '75%',
    borderColor: theme.colors.GREY_LIGHT,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    paddingLeft: '1%',
  },
  taskContentParent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  taskStatusContainer: {
    marginLeft: 'auto',
    marginRight: 10,
    height: 60,
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 3,
    width: '35%',
  },
  taskStaus: {
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'right',
  },
  taskContent: {
    marginLeft: 10,
    height: '100%',
    justifyContent: 'space-evenly',
    paddingVertical: '2%',
    width: '100%',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '56%',
  },
  type: {
    fontSize: 13,
    color: theme.colors.GREY,
  },
  owner: {
    fontSize: 9.5,
    color: theme.colors.GREY,
    textAlign: 'right',
    width: '100%',
  },
  dot: {
    height: 4,
    width: 4,
    borderRadius: 5,
    marginLeft: 2,
  },
  loader: {
    height: '80%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(AgendaModal);
