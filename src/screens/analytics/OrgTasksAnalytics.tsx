import {useNavigation} from '@react-navigation/core';
import React, {FunctionComponent} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import CustomBarChart from '../../Components/Analytics/CustomBarChart';
import OrgDataTable from '../../Components/Analytics/OrgDataTable';
import {updateLeadType} from '../../redux/actions';
import {arrangeOrgTasksAnalytics} from '../../Services/analytics';
import {getFilterDates} from '../../Services/drilldown';

type props = {
  analytics: any;
  route: any;
  analyticsFilter: any;
};

const OrgScheduledTasks: FunctionComponent<props> = ({
  analytics,
  route,
  analyticsFilter,
}) => {
  const dispatcher = useDispatch();
  const navigation = useNavigation();
  const type = route.params.type;
  const [schduledTasks, setSchduledTasks] = useState({});
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    if (analytics.analyticsData) {
      const data = arrangeOrgTasksAnalytics(analytics.analyticsData, type);
      setSchduledTasks(data.data);
      setTableData(data.tempTableData);
    }
  }, [analytics]);

  const onDrillDown = (                                   //drillDown error work here
    uid: string | undefined,
    taskType: string,
    count: any,
    role: boolean,
  ) => {
    const dateFilter = analyticsFilter.analyticsType;
    let filters: any = {};
    let groupFeild = '';
    if (dateFilter !== 'All') {
      const {startDate, endDate} = getFilterDates(
        analyticsFilter.analyticsType,
      );
      if (type === 'Completed') {
        filters['completed_at'] = [startDate, endDate];
      } else {
        filters['due_date'] = [startDate, endDate];
      }
    }
    if (type === 'Completed') {
      groupFeild = 'completed_at';
    } else {
      groupFeild = 'due_date';
    }
    if (taskType !== 'Total') {
      filters['type'] = [taskType];
    }
    
    filters['status'] = [type];
    dispatcher(updateLeadType('TASKS'));
    navigation.navigate('TaskDrillDown', {
      basicFilters: filters,
      taskCount: count,
      uid,
      groupFeild,
      role,
    });
  };

  return (
    <ScrollView
      style={styles.parent}
      contentContainerStyle={{paddingBottom: 50}}>
      <Text style={styles.title}>{`${type} Tasks`}</Text>
      <CustomBarChart
        data={schduledTasks}
        colors={
          type === 'Pending'
            ? ['#D83B2A']
            : type === 'Overdue'
            ? ['#279F9F']
            : ['#87CBAC']
        }
      />
      <OrgDataTable
        data={tableData}
        title={`${type} Tasks Summary`}
        style={{marginTop: 30}}
        customHeader={['Call Back', 'Site Visit', 'Meeting']}
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

export default connect(mapStateToProps)(OrgScheduledTasks);
