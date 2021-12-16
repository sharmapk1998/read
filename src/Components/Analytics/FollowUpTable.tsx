import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../values/theme';
import {getTasksofDate} from '../../Services/tasksAPI';
import moment from 'moment';

type props = {
  user: any;
  style: ViewStyle;
};

const FollowUpTable: FunctionComponent<props> = ({style, user}) => {
  const [todayTasks, setTodayTasks] = useState<any[]>([]);
  // const [Status, setStatus] = useState<any[]>([]);
  useEffect(() => {
    getTasksofDate(
      user.uid,
      moment().format('DD-MM-YYYY'),
      (tasks) => {
        console.log(tasks.status)
        if (tasks) {
          setTodayTasks(tasks);
          // setStatus(tasks.status)
        }
        // console.log(tasks)
      },
      () => {},
    );
    
  }, [user.uid]);
  // console.log(todayTasks)
  return (
    <View style={[styles.parent, style]}>
      <Text style={styles.header}>Today's Follow Up</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.thText}>Customer Name</Text>
          <Text style={styles.thText}>Follow Up Type</Text>
        </View>
        {todayTasks.map((task: any, index: number) => (
          //  return (if(task.status !== completed)
          <View key={index}>
            {task.status !== 'Completed'?
            <View
              style={
                index % 2 !== 0
                  ? styles.row
                  : [styles.row, {backgroundColor: '#E5E5E5'}]
              }>
              <Text style={styles.trText} numberOfLines={1}>
                {task.customer_name}
              </Text>
              <Text style={[styles.trText, {textAlign: 'right'}]}>
                {task.type}
              </Text>
            </View>:<></>}
          </View>)
        )}
        {todayTasks.length === 0 && (
          <View>
            <View style={styles.noDataParent}>
              <Icon name={'calendar'} size={90} color={'#E5E5E5'} />
              <Text style={styles.noDataText}>No Tasks Available</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {},
  header: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
    paddingHorizontal: '1%',
  },
  row: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginTop: 8,
  },
  thText: {
    fontWeight: 'bold',
    fontSize: 15,
  },

  trText: {
    fontSize: 15.5,
    width: '40%',
  },
  noDataParent: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.GREY,
    fontWeight: 'bold',
    opacity: 0.3,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(FollowUpTable);
