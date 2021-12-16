import React, {FunctionComponent, useEffect} from 'react';
import {useState} from 'react';
import {ScrollView, Text, StyleSheet} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import FeedbackChart from '../../Components/Analytics/FeedbackChart';
import CustomBarChart from '../../Components/Analytics/CustomBarChart';
import OrgDataTable from '../../Components/Analytics/OrgDataTable';
import {getFilterDates} from '../../Services/drilldown';
import {updateLeadType} from '../../redux/actions';
import {useNavigation} from '@react-navigation/core';

type props = {
  analytics: any;
  analyticsFilter: any;
};
const OrgFeedbackScreen: FunctionComponent<props> = ({
  analytics,
  analyticsFilter,
}) => {
  const [counts, setCounts] = useState<{[key: string]: number}>({
    FRESH: 0,
    INTERESTED: 0,
    CALLBACK: 0,
    WON: 0,
    'NOT INTERESTED': 0,
    LOST: 0,
  });
  const [tableData, setTableData] = useState<any[]>([]);
  const dispatcher = useDispatch();
  const navigation = useNavigation();

  const onDrillDown = (
    uid: string | undefined,
    stage: string,
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
    if (stage !== 'Total') {
      filters['stage'] = [stage];
    }
    dispatcher(updateLeadType('DRILLDOWN'));
    navigation.navigate('DrillDown', {
      basicFilters: filters,
      leadCount: count,
      uid,
      role,
    });
  };

  useEffect(() => {
    if (analytics.analyticsData) {
      let total = 0;
      let tempCounts: {[key: string]: number} = {
        FRESH: 0,
        CALLBACK: 0,
        INTERESTED: 0,
        WON: 0,
        'NOT INTERESTED': 0,
        LOST: 0,
      };
      let tempTableData: any[] = [];
      Object.keys(analytics.analyticsData).forEach((key) => {
        let stageData = JSON.parse(
          JSON.stringify(analytics.analyticsData[key].leadAnalytics.stage),
        );
        delete stageData['Pending'];
        delete stageData['Completed'];
        tempTableData.push({[key]: stageData});
      });
      setTableData(tempTableData);
      Object.values(analytics.analyticsData).forEach((userAnalytics: any) => {
        Object.keys(userAnalytics.leadAnalytics.stage).forEach((key) => {
          if (key !== 'Pending' && key !== 'Completed') {
            total += userAnalytics.leadAnalytics.stage[key];
          }
        });
        const analyticsCount = userAnalytics.leadAnalytics.stage;
        Object.keys(tempCounts).forEach((key) => {
          if (analyticsCount[key]) {
            tempCounts[key] += analyticsCount[key];
          }
        });
      });
      setCounts(tempCounts);
    }
  }, [analytics]);

  return (
    <ScrollView
      style={styles.parent}
      contentContainerStyle={{paddingBottom: 50}}>
      <Text style={styles.title}>Feedback Chart</Text>
      <CustomBarChart
        data={counts}
        colors={[
          '#173F5F',
          '#1F639C',
          '#ED563B',
          '#3CAEA3',
          '#8B9D7D',
          '#F6D65D',
        ]}
        barDist={90}
      />
      <OrgDataTable
        data={tableData}
        title={'Feedback Summary'}
        style={{marginTop: 30}}
        onDrillDown={onDrillDown}
        customHeader={[
          'FRESH',
          'CALLBACK',
          'INTERESTED',
          'WON',
          'NOT INTERESTED',
          'LOST',
        ]}
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

export default connect(mapStateToProps)(OrgFeedbackScreen);
