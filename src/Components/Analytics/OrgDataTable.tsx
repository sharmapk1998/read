import React, {FunctionComponent} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  StyleSheet,
  ViewStyle,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import {connect} from 'react-redux';
import {sortAnalyticsTable} from '../../Services/analytics';
import {properFormat} from '../../Services/format';
import theme from '../../values/theme';
import Snackbar from 'react-native-snackbar';

type props = {
  data: any[];
  filters: any;
  user: any;
  title: string;
  style?: ViewStyle;
  other?: boolean;
  customHeader?: string[];
  onDrillDown: (
    row: string | undefined,
    col: string,
    count: any,
    role: boolean,
  ) => void;
};

const cellWidth = 125;

const OrgDataTable: FunctionComponent<props> = ({
  data,
  filters,
  user,
  title,
  style,
  other,
  customHeader,
  onDrillDown,
}) => {
  const [header, setHeader] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [grandTotal, setGrandTotal] = useState<any>({});
  useEffect(() => {
    let tempHeader: string[] = ['Name', 'Total'];
    tempHeader = customHeader ? tempHeader.concat(customHeader) : tempHeader;
    const tempData: any[] = [];
    const {nameMap, teamMap, countTeamMap} = user.userMap;
    if (nameMap[user.uid] === undefined) {
      nameMap[user.uid] = user.user_first_name + ' ' + user.user_last_name;
    }

    const checked = filters.teamWise;
    if (!customHeader) {
      data.forEach((row) => {
        Object.values(row).forEach((rowData: any) => {
          if (rowData === undefined) {
            return;
          }
          Object.keys(rowData).forEach((key) => {
            if (!tempHeader.includes(key)) {
              tempHeader.push(key);
            }
          });
        });
      });
    }
    data.forEach((row) => {
      Object.keys(row).forEach((key) => {
        const analytics = row[key] ? row[key] : {};
        let sum = 0;
        Object.values(analytics).forEach((value: any) => {
          sum += value;
        });
        tempData.push({
          Name: checked ? key : {name: nameMap[key], uid: key},
          Total: sum,
          ...analytics,
        });
      });
    });
    let teamTempData: any[] = [];
    if (checked) {
      tempHeader.splice(1, 0, 'Strength');
      tempData.forEach((user) => {
        const team = teamMap[user.Name];
        let existing = teamTempData.filter((item) => item.Name === team);
        if (existing.length !== 0) {
          Object.keys(user).forEach((key) => {
            if (key !== 'Name') {
              if (existing[0][key]) {
                existing[0][key] += user[key];
              } else {
                existing[0][key] = user[key];
              }
            }
          });
        } else {
          teamTempData.push({
            ...user,
            Name: team,
            Strength: countTeamMap[team],
          });
        }
      });
    }
    let gt: {[key: string]: any} = {};
    const finalData = checked ? teamTempData : tempData;
    finalData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== 'Name') {
          if (gt[key]) {
            gt[key] += item[key];
          } else {
            gt[key] = item[key];
          }
        }
      });
    });

    finalData.sort(sortAnalyticsTable);
    setGrandTotal({Name: 'Grand Total', ...gt});
    if (other) {
      if (tempHeader.includes('Other')) {
        const index = tempHeader.indexOf('Other');
        tempHeader.splice(index, 1);
        tempHeader.push('other');
      }
    }
    setHeader(tempHeader);
    setTableData(finalData.filter((item) => item.Name !== undefined));
  }, [data, filters.teamWise, user]);
  // console.log('Ni -- ',data)
  return (
    <View style={[styles.parent, style]}>
      <Text style={styles.header}>{title}</Text>
      <ScrollView
        style={styles.table}
        horizontal={true}
        contentContainerStyle={{
          width: header.length * cellWidth,
        }}
        nestedScrollEnabled={true}>
        <View>
          <View style={styles.headerRow}>
            {header.map((head, index) => {
              return (
                <View key={index} style={styles.cell}>
                  <Text style={styles.thText} numberOfLines={2}>
                    {properFormat(head)}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={[styles.row, {backgroundColor: theme.colors.PRIMARY}]}>
            {header.map((key, index) => {
              if (key === 'Name') {
                // console.log('key',  key)
                return (
                  <View key={index} style={styles.cell}>
                    <Text style={styles.total}>
                      {grandTotal[key] ? grandTotal[key] : 0}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.cell}
                    onPress={
                      () =>
                        Snackbar.show({
                          text: 'Drilldown Not Available',
                          duration: Snackbar.LENGTH_SHORT,
                        })
                      // onDrillDown(
                      //   undefined,
                      //   key,
                      //   grandTotal[key] ? grandTotal[key] : 0,
                      //   true,
                      // )
                    }>
                    <Text style={styles.total}>
                      {grandTotal[key] ? grandTotal[key] : 0}
                    </Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
          {tableData.map((row, index2) => {
            if(row['Name'].name !== undefined){
            return (
              <View
                key={index2}
                style={
                  index2 % 2 !== 0
                    ? styles.row
                    : [styles.row, {backgroundColor: '#E5E5E5'}]
                }>
                {header.map((key, index) => {
                  
                  if (key === 'Name') {
                    return (
                      <View key={index} style={styles.cell}>
                        <Text style={styles.trText} numberOfLines={1}>
                          {filters.teamWise
                            ? properFormat(row['Name'] ? row['Name'] : '')
                            : properFormat(
                                row['Name']['name'] ? row['Name']['name'] : '',
                              )}
                        </Text>
                      </View>
                    );
                  } else {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.cell}
                        onPress={() =>{
                          if(!row[key]){
                            Snackbar.show({
                              text: 'Drilldown Not Available',
                              duration: Snackbar.LENGTH_SHORT,
                            })
                          }
                          else{
                            onDrillDown(
                              row['Name']['uid'],
                              key,
                              row[key] ? row[key] : 0,
                              false,
                            )
                          }
                        }
                        }>
                        <Text style={styles.trText} numberOfLines={1}>
                          {properFormat(row[key] ? row[key] : 0)}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                })}
              </View>
            );
          }})}
        </View>
      </ScrollView>
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginTop: 8,
    paddingVertical: 5,
    minHeight: 38,
  },
  row: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginTop: 8,
  },
  thText: {
    fontWeight: 'bold',
    fontSize: 15,
    minWidth: '100%',
    textAlign: 'center',
  },
  cell: {
    width: cellWidth,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  trText: {
    fontSize: 14,
    minWidth: 100,
    textAlign: 'center',
  },
  total: {
    color: '#fff',
    fontSize: 15.5,
    fontWeight: 'bold',
  },
});

const mapStateToProps = (state: any) => {
  return {
    filters: state.filters.analyticsFilter,
    user: state.user,
  };
};

export default connect(mapStateToProps)(OrgDataTable);
