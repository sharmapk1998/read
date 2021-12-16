import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, View, Text, ViewStyle} from 'react-native';
import {PieChart} from 'react-native-svg-charts';
import {Text as SVGText, G} from 'react-native-svg';
import {widthToDp} from '../../values/size';
import {chunk, getLegend, properFormat} from '../../Services/format';
import {useEffect} from 'react';

type props = {
  data: {[key: string]: number};
  totalCount: number;
  pieColors: string[];
  style?: ViewStyle;
  pieRadius?: number;
};

const CustomPieChart: FunctionComponent<props> = ({
  data,
  totalCount,
  pieColors,
  style,
  pieRadius,
}) => {
  const [labels, setLabels] = useState<string[][]>([]);
  useEffect(() => {
    setLabels(chunk(Object.keys(data), 3));
  }, [data]);
  // console.log("pks",data[''])
  const pieData = Object.keys(data).map((key, index) => ({
    value: data[key],
    percent: `${Math.floor((data[key] / totalCount) * 100)}%`,
    svg: {
      fill: pieColors[index],
      onPress: () => console.log('press', index),
    },
    key: `pie-${index}`,
  }));
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
  // console.log("pks",pieData)
  return (
    <View style={[styles.chartView, style]}>
      <PieChart
        style={{height: widthToDp(60), width: '100%'}}
        data={pieData}
        labelRadius={widthToDp(23)}
        innerRadius={pieRadius ? pieRadius : 2}>
        <Labels />
      </PieChart>
      <View style={styles.labelsContainer}>
        {labels.map((row, index1) => (
          <View key={index1} style={styles.labelRow}>
            {row.map((key, index2) => {
              return (
                <View
                  key={String(index1) + String(index2)}
                  style={styles.labelParent}>
                  <View
                    style={[
                      styles.colorBlock,
                      {backgroundColor: pieColors[3 * index1 + index2]},
                    ]}
                  />
                  <Text style={styles.label} numberOfLines={2}>
                    {key}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
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
    width: '100%',
  },
  labelParent: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '32%',
  },
  colorBlock: {
    marginRight: 5,
    height: 10,
    width: 10,
  },
  label: {
    fontSize: 13,
    maxWidth: '85%',
  },
});

export default CustomPieChart;
