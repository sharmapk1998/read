import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Text,
  ActivityIndicator,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {connect,useDispatch} from 'react-redux';
import theme from '../../values/theme';
import AgendaModal from './AgendaModal';
import moment from 'moment';
import {getTaskDateStatus} from '../../Services/tasksAPI';
import {setGlobalRefresh } from './../../redux/actions';
import Snackbar from 'react-native-snackbar';

type props = {
  style?: ViewStyle;
  navigation: any;
  user: any;
  refresh: boolean;
};
const TaskCalender: FunctionComponent<props> = ({
  style,
  navigation,
  user,
  refresh,
}) => {
  const dispatcher = useDispatch();
  const [load, setLoad] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [showAgenda, setShowAgenda] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [month, setMonth] = useState(moment().month() + 1);

  useEffect(() => {
    if (user.uid) {
      getTaskDateStatus(
        user.uid,
        month,
        (data) => setMarkedDates(data),
        (value) => setLoad(value),
      );
      setTimeout(() => dispatcher(setGlobalRefresh(true)), 1500);
    }
  }, [user.uid, month, refresh]);

  return (
    <>
      <AgendaModal
        show={showAgenda}
        hide={() => setShowAgenda(false)}
        selectedDate={selectedDate}
        navigation={navigation}
        markedDates={markedDates}
      />
      <View style={[styles.parent, style]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Task Calendar</Text>
          {load && (
            <ActivityIndicator size="small" color={theme.colors.PRIMARY} />
          )}
        </View>
        <Calendar
          style={styles.calender}
          current={new Date()}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            setTimeout(() => setShowAgenda(true), 10);
          }}
          monthFormat={'MMMM yyyy'}
          onMonthChange={(date) => setMonth(date.month)}
          hideExtraDays={true}
          hideDayNames={false}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          enableSwipeMonths={false}
          theme={{
            arrowColor: theme.colors.USER,
            monthTextColor: theme.colors.USER,
            selectedDayTextColor: '#fff',
            indicatorColor: theme.colors.USER,
          }}
          markingType={'multi-dot'}
          markedDates={markedDates}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    backgroundColor: '#E2E2E2',
    paddingHorizontal: '5%',
    paddingBottom: 20,
    borderRadius: 15,
  },
  header: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '2%',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calender: {
    borderRadius: 10,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(TaskCalender);
