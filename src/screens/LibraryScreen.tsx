import React, {FunctionComponent} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';

import theme from '../values/theme';

import Header from '../Components/Header';
import {connect} from 'react-redux';
import {useEffect} from 'react';
import {useState} from 'react';
import ProjectSection from '../Components/KnowledgeCenter/ProjectSection';

type props = {
  navigation: any;
  projects: any;
};

const LibrarySection: FunctionComponent<props> = ({navigation, projects}) => {
  const [project, setProject] = useState<{[key: string]: any[]}>({});

  useEffect(() => {
    if (projects) {
      let projectList: {[key: string]: any[]} = {};
      projects['projects'].map((project: any) => {
        if (projectList[project.developer_name]) {
          projectList[project.developer_name].push(project);
        } else {
          projectList[project.developer_name] = [project];
        }
      });
      setProject(projectList);
    }
  }, [projects.projects]);

  return (
    <>
      <Header title={'Library'} onBack={() => navigation.goBack()} />
      <FlatList
        style={styles.parent}
        contentContainerStyle={{paddingBottom: 50, paddingTop: 15}}
        keyExtractor={(item, index) => index.toString()}
        data={Object.keys(project)}
        renderItem={({item, index}) => (
          <ProjectSection
            developer={item}
            project={project}
            onProject={(item) =>
              navigation.navigate('ProjectDetailsScreen', {project: item})
            }
            seeAll={() =>
              navigation.navigate('DeveloperScreen', {
                projects: project[item],
              })
            }
          />
        )}
      />
      <View style={styles.countSection}>
        <Text style={styles.count}>{`Total: ${
          Object.keys(project).length
        }`}</Text>
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

const mapStateToProps = (state: any) => {
  return {
    projects: state.projects,
  };
};

export default connect(mapStateToProps)(LibrarySection);
