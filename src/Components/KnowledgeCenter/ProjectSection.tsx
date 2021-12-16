import React, {FunctionComponent} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import theme from '../../values/theme';

type props = {
  seeAll: () => void;
  project: {[key: string]: any[]};
  developer: string;
  onProject: (item: any) => void;
};

const ProjectSection: FunctionComponent<props> = ({
  seeAll,
  project,
  developer,
  onProject,
}) => {
  return (
    <View>
      <View style={styles.heading}>
        <Text style={styles.title}>{developer}</Text>
        <TouchableOpacity onPress={seeAll}>
          <Text style={styles.expandText}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.projectList}>
        {project[developer].slice(0, 2).map((item: any, index: number) => (
          <TouchableOpacity
            style={styles.projectView}
            key={index}
            onPress={() => onProject(item)}>
            <Image
              source={
                item.project_image
                  ? {uri: item.project_image}
                  : require('../../../assets/no-image.jpg')
              }
              style={styles.image}
              resizeMode={'cover'}
            />
            <Text style={styles.projectName}>{item.project_name}</Text>
            <View style={styles.detailView}>
              <Text style={styles.projectDetail}>{item.property_type}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  expandText: {
    fontSize: 13,
    color: theme.colors.BLUE,
  },
  projectList: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 25,
  },
  projectView: {
    display: 'flex',
    flexDirection: 'column',
    width: '47%',
    backgroundColor: '#fff',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: 10,
  },
  image: {
    height: 95,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  projectName: {
    fontSize: 14,

    marginTop: 8,
    marginLeft: 5,
  },
  detailView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  projectDetail: {
    fontSize: 12,
    color: theme.colors.GREY,
  },
});

export default ProjectSection;
