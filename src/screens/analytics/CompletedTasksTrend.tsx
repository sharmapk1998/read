import React, {FunctionComponent} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import CustomLineChart from '../../Components/Analytics/CustomLineChart';
import TasksTable from '../../Components/Analytics/TasksTable';
import {sortDates} from '../../Services/analytics';

type props = {
  analytics: any;
};
sortDates;
const CompletedTasksTrend: FunctionComponent<props> = ({analytics}) => {
  const [tasksSum, setTasksSum] = useState<{
    keys: any[];
    values: number[];
  }>({keys: [], values: []});

  useEffect(() => {
    if (analytics.completedAnalytics) {
      const sortedDates = Object.keys(analytics.completedAnalytics.chart).sort(
        sortDates,
      );
      const values: number[] = [];
      sortedDates.forEach((key) => {
        values.push(analytics.completedAnalytics.chart[key]);
      });
      setTasksSum({keys: sortedDates, values});
    }
  }, [analytics.completedAnalytics]);

  return (
    <View style={styles.parent}>
      <Text style={styles.title}>Completed Tasks</Text>
      <CustomLineChart
        style={styles.lineChartStyle}
        data={tasksSum.values}
        xAxis={tasksSum.keys}
        lineColor={'#000000'}
        pointColor={'#000000'}
        labelColor={'#B3BFAA'}
      />
      <TasksTable
        tasks={
          analytics.completedAnalytics.report
            ? analytics.completedAnalytics.report
            : {}
        }
        type={'Completed'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 20,
  },
  lineChartStyle: {
    height: 250,
    backgroundColor: '#F9F9F9',
  },
});

const mapStateToProps = (state: any) => {
  return {
    analytics: state.analytics,
  };
};

export default connect(mapStateToProps)(CompletedTasksTrend);
