import React, {FunctionComponent} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import FeedbackChart from '../../Components/Analytics/FeedbackChart';
import LeadCountAnalytics from '../../Components/Analytics/LeadCountAnalytics';

type props = {
  navigation: any;
  analytics: any;
};

const OrgAnalyticsMainPage: FunctionComponent<props> = ({analytics}) => {
  const [counts, setCounts] = useState<{[key: string]: number}>({
    FRESH: 0,
    CALLBACK: 0,
    INTERESTED: 0,
    WON: 0,
    'NOT INTERESTED': 0,
    LOST: 0,
  });
  const [totalCounts, setTotalCounts] = useState(0);
  useEffect(() => {
    if (analytics.analyticsData) {
      let total = 0;
      let tempCounts: {[key: string]: number} = {
        FRESH: 0,
        INTERESTED: 0,
        CALLBACK: 0,
        WON: 0,
        'NOT INTERESTED': 0,
        LOST: 0,
      };
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
      setTotalCounts(total);
    }
  }, [analytics]);
  return (
    <ScrollView
      style={styles.parent}
      contentContainerStyle={{paddingBottom: 50}}>
      <View style={styles.headContainer}>
        <View style={styles.headTextContainer}>
          <Text style={styles.subHeadText}>Total number of</Text>
          <Text style={styles.headText}>Leads</Text>
        </View>
        <Text style={styles.count}>{totalCounts}</Text>
      </View>
      <LeadCountAnalytics style={styles.leadCountSection} />
      <FeedbackChart
        style={{marginTop: 25}}
        counts={counts}
        totalCount={totalCounts}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  headContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
  },
  headTextContainer: {},
  subHeadText: {
    color: '#000',
    fontSize: 15,
  },
  headText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  leadCountSection: {
    marginTop: 10,
    paddingHorizontal: '1.2%',
  },
  tasksTableStyle: {
    marginTop: 40,
    paddingHorizontal: '3%',
  },
});

const mapStateToProps = (state: any) => {
  return {
    analytics: state.analytics,
  };
};

export default connect(mapStateToProps)(OrgAnalyticsMainPage);
