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

const OverdueTasksTrend: FunctionComponent<props> = ({analytics}) => {
  const [tasksSum, setTasksSum] = useState<{
    keys: any[];
    values: number[];
  }>({keys: [], values: []});

  useEffect(() => {
    if (analytics.overdueAnalytics) {
      const sortedDates = Object.keys(analytics.overdueAnalytics.chart).sort(
        sortDates,
      );
      const values: number[] = [];
      sortedDates.forEach((key) => {
        values.push(analytics.overdueAnalytics.chart[key]);
      });
      setTasksSum({keys: sortedDates, values});
    }
  }, [analytics.overdueAnalytics]);
  return (
    <View style={styles.parent}>
      <Text style={styles.title}>Overdue Tasks</Text>
      <CustomLineChart
        style={styles.lineChartStyle}
        data={tasksSum.values}
        xAxis={tasksSum.keys}
        lineColor={'#F18F7E'}
        pointColor={'#A6301B'}
        labelColor={'#7CA2C4'}
      />
      <TasksTable
        tasks={
          analytics.overdueAnalytics.report
            ? analytics.overdueAnalytics.report
            : {}
        }
        type={'Overdue'}
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

export default connect(mapStateToProps)(OverdueTasksTrend);
