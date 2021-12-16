import React from 'react';
import {FunctionComponent} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import theme from '../../values/theme';

type props = {
  onPress: () => void;
  item: any;
};

const ProjectView: FunctionComponent<props> = ({onPress, item}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{item.project_name}</Text>
        <Text style={styles.type}>{item.property_type}</Text>
        <Text>{item.created_by}</Text>
      </View>
      <Image
        source={
          item.project_image
            ? {uri: item.project_image}
            : require('../../../assets/no-image.jpg')
        }
        style={styles.image}
        resizeMode={'cover'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 25,
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '55%',
    height: '100%',
    paddingLeft: 8,
    justifyContent: 'space-around',
    paddingTop: 5,
    paddingBottom: 10,
  },
  image: {
    borderWidth: 1,
    width: '40%',
    height: '100%',
    borderRadius: 10,
  },
  name: {
    fontSize: 16.5,
    fontWeight: 'bold',
    width: '100%',
  },
  type: {
    fontSize: 13,
    color: theme.colors.GREY,
  },
});

export default ProjectView;
