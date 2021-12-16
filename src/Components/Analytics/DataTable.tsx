import React, {FunctionComponent} from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {properFormat} from '../../Services/format';
import theme from '../../values/theme';

type props = {
  style?: ViewStyle;
  title: string;
  head: [string, string];
  data: any;
  total: number;
};

const DataTable: FunctionComponent<props> = ({
  style,
  title,
  head,
  data,
  total,
}) => {
  return (
    <View style={[styles.parent, style]}>
      <Text style={styles.header}>{title}</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.thText}>{head[0]}</Text>
          <Text style={styles.thText}>{head[1]}</Text>
        </View>
        <View style={[styles.row, {backgroundColor: theme.colors.PRIMARY}]}>
          <Text style={styles.total}>Grand Total</Text>
          <Text style={styles.total}>{total}</Text>
        </View>
        {Object.keys(data).map((key: any, index: number) => (
          <View key={index}>
            <View
              style={
                index % 2 !== 0
                  ? styles.row
                  : [styles.row, {backgroundColor: '#E5E5E5'}]
              }>
              <Text style={styles.trText} numberOfLines={1}>
                {properFormat(key === 'CALLBACK' ? 'Call Back' : key)}
              </Text>
              <Text style={[styles.trText, {textAlign: 'right'}]}>
                {data[key]}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {},
  header: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
    paddingHorizontal: '1%',
  },
  row: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginTop: 8,
  },
  thText: {
    fontWeight: 'bold',
    fontSize: 15,
  },

  trText: {
    fontSize: 14,
    width: '40%',
  },
  total: {
    color: '#fff',
    fontSize: 15.5,
    fontWeight: 'bold',
  },
});

export default DataTable;
