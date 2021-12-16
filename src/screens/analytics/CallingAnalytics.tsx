import {useNavigation} from '@react-navigation/core';
import React, {FunctionComponent, useState} from 'react';
import {useEffect} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import CallingTable from '../../Components/Analytics/CallingTable';
import CustomLineChart from '../../Components/Analytics/CustomLineChart';
import OrgDataTable from '../../Components/Analytics/OrgDataTable';
import {updateLeadType} from '../../redux/actions';
import {sortDates} from '../../Services/analytics';
import {getFilterDates} from '../../Services/drilldown';
import {heightToDp} from '../../values/size';
type props = {
  user: any;
  analytics: any;
  analyticsFilter: any;
};

const CallingAnalytics: FunctionComponent<props> = ({
  analytics,
  user,
  analyticsFilter,
}) => {
  const dispatcher = useDispatch();
  const navigation = useNavigation();

  const [callLogAnalytics, setCallLogAnalytics] = useState<{
    keys: any[];
    values: string[];
  }>({keys: [], values: []});

  useEffect(() => {
    if (analytics.callLogAnalytics) {
      const sortedDates = Object.keys(analytics.callLogAnalytics).sort(
        sortDates,
      );
      const values: string[] = [];
      sortedDates.forEach((key) => {
        values.push(analytics.callLogAnalytics[key]);
      });

      setCallLogAnalytics({keys: sortedDates, values: values});
    }
  }, [analytics]);
  const onDrillDown = (
    uid: string | undefined,
    duration: string,
    count: any,
    role: boolean,
  ) => {
    const dateFilter = analyticsFilter.analyticsType;
    let filters: any = {};
    let groupFeild = 'created_at';
    if (dateFilter !== 'All') {
      const {startDate, endDate} = getFilterDates(
        analyticsFilter.analyticsType,
      );
      filters['created_at'] = [startDate, endDate];
    }

    if (duration !== 'Total') {
      filters['duration'] = duration;
    }
    dispatcher(updateLeadType('CALL'));
    navigation.navigate('CallingDrillDown', {
      basicFilters: filters,
      callCount: count,
      uid,
      groupFeild,
      role,
    });
  };
  return (
    <ScrollView
      style={styles.parent}
      contentContainerStyle={{paddingBottom: 50}}>
      <Text style={styles.title}>Calling Trend</Text>
      <CustomLineChart
        style={styles.lineChartStyle}
        data={callLogAnalytics.values}
        xAxis={callLogAnalytics.keys}
        lineColor={'#3489A5'}
        pointColor={'#004C6D'}
        labelColor={'#F08585'}
      />
      {user.role === 'Team Lead' || user.role === 'Lead Manager' ? (
        <OrgDataTable
          data={analytics.callLogReport}
          title={'Calling Report'}
          style={{marginTop: 30}}
          onDrillDown={onDrillDown}
          customHeader={['0 Sec', '0-30 Sec', '30-60 Sec', '60-120 Sec', '>120 Sec']}
        />
      ) : (
        <CallingTable
          data={analytics.callLogReport}
          title={'Calling Report'}
          style={{marginTop: 30}}
          customHeader={['0 Sec', '0-30 Sec', '30-60 Sec', '60-120 Sec', '>120 Sec']}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
  },
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 20,
  },
  table: {
    marginTop: 50,
  },
  lineChartStyle: {
    height: heightToDp(35),
    backgroundColor: '#F9F9F9',
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    analytics: state.analytics,
    analyticsFilter: state.filters.analyticsFilter,
  };
};

export default connect(mapStateToProps)(CallingAnalytics);
