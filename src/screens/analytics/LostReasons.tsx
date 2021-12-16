import {useNavigation} from '@react-navigation/core';
import React, {FunctionComponent} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import CustomPieChart from '../../Components/Analytics/CustomPieChart';
import OrgDataTable from '../../Components/Analytics/OrgDataTable';
import {updateLeadType} from '../../redux/actions';
import {arrangeAnalyticsData} from '../../Services/analytics';
import {getFilterDates} from '../../Services/drilldown';

type props = {
  analytics: any;
  analyticsFilter: any;
};

const LostReasons: FunctionComponent<props> = ({
  analytics,
  analyticsFilter,
}) => {
  const dispatcher = useDispatch();
  const navigation = useNavigation();

  const [lostReasons, setLostReasons] = useState({});
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<any[]>([]);
  useEffect(() => {
    if (analytics.analyticsData) {
      const data: any = arrangeAnalyticsData(analytics, 'lost_reason');
      setTableData(data.tempTableData);
      setLostReasons(data.sortedData);
      setTotal(data.sum);
    }
  }, [analytics]);

  const onDrillDown = (
    uid: string | undefined,
    lost_reason: string,
    count: any,
    role: boolean,
  ) => {
    const dateFilter = analyticsFilter.analyticsType;
    let filters: any = {};
    if (dateFilter !== 'All') {
      const {startDate, endDate} = getFilterDates(
        analyticsFilter.analyticsType,
      );
      filters['lead_assign_time'] = [startDate, endDate];
    }
    if (lost_reason !== 'Total') {
      filters['lost_reason'] = [lost_reason];
    }
    filters['stage'] = ['LOST'];
    dispatcher(updateLeadType('DRILLDOWN'));
    navigation.navigate('DrillDown', {
      basicFilters: filters,
      leadCount: count,
      uid,
      role,
    });
  };

  return (
    <ScrollView
      style={styles.parent}
      contentContainerStyle={{paddingBottom: 50}}>
      <Text style={styles.title}>Lost Reasons</Text>
      <CustomPieChart
        data={lostReasons}
        totalCount={total}
        pieColors={[
          '#173F5F',
          '#1F639C',
          '#ED563B',
          '#3CAEA3',
          '#8B9D7D',
          '#F6D65D',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ]}
        pieRadius={50}
      />
      <OrgDataTable
        data={tableData}
        title={'Closed Lost Summary'}
        style={{marginTop: 30}}
        other
        onDrillDown={onDrillDown}
      />
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
});

const mapStateToProps = (state: any) => {
  return {
    analytics: state.analytics,
    analyticsFilter: state.filters.analyticsFilter,
  };
};

export default connect(mapStateToProps)(LostReasons);
