import React, {FunctionComponent, useEffect} from 'react';
import {useState} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import FeedbackChart from '../../Components/Analytics/FeedbackChart';
import DataTable from '../../Components/Analytics/DataTable';

type props = {
  analytics: any;
};
const FeedbackScreen: FunctionComponent<props> = ({analytics}) => {
  const [counts, setCounts] = useState<{[key: string]: number}>({
    FRESH: 0,
    CALLBACK: 0,
    INTERESTED: 0,
    WON: 0,
    'NOT INTERESTED': 0,
    LOST: 0,
  });
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    if (analytics.leadAnalytics) {
      let total = 0;
      let tempCounts: {[key: string]: number} = {...counts};
      const analyticsCount = analytics.leadAnalytics.stage;
      Object.keys(tempCounts).forEach((key) => {
        if (analyticsCount[key]) {
          tempCounts[key] = analyticsCount[key];
          total += analyticsCount[key];
        }
        else{
          tempCounts[key] =0;
        }
      });
      setTotalCount(total);
      setCounts(tempCounts);
    }
  }, [analytics]);
  console.log('total', totalCount)
  console.log('count', counts)
  return (
    <ScrollView
      style={styles.parent}
      contentContainerStyle={{paddingBottom: 50}}>
      <Text style={styles.title}>Feedback Chart</Text>
      <FeedbackChart counts={counts} totalCount={totalCount} />

      <DataTable
        style={styles.table}
        title={'Feedback Summary'}
        head={['Feedback Type', 'Count']}
        data={counts}
        total={totalCount}
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
  };
};

export default connect(mapStateToProps)(FeedbackScreen);
