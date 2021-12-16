import React from 'react';
import {FunctionComponent} from 'react';
import {View, StyleSheet, ViewStyle, Text, ScrollView} from 'react-native';

import {LineChart, XAxis, Grid} from 'react-native-svg-charts';
import {Circle, G, Text as SVGText} from 'react-native-svg';
import {useRef} from 'react';

type props = {
  data: any;
  xAxis: string[];
  style?: ViewStyle;
  lineColor: string;
  pointColor: string;
  labelColor: string;
  title?: string;
};

const CustomLineChart: FunctionComponent<props> = ({
  data,
  xAxis,
  style,
  lineColor,
  pointColor,
  labelColor,
  title,
}) => {
  const scrollRef: any = useRef(null);
  const verticalContentInset = {left: 12, top: 15, bottom: 10, right: 12};
  const xAxisHeight = 30;
  const formatLabel = (date: string) => {
    // console.log("chart date -- ",date)
    const dateSplit = date.split('-');
    return dateSplit[0] + '/' + dateSplit[1];
  };
  // console.log("chart -- ",data)
  const Decorator = ({x, y, data}: any) => {
    
    return data.map((value: any, index: number) => (
      <G key={index} onPress={() => console.log('press', index)}>
        <Circle
          cx={x(index)}
          cy={y(value)}
          r={2.5}
          stroke={pointColor}
          fill={pointColor}
          onPress={() => console.log('press', index)}
        />
        <SVGText
          fill={labelColor}
          fontSize={11}
          strokeWidth={0.2}
          fontWeight={'bold'}
          x={x(index)}
          y={y(value) - 10}
          textAnchor={'middle'}
          alignmentBaseline={'middle'}>
          {data[index]}
        </SVGText>
      </G>
    ));
  };
  return (
    <View
      style={[
        {
          width: '100%',
          paddingBottom: 5,
          paddingHorizontal: '2%',
        },
        style,
      ]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <ScrollView
        horizontal={true}
        nestedScrollEnabled={true}
        ref={scrollRef}
        scrollsToTop={true}>
        <View style={{height: '100%', width: xAxis.length * 32}}>
          <LineChart
            style={title ? {flex: 1} : {flex: 1, marginTop: 20}}
            data={data}
            svg={{stroke: lineColor, strokeWidth: 2}}
            contentInset={verticalContentInset}>
            <Grid svg={{strokeWidth: 0.5}} />
            <Decorator />
          </LineChart>

          <XAxis
            style={{
              height: xAxisHeight,
            }}
            data={xAxis}
            formatLabel={(value, index) => formatLabel(xAxis[index])}
            contentInset={verticalContentInset}
            svg={{
              fill: 'grey',
              fontSize: 8,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 15,
    fontSize: 15,
  },
});

export default CustomLineChart;
