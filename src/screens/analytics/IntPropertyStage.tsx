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

const IntPropertyStage: FunctionComponent<props> = ({
  analytics,
  analyticsFilter,
}) => {
  const dispatcher = useDispatch();
  const navigation = useNavigation();

  const [propertyStage, setPropertyStage] = useState({});
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (analytics.analyticsData) {
      const data: any = arrangeAnalyticsData(analytics, 'propertyStage');
      setTableData(data.tempTableData);
      setPropertyStage(data.sortedData);
      setTotal(data.sum);
    }
  }, [analytics]);

  const onDrillDown = (
    uid: string | undefined,
    property_stage: string,
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
    if (property_stage !== 'Total') {
      filters['property_stage'] = [property_stage];
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
      <Text style={styles.title}>Interested Property Stage</Text>
      <CustomPieChart
        data={propertyStage}
        totalCount={total}
        pieColors={['#1F639C', '#3CAEA2']}
      />
      <OrgDataTable
        data={tableData}
        title={'Interested Property Stage'}
        style={{marginTop: 30}}
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

export default connect(mapStateToProps)(IntPropertyStage);
