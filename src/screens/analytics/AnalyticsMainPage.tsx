import React, {FunctionComponent} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import FollowUpTable from '../../Components/Analytics/FollowUpTable';
import LeadCountAnalytics from '../../Components/Analytics/LeadCountAnalytics';
import Loader from '../../Components/Modals/Loader';

type props = {
  navigation: any;
  analytics: any;
};

const AnalyticsMainPage: FunctionComponent<props> = ({
  navigation,
  analytics,
}) => {
  const [totalCounts, setTotalCounts] = useState(0);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (analytics.leadAnalytics) {
      let total = 0;
      Object.keys(analytics.leadAnalytics.stage).forEach((key) => {
        total += analytics.leadAnalytics.stage[key];
      });
      setTotalCounts(total);
    }
  }, [analytics]);
  return (
    <>
    {load === true && <Loader show={load} />}
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
      <FollowUpTable style={styles.tasksTableStyle} />
    </ScrollView>
    </>
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

export default connect(mapStateToProps)(AnalyticsMainPage);
