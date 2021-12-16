import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleSheet, FlatList, View, Text} from 'react-native';
import {connect} from 'react-redux';
import Header from '../Components/Header';
import {formatAMPM, getNotificationTime} from '../Services/format';
import {toLocalDate} from '../Services/leads';
import {sortTask} from '../Services/tasks';
import {heightToDp} from '../values/size';
import theme from '../values/theme';
import Icon from 'react-native-vector-icons/Ionicons';
type props = {
  navigation: any;
  route: any;
  tasks: {[key: string]: any};
};

const TaskSection = ({item, index}: {item: any; index: number}) => {
  // console.log(item)
  return (
    <View style={{marginBottom: 15}}>
      <Text style={styles.date}>{item[0]}</Text>
      <View>
        {item[1].map((item: any, index: number) => (
          <View key={index} style={styles.taskView}>
            <View>
              <Text style={styles.taskType}>{item.type}</Text>
              <Text
                style={
                  item.status === 'Completed'
                    ? [styles.taskStatus, {color: theme.colors.GREEN}]
                    : item.due_date.toDate() < new Date()
                    ? [styles.taskStatus, {color: theme.colors.RED}]
                    : [styles.taskStatus, {color: theme.agenda.PENDING}]
                }>
                {item.status === 'Completed' || item.status === 'Cancelled' ||
                item.due_date.toDate() > new Date()
                  ? item.status
                  : 'Overdue'}
              </Text>
            </View>
            <Text style={styles.taskTime}>
              {item.completed_at
                ? getNotificationTime(item.completed_at)
                : getNotificationTime(item.due_date)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const AllTaskScreen: FunctionComponent<props> = ({
  navigation,
  route,
  tasks,
}) => {
  const [tasksData, setTasksData] = useState<{} | undefined>(undefined);
  const leadId = route.params.leadId;

  const arrangeData = (tasksList: any[]) => {
    const data: any = {};
    tasksList.forEach((task) => {
      const timestamp = task.due_date;
      const date = toLocalDate(timestamp);
      if (data.hasOwnProperty(date)) {
        data[date].push(task);
      } else {
        data[date] = [task];
      }
    });
    setTasksData(data);
  };

  useEffect(() => {
    if (tasks[leadId]?.tasks) {
      let taskUnSortedData = [...tasks[leadId]?.tasks];
      taskUnSortedData.sort(sortTask);
      arrangeData(taskUnSortedData);
    }
  }, [tasks]);

  return (
    <>
      <Header title={'Tasks'} onBack={() => navigation.goBack()} />
      {tasksData && Object.entries(tasksData).length !== 0 ? (
        <FlatList
          style={styles.parent}
          keyExtractor={(item, index) => index.toString()}
          data={Object.entries(tasksData)}
          renderItem={TaskSection}
          contentContainerStyle={{paddingBottom: heightToDp(2)}}
        />
      ) : (
        <View style={styles.noDataParent}>
          <Icon name={'calendar'} size={90} color={theme.nav_colors.PRIMARY} />
          <Text style={styles.noDataText}>No Tasks Available</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  date: {
    fontWeight: 'bold',
    color: theme.colors.GREY,
    fontSize: 14,
  },
  taskView: {
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  taskType: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  taskStatus: {
    fontSize: 14,
    marginTop: 7,
  },
  taskTime: {
    color: theme.colors.GREY,
    fontSize: 12,
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
    tasks: state.tasks,
  };
};

export default connect(mapStateToProps)(AllTaskScreen);
