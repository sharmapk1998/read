import React, {FunctionComponent} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import theme from '../../values/theme';
import DocumentView from './DocumentView';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {properFormat} from '../../Services/format';

type props = {
  tittle: string;
  project_name: string;
  dataList: any[];
};

const DocumentList: FunctionComponent<props> = ({
  tittle,
  project_name,
  dataList,
}) => {
  const navigation = useNavigation();
  return (
    <View>
      <Text style={styles.title}>{tittle}</Text>
      {dataList.length !== 0 && (
        <FlatList
          style={styles.pdfScroll}
          horizontal={true}
          contentContainerStyle={{
            paddingRight: '5%',
            paddingVertical: 10,
            paddingLeft: 10,
          }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={dataList}
          renderItem={({item, index}) => (
            <DocumentView
              doc={item}
              onPress={() =>
                navigation.navigate('DocumentScreen', {
                  title: tittle,
                  project_name: project_name,
                  doc: item,
                })
              }
            />
          )}
        />
      )}
      {dataList.length === 0 && (
        <View style={styles.noDataParent}>
          <Icon
            name={'file-pdf'}
            color={theme.colors.PRIMARY}
            size={50}
            style={{}}
          />
          <Text style={styles.noDataText}>{`No ${properFormat(
            tittle,
          )} Available`}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.colors.PRIMARY,
    marginTop: 20,
  },
  pdfScroll: {
    flex: 1,
    width: '100%',
    marginTop: 5,
  },
  noDataParent: {
    height: 150,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
  },
  noDataText: {
    marginTop: 10,
  },
});

export default DocumentList;
