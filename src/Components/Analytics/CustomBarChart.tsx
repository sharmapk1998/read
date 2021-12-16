import React, {FunctionComponent} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {View, ViewStyle, ScrollView} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {getLegend} from '../../Services/format';
import {widthToDp} from '../../values/size';
type props = {
  data: any;
  style?: ViewStyle;
  colors: string[];

  barDist?: number;
};
const CustomBarChart: FunctionComponent<props> = ({
  data,
  style,
  colors,
  barDist,
}) => {
  const [barColors, setBarColors] = useState<any[]>([]);
  useEffect(() => {
    let tempBarColors: any[] = [...barColors];
    if (colors.length === 1) {
      Object.keys(data).forEach((item, index) => {
        tempBarColors.push((opacity = 1) => colors[0]);
        setBarColors(tempBarColors);
      });
    } else if (colors.length === 2) {
      Object.keys(data).forEach(() => {
        if (tempBarColors.length % 2 == 0) {
          tempBarColors.push((opacity = 1) => colors[0]);
        } else {
          tempBarColors.push((opacity = 1) => colors[1]);
        }
        setBarColors(tempBarColors);
      });
    } else {
      Object.keys(data).forEach((item, index) => {
        tempBarColors.push((opacity = 1) => colors[index]);
        setBarColors(tempBarColors);
      });
    }
  }, [data, colors]);
  return (
    <View style={{paddingTop: 10, backgroundColor: '#f9f9f9'}}>
      <ScrollView horizontal={true} contentContainerStyle={{paddingRight: 20}}>
        <BarChart
          style={{marginLeft: -28}}
          data={{
            labels: Object.keys(data).map((label) => getLegend(label)),
            datasets: [{data: Object.values(data), colors: barColors}],
          }}
          showBarTops={false}
          fromZero={true}
          showValuesOnTopOfBars={true}
          withInnerLines={false}
          withCustomBarColorFromData={true}
          flatColor={true}
          width={
            barDist
              ? Object.keys(data).length * barDist
              : Object.keys(data).length * 127
          }
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            style: {borderWidth: 2},
            decimalPlaces: 0,
            backgroundGradientFrom: '#F9F9F9',
            backgroundGradientTo: '#F9F9F9',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForVerticalLabels: {
              fontSize: 9,
              translateY: -10,
            },
          }}
        />
      </ScrollView>
    </View>
  );
};

export default CustomBarChart;
