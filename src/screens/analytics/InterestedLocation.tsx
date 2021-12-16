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

const InterestedLocation: FunctionComponent<props> = ({
  analytics,
  user,
  analyticsFilter,
}) => {
  const dispatcher = useDispatch();
  const navigation = useNavigation();

  const [interestedLocation, setInterestedLocation] = useState({});
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<any[]>([]);
  useEffect(() => {
    if (analytics.leadAnalytics) {
      const data: any = arrangeAnalyticsData(analytics, 'location');
      setTotal(data.sum);
      setInterestedLocation(data.sortedData);
    }

    if (analytics.analyticsData) {
      const data: any = arrangeAnalyticsData(analytics, 'location');
      setTableData(data.tempTableData);
      setInterestedLocation(data.sortedData);
    }
  }, [analytics]);

  const onDrillDown = (
    uid: string | undefined,
    location: string,
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
    if (location !== 'Total') {
      filters['location'] = [location];
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
      <Text style={styles.title}>Interested Locations</Text>
      <CustomBarChart
        data={interestedLocation}
        colors={['#1F639C', '#3CAEA2']}
      />
      {user.role === 'Team Lead' || user.role === 'Lead Manager' ? (
        <OrgDataTable
          data={tableData}
          title={'Interested Location Summary'}
          style={{marginTop: 30}}
          onDrillDown={onDrillDown}
        />
      ) : (
        <DataTable
          style={styles.table}
          title={'Interested Location Summary'}
          head={['Location Name', 'Count']}
          data={interestedLocation}
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

export default connect(mapStateToProps)(InterestedLocation);
