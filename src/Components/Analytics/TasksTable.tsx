import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleSheet, Text, View, ViewStyle, FlatList} from 'react-native';
import theme from '../../values/theme';
import {sortAnalyticsTasks} from '../../Services/analytics';

type props = {
  tasks: any;
  style?: ViewStyle;
  type: 'Scheduled' | 'Completed' | 'Overdue';
};

const TasksTable: FunctionComponent<props> = ({style, tasks, type}) => {
  const [tasksData, setTasksData] = useState<any[]>([]);
  const [totalTasks, setTotalTasks] = useState<{[key: string]: number}>({});

  useEffect(() => {
    let tempData: any[] = [];
    const sum: {[key: string]: number} = {
      'Site Visit': 0,
      'Call Back': 0,
      Meeting: 0,
    };
    Object.keys(tasks).forEach((key) => {
      const task = tasks[key];
      const data = {date: key, ...task};
      tempData.push(data);
      Object.keys(task).forEach((key: any) => {
        if (task[key]) {
          sum[key] += task[key];
        }
      });
    });
    setTasksData(tempData.sort(sortAnalyticsTasks));
    setTotalTasks(sum);
  }, [tasks]);
console.log("TaskCount--- ",totalTasks)
  const TaskRow = ({item, index}: {item: any; index: number}) => {
    return (
      <View
        style={
          index % 2 !== 0
            ? styles.row
            : [styles.row, {backgroundColor: '#E5E5E5'}]
        }>
        <Text style={[styles.trText, {fontSize: 12}]} numberOfLines={1}>
          {item.date}
        </Text>
        <Text style={[styles.trText, {textAlign: 'center'}]}>
          {item['Call Back'] ? item['Call Back'] : 0}
        </Text>
        <Text style={[styles.trText, {textAlign: 'center'}]}>
          {item['Meeting'] ? item['Meeting'] : 0}
        </Text>
        <Text style={[styles.trText, {textAlign: 'center'}]}>
          {item['Site Visit'] ? item['Site Visit'] : 0}
        </Text>
      </View>
    );
  };
  return (
    <View style={[styles.parent, style]}>
      <Text style={styles.header}>{`${
        type === 'Scheduled' ? 'Pending' : type
      } Tasks Summary`}</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.thText}>Date</Text>
          <Text style={styles.thText}>Call Back</Text>
          <Text style={styles.thText}>Meeting</Text>
          <Text style={styles.thText}>Site Visit</Text>
        </View>
        <View style={[styles.row, {backgroundColor: theme.colors.PRIMARY}]}>
          <Text style={styles.total}>Total</Text>
          <Text style={styles.total}>{totalTasks['Call Back']}</Text>
          <Text style={styles.total}>{totalTasks['Meeting']}</Text>
          <Text style={styles.total}>{totalTasks['Site Visit']}</Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{height: '50%'}}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingBottom: 20}}
          data={tasksData}
          renderItem={TaskRow}
        />
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
    width: '22%',
  },

  trText: {
    fontSize: 15.5,
    width: '21%',
  },
  total: {
    color: '#fff',
    fontSize: 15.5,
    fontWeight: 'bold',
    width: '21%',
    textAlign: 'center',
  },
});

const mapStateToProps = (state: any) => {
  return {
    analytics: state.analytics,
  };
};

export default TasksTable;
