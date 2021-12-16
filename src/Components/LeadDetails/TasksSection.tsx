import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux';
import theme from '../../values/theme';
import {mapTaskToCount, getDateValues} from '../../Services/format';

type props = {
  tasks: {[key: string]: any};
  leadId: string;
};

const TasksSection: FunctionComponent<props> = ({tasks, leadId}) => {
  const [tasksData, setTasksData] = useState<any[]>([]);
  const [dateData, setDateData] = useState<{
    date: string;
    month: string;
    time: string;
  }>({date: '', month: '', time: ''});
  const [status, setstatus] = useState('');
  const [date, setDate] = useState<{
    date: string;
    month: string;
    time: string;
  }>({date: '', month: '', time: ''});

  useEffect(() => {
    if (tasks[leadId]) {
      setTasksData(tasks[leadId].tasks);
      if (tasks[leadId].tasks && tasks[leadId].tasks[0]) {
        setDateData(getDateValues(tasks[leadId].tasks[0].due_date));
        setstatus(tasks[leadId].tasks[0].status);
        if (tasks[leadId].tasks && tasks[leadId].tasks[0].completed_at) {
          setDate(getDateValues(tasks[leadId].tasks[0].completed_at));
          
        }
      }
    }
  }, [tasks]);
console.log(date)
  return (
    <View style={styles.parent}>
      <View style={styles.dateView}>
        {tasks.length != 0 && status==='Pending' ? (
          <>
            <Text>{dateData.date}</Text>
            <Text>{dateData.month}</Text>
            <Text>{dateData.time}</Text>
          </>
        ):tasks.length != 0 && status==='Completed' && (
          <>
            <Text>{date.date}</Text>
            <Text>{date.month}</Text>
            <Text>{date.time}</Text>
          </>
        )}
        {(tasksData === undefined || tasksData.length == 0) && (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              marginBottom: '12%',
            }}>
            <Text style={styles.noTasks}>No Tasks</Text>
          </View>
        )}
      </View>
      <View style={styles.upcomingParent}>
        {tasksData && tasksData.length != 0 && (
          <Text style={styles.taskType}>{tasksData[0].type}</Text>
        )}
        {tasksData === undefined || tasksData.length == 0 ? (
          <Text style={styles.noTasks}>No Tasks</Text>
        ) : tasks[leadId] &&
          tasks[leadId].tasks &&
          tasks[leadId].tasks[0] &&
          tasks[leadId].tasks[0].due_date.toDate() < new Date() &&
          status==='Pending' ? (
          <Text style={styles.overdue}>Overdue</Text>
        ) : tasks[leadId] &&
        tasks[leadId].tasks &&
        tasks[leadId].tasks[0] &&
        tasks[leadId].tasks[0].due_date.toDate() > new Date() &&
        status==='Pending' ? (
          <Text style={styles.upcoming}>Upcoming</Text>
        ):(<Text style={styles.completed}>Completed</Text>)}
      </View>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.tableHeader}>Call Backs</Text>
          <View style={styles.line} />
          <Text style={styles.tableValue}>
            {mapTaskToCount(tasksData, 'Call Back')}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.tableHeader}>Meetings</Text>
          <View style={styles.line} />
          <Text style={styles.tableValue}>
            {mapTaskToCount(tasksData, 'Meeting')}
          </Text>
        </View>
        <View style={[styles.row, {borderBottomWidth: 0}]}>
          <Text style={styles.tableHeader}>Site Visits</Text>
          <View style={styles.line} />
          <Text style={styles.tableValue}>
            {mapTaskToCount(tasksData, 'Site Visit')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    width: '100%',
    paddingHorizontal: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateView: {
    borderWidth: 1,
    borderColor: theme.colors.GREY_LIGHT,
    borderRadius: 10,
    height: '60%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: '1%',
    paddingHorizontal: '2%',
  },
  upcomingParent: {
    height: '60%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  upcoming: {
    backgroundColor: '#FEC100',
    paddingHorizontal: '3.5%',
    paddingVertical: '3%',
    color: '#000',
  },
  overdue: {
    backgroundColor: theme.colors.RED,
    paddingHorizontal: '3.5%',
    paddingVertical: '3%',
    color: '#fff',
  },
  completed: {
    backgroundColor: theme.colors.GREEN,
    paddingHorizontal: '3.5%',
    paddingVertical: '3%',
    color: '#fff',
  },
  taskType: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: theme.colors.GREY_LIGHT,
    width: '40%',
    height: '90%',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.colors.GREY_LIGHT,
    width: '100%',
    alignItems: 'center',
  },
  tableHeader: {
    width: '74%',
    fontWeight: 'bold',
    paddingLeft: '5%',
  },
  tableValue: {
    width: '25%',
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 0,
  },
  line: {
    height: '100%',
    width: 1,
    backgroundColor: theme.colors.GREY_LIGHT,
  },
  noTasks: {
    color: theme.colors.GREY_LIGHT,
  },
});

const mapStateToProps = (state: any) => {
  return {
    tasks: state.tasks,
  };
};
export default connect(mapStateToProps)(TasksSection);
