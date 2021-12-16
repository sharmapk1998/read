import React, {FunctionComponent} from 'react';
import {StyleSheet, View, Text, ViewStyle} from 'react-native';
import {PieChart} from 'react-native-svg-charts';
import {Text as SVGText, G} from 'react-native-svg';
import {widthToDp} from '../../values/size';
import {properFormat} from '../../Services/format';

type props = {
  counts: {[key: string]: number};
  totalCount: number;
  style?: ViewStyle;
};
const FeedbackChart: FunctionComponent<props> = ({
  counts,
  totalCount,
  style,
}) => {
  const pieColors = [
    '#173F5F',
    '#1F639C',
    '#ED563B',
    '#3CAEA3',
    '#8B9D7D',
    '#F6D65D',
  ];
  const pieData = Object.keys(counts).map((key, index) => ({
    value: counts[key],
    percent: `${Math.floor((counts[key] / totalCount) * 100)}%`,
    svg: {
      fill: pieColors[index],
    },
    key: `pie-${index}`,
  }));

  const pieData0 = Object.keys(counts).map((key, index) => ({
    value: counts[key],
    percent: `0%`,
    svg: {
      fill: pieColors[index],
    },
    key: `pie-${index}`,
  }));

  console.log(totalCount)
  
  const Labels = ({slices, height, width}: any) => {
    return slices.map((slice: any, index: number) => {
      const {labelCentroid, data} = slice;
      if (data.value === 0) {
        return;
      }
      return (
        <G key={index}>
          <SVGText
            fill={'white'}
            fontSize={16}
            stroke={'black'}
            strokeWidth={0.2}
            x={labelCentroid[0]}
            y={labelCentroid[1]}
            textAnchor={'middle'}
            alignmentBaseline={'middle'}>
            {data.percent}
          </SVGText>
        </G>
      );
    });
  };
  return (
    <View style={[styles.chartView, style]}>
      <PieChart
        style={{height: widthToDp(60), width: '100%'}}
        data={totalCount===0?pieData0:pieData}
        labelRadius={widthToDp(23)}
        innerRadius={2}>
        <Labels />
      </PieChart>
      <View style={styles.labelsContainer}>
        <View style={styles.labelRow}>
          {Object.keys(counts).map((key, index) => {
            if (index < 3) {
              return (
                <View key={index} style={styles.labelParent}>
                  <View
                    style={[
                      styles.colorBlock,
                      {backgroundColor: pieColors[index]},
                    ]}
                  />
                  <Text style={styles.label}>
                    {properFormat(key === 'CALLBACK' ? 'Call Back' : key)}
                  </Text>
                </View>
              );
            }
          })}
        </View>
        <View style={styles.labelRow}>
          {Object.keys(counts).map((key, index) => {
            if (index >= 3) {
              return (
                <View key={index} style={styles.labelParent}>
                  <View
                    style={[
                      styles.colorBlock,
                      {backgroundColor: pieColors[index]},
                    ]}
                  />
                  <Text style={styles.label}>
                    {properFormat(key === 'CALLBACK' ? 'Call Back' : key)}
                  </Text>
                </View>
              );
            }
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartView: {
    backgroundColor: '#F9F9F9',
    paddingVertical: 20,
  },
  labelsContainer: {
    marginTop: 13,
    width: '100%',
    paddingHorizontal: '5%',
  },
  labelRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelParent: {flexDirection: 'row', alignItems: 'center'},
  colorBlock: {
    marginRight: 5,
    height: 10,
    width: 10,
  },
  label: {
    fontSize: 13,
  },
});

export default FeedbackChart;
