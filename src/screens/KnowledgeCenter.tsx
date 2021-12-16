import React, {FunctionComponent} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Header from '../Components/Header';

import theme from '../values/theme';
import Section from '../Components/KnowledgeCenter/Section';

type props = {
  navigation: any;
};

const KnowlegdeCenter: FunctionComponent<props> = ({navigation}) => {
  return (
    <>
      <Header title={'Knowledge Center'} onBack={() => navigation.goBack()} />
      <View style={styles.parent}>
        <Section
          style={styles.section}
          title={'Library Section'}
          text={'Library section gives you insight of projects'}
          source={require('../../assets/Library.png')}
          onClick={() => navigation.navigate('LibraryScreen')}
        />
        <Section
          style={styles.section}
          title={'News Section'}
          text={'News section update you with latest feeds.'}
          source={require('../../assets/News.png')}
          onClick={() => navigation.navigate('NewsScreen')}
        />

        <Section
          style={styles.section}
          title={'FAQ'}
          text={'Find solutions of you queries at FAQ section.'}
          source={require('../../assets/FAQ.png')}
          onClick={() => navigation.navigate('FAQScreen')}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '5%',
    paddingTop: '2%',
    paddingBottom: '3%',
    justifyContent: 'space-around',
  },
  section: {
    height: '30%',
  },
});

export default KnowlegdeCenter;
