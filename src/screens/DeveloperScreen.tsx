import React, {FunctionComponent} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';

import theme from '../values/theme';
import Header from '../Components/Header';
import ProjectView from '../Components/KnowledgeCenter/ProjectView';

type props = {
  navigation: any;
  route: any;
};

const DeveloperScreen: FunctionComponent<props> = ({navigation, route}) => {
  const projectData = route.params.projects;
  return (
    <>
      <Header title={'Developer'} onBack={() => navigation.goBack()} />
      <FlatList
        data={projectData}
        style={styles.parent}
        contentContainerStyle={{paddingBottom: 50}}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <ProjectView
            key={index}
            item={item}
            onPress={() =>
              navigation.navigate('ProjectDetailsScreen', {project: item})
            }
          />
        )}
      />
      <View style={styles.countSection}>
        <Text style={styles.count}>{`Total: ${projectData.length}`}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '5%',
  },

  countSection: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: theme.colors.GREY,
    paddingVertical: 8,
    paddingHorizontal: 28,
  },
  count: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 'auto',
  },
});

export default DeveloperScreen;
