import React, {FunctionComponent, useState} from 'react';
import {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import CustomLineChart from '../../Components/Analytics/CustomLineChart';
import {sortDates} from '../../Services/analytics';
type props = {
  user: any;
  analytics: any;
};

const TrendsScreen: FunctionComponent<props> = ({analytics, user}) => {
  const [interestedTrend, setInterestedTrend] = useState<{
    keys: any[];
    values: string[];
  }>({keys: [], values: []});

  useEffect(() => {
    if (analytics.interestedTrend) {
      const sortedDates = Object.keys(analytics.interestedTrend).sort(
        sortDates,
      );
      const values: string[] = [];
      sortedDates.forEach((key) => {
        values.push(analytics.interestedTrend[key]);
      });
      setInterestedTrend({keys: sortedDates, values: values});
    }
  }, [analytics]);

  return (
    <View style={styles.parent}>
      <CustomLineChart
        style={styles.lineChartStyle}
        title={'Interested Lead Trend'}
        data={interestedTrend.values}
        xAxis={interestedTrend.keys}
        lineColor={'#F6D65D'}
        pointColor={'#F6D65D'}
        labelColor={'#286783'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  lineChartStyle: {
    height: '38%',
    backgroundColor: '#F9F9F9',
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
    analytics: state.analytics,
  };
};

export default connect(mapStateToProps)(TrendsScreen);
