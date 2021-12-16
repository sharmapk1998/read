import {useNavigation} from '@react-navigation/core';
import React, {FunctionComponent} from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TouchableOpacity,
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import {updateLeadType} from '../../redux/actions';
import {getFilterDates} from '../../Services/drilldown';
import {widthToDp} from '../../values/size';
import Snackbar from 'react-native-snackbar';

type props = {
  style?: ViewStyle;
  analytics: any;
  analyticsFilter: any;
};

const countTemplate = {
  FRESH: 0,
  INTERESTED: 0,
  CALLBACK: 0,
  WON: 0,
  'NOT INTERESTED': 0,
  LOST: 0,
  Completed: 0,
  Pending: 0,
};

const LeadCountAnalytics: FunctionComponent<props> = ({
  style,
  analytics,
  analyticsFilter,
}) => {
  const navigation = useNavigation();
  const dispatcher = useDispatch();

  const [counts, setCounts] = useState<{[key: string]: number}>({
    FRESH: 0,
    INTERESTED: 0,
    CALLBACK: 0,
    WON: 0,
    'NOT INTERESTED': 0,
    LOST: 0,
    Completed: 0,
    Pending: 0,
  });

  useEffect(() => {
    if (analytics.leadAnalytics) {
      let tempCounts: {[key: string]: number} = {...countTemplate};
      const analyticsCount = analytics.leadAnalytics.stage;
      Object.keys(tempCounts).forEach((key) => {
        if (analyticsCount[key]) {
          tempCounts[key] = analyticsCount[key];
        }
      });
      setCounts({
        ...tempCounts,
        Pending: analytics.taskCount.pendingCount,
        Completed: analytics.taskCount.completedCount,
      });
    }
    // console.log(analytics)
    if (analytics.analyticsData) {
      let tempCounts: {[key: string]: number} = {...countTemplate};
      Object.values(analytics.analyticsData).forEach((userAnalytics: any) => {
        const analyticsCount = userAnalytics.leadAnalytics.stage;
        Object.keys(tempCounts).forEach((key) => {
          if (analyticsCount[key]) {
            tempCounts[key] += analyticsCount[key];
          }
        });
      });

      setCounts({
        ...tempCounts,
        Pending: analytics.taskCount.pendingCount,
        Completed: analytics.taskCount.completedCount,
      });
    }
  }, [analytics]);

  const onDrillDown = (stage: string, count: any, role: boolean) => {
    // dispatcher(updateLeadType('DRILLDOWN'));
    // let basicFilters = getLeadCountFilter(analyticsFilter.analyticsType, stage);
    // navigation.navigate('DrillDown', {basicFilters, leadCount: count, role});
    Snackbar.show({
      text: 'Drilldown Not Available',
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const onTaskDrillDown = (
    type: 'Completed' | 'Scheduled',
    count: any,
    role: boolean,
  ) => {
    Snackbar.show({
      text: 'Drilldown Not Available',
      duration: Snackbar.LENGTH_SHORT,
    });
    // const dateFilter = analyticsFilter.analyticsType;
    // let filters: any = {};
    // let groupFeild = '';
    // if (dateFilter !== 'All') {
    //   const {startDate, endDate} = getFilterDates(
    //     analyticsFilter.analyticsType,
    //   );
    //   if (type === 'Completed') {
    //     filters['completed_at'] = [startDate, endDate];
    //   } else {
    //     filters['due_date'] = [startDate, endDate];
    //   }
    // }
    // if (type === 'Completed') {
    //   groupFeild = 'completed_at';
    //   filters['status'] = [type];
    // } else {
    //   groupFeild = 'due_date';
    //   filters['status'] = ['Pending', 'Overdue'];
    // }
    // filters['type'] = ['Meeting', 'Site Visit'];
    // dispatcher(updateLeadType('TASKS'));
    // navigation.navigate('TaskDrillDown', {
    //   basicFilters: filters,
    //   taskCount: count,
    //   groupFeild,
    //   role,
    // });
  };

  return (
    <View style={[styles.parent, style]}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.block}
          onPress={() => onDrillDown('FRESH', counts.FRESH, true)}>
          <Text style={styles.count}>{counts.FRESH}</Text>
          <Text style={[styles.text, {color: '#073B3A'}]}>Fresh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.block}
          onPress={() => onDrillDown('CALLBACK', counts.CALLBACK, true)}>
          <Text style={styles.count}>{counts.CALLBACK}</Text>
          <Text style={[styles.text, {color: '#191919'}]}>Call Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.block}
          onPress={() => onDrillDown('INTERESTED', counts.INTERESTED, true)}>
          <Text style={styles.count}>{counts.INTERESTED}</Text>
          <Text style={[styles.text, {color: '#87CBAC'}]}>Interested</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.block}
          onPress={() => onDrillDown('WON', counts.WON, true)}>
          <Text style={styles.count}>{counts.WON}</Text>
          <Text style={[styles.text, {color: '#2CBE17'}]}>Closed Won</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.block}
          onPress={() =>
            onDrillDown('NOT INTERESTED', counts['NOT INTERESTED'], true)
          }>
          <Text style={styles.count}>{counts['NOT INTERESTED']}</Text>
          <Text style={[styles.text, {color: '#D83B2A'}]}>Not Interested</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.block}
          onPress={() => onDrillDown('LOST', counts.LOST, true)}>
          <Text style={styles.count}>{counts.LOST}</Text>
          <Text style={[styles.text, {color: '#FFB310'}]}>Closed Lost</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.block}
          onPress={() => onTaskDrillDown('Completed', counts.Completed, true)}>
          <Text style={styles.count}>{counts.Completed}</Text>
          <Text style={[styles.text, {color: '#279F9F'}]}>
            Completed Visits
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.block}
          onPress={() => onTaskDrillDown('Scheduled', counts.Pending, true)}>
          <Text style={styles.count}>{counts.Pending}</Text>
          <Text style={[styles.text, {color: '#EE6352'}]}>
            Scheduled Visits
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: 15,
  },
  block: {
    minHeight: 80,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,
    width: '22.5%',
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  count: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  text: {
    marginTop: 2,
    fontSize: widthToDp(3.6),
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%',
  },
});

const mapStateToProps = (state: any) => {
  return {
    analytics: state.analytics,
    analyticsFilter: state.filters.analyticsFilter,
  };
};

export default connect(mapStateToProps)(LeadCountAnalytics);
