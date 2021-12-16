import {useNavigation} from '@react-navigation/core';
import React, {FunctionComponent} from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import CustomBarChart from '../../Components/Analytics/CustomBarChart';
import DataTable from '../../Components/Analytics/DataTable';
import OrgDataTable from '../../Components/Analytics/OrgDataTable';
import {updateLeadType} from '../../redux/actions';
import {arrangeAnalyticsData, sortAnalytics} from '../../Services/analytics';
import {getFilterDates} from '../../Services/drilldown';

type props = {
  user: any;
  analytics: any;
  analyticsFilter: any;
};

const InterestedProjectTrend: FunctionComponent<props> = ({
  analytics,
  user,
  analyticsFilter,
}) => {
  const dispatcher = useDispatch();
  const navigation = useNavigation();
  const [interestedProjects, setInterestedProjects] = useState({});
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<any[]>([]);
  useEffect(() => {
    if (analytics.leadAnalytics) {
      const data: any = arrangeAnalyticsData(analytics, 'project');
      setTotal(data.sum);
      setInterestedProjects(data.sortedData);
    }

    if (analytics.analyticsData) {
      const data: any = arrangeAnalyticsData(analytics, 'project');
      setTableData(data.tempTableData);
      setInterestedProjects(data.sortedData);
    }
  }, [analytics]);

  const onDrillDown = (
    uid: string | undefined,
    project: string,
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
    if (project !== 'Total') {
      filters['project'] = [project];
    }
    filters['stage'] = ['INTERESTED'];
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
      <Text style={styles.title}>Interested Project</Text>
      <CustomBarChart
        data={interestedProjects}
        colors={['#ED563B', '#173F5F']}
      />
      {user.role === 'Team Lead' || user.role === 'Lead Manager' ? (
        <OrgDataTable
          data={tableData}
          title={'Interested Project Summary'}
          style={{marginTop: 30}}
          onDrillDown={onDrillDown}
        />
      ) : (
        <DataTable
          style={styles.table}
          title={'Interested Project Summary'}
          head={['Project Name', 'Count']}
          data={interestedProjects}
          total={total}
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
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    analytics: state.analytics,
    analyticsFilter: state.filters.analyticsFilter,
  };
};

export default connect(mapStateToProps)(InterestedProjectTrend);
