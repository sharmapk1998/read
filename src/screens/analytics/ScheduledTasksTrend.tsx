import React, {FunctionComponent} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import CustomLineChart from '../../Components/Analytics/CustomLineChart';
import TasksTable from '../../Components/Analytics/TasksTable';
import {sortDates} from '../../Services/analytics';
import moment from 'moment';

type props = {
  analytics: any;
};

const ScheduledTasksTrend: FunctionComponent<props> = ({analytics}) => {
  const [tasksSum, setTasksSum] = useState<{
    keys: any[];
    values: number[];
  }>({keys: [], values: []});
  useEffect(() => {
    if (analytics.pendingAnalytics) {
      const sortedDates = Object.keys(analytics.pendingAnalytics.chart).sort(
        sortDates,
      );
      const values: number[] = [];
      sortedDates.forEach((key) => {
        values.push(analytics.pendingAnalytics.chart[key]);
      });
      setTasksSum({keys: sortedDates, values});
    }
    console.log('sortDates -- ',sortDates)
  }, [analytics.pendingAnalytics]);
  return (
    <View style={styles.parent}>
      <Text style={styles.title}>Pending Tasks</Text>
      <CustomLineChart
        style={styles.lineChartStyle}
        data={tasksSum.values}
        xAxis={tasksSum.keys}
        lineColor={'#77C5BD'}
        pointColor={'#16796F'}
        labelColor={'#F09380'}
      />
      <TasksTable
        tasks={
          analytics.pendingAnalytics.report
            ? analytics.pendingAnalytics.report
            : {}
        }
        type={'Scheduled'}
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

export default connect(mapStateToProps)(ScheduledTasksTrend);
