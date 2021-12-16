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
import Snackbar from 'react-native-snackbar';

type props = {
  analytics: any;
  user: any;
  analyticsFilter: any;
};

const InterestedBudget: FunctionComponent<props> = ({
  analytics,
  user,
  analyticsFilter,
}) => {
  const dispatcher = useDispatch();
  const navigation = useNavigation();
  const [interestedBudget, setInterestedBudget] = useState({});
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<any[]>([]);
  useEffect(() => {
    if (analytics.leadAnalytics) {
      const data: any = arrangeAnalyticsData(analytics, 'budget');
      setTotal(data.sum);
      setInterestedBudget(data.sortedData);
    }

    if (analytics.analyticsData) {
      const data: any = arrangeAnalyticsData(analytics, 'budget');
      setTableData(data.tempTableData);
      setInterestedBudget(data.sortedData);
    }
  }, [analytics]);

  const onDrillDown = (
    uid: string | undefined,
    budget: string,
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
    if (budget !== 'Total') {
      filters['budget'] = [budget];
    }
    // if (analyticsFilter.teamWise=== 'true') {
    //   Snackbar.show({
    //     text: 'Drilldown Not Available',
    //     duration: Snackbar.LENGTH_SHORT,
    //   });
    // }
    {
      filters['stage'] = ['INTERESTED'];
      dispatcher(updateLeadType('DRILLDOWN'));
      navigation.navigate('DrillDown', {
      basicFilters: filters,
      leadCount: count,
      uid,
      role,
    });
  }
  };
// console.log("filter",analyticsFilter.teamWise)

  return (
    <ScrollView
      style={styles.parent}
      contentContainerStyle={{paddingBottom: 50}}>
      <Text style={styles.title}>Interested Budget</Text>
      <CustomBarChart data={interestedBudget} colors={['#8B9D7D', '#F6D65D']} />
      {user.role === 'Team Lead' || user.role === 'Lead Manager' ? (
        <OrgDataTable
          data={tableData}
          title={'Interested Budget Summary'}
          style={{marginTop: 30}}
          onDrillDown={onDrillDown}
        />
      ) : (
        <DataTable
          style={styles.table}
          title={'Interested Budget Summary'}
          head={['Budget Category', 'Count']}
          data={interestedBudget}
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

export default connect(mapStateToProps)(InterestedBudget);
