import React, {FunctionComponent, useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {connect} from 'react-redux';
import Header from '../Components/Header';
import FaqView from '../Components/KnowledgeCenter/FaqView';
import Loader from '../Components/Modals/Loader';
import {fetchFAQ} from '../Services/resources';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../values/theme';

type props = {
  navigation: any;
  user: any;
};

const FAQScreen: FunctionComponent<props> = ({navigation, user}) => {
  const [faqList, setFaqList] = useState<any[]>([]);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (user) {
      fetchFAQ(
        user.organization_id,
        (data) => setFaqList(data),
        (data) => setLoad(data),
      );
    }
  }, [user]);
  return (
    <>
      {load === true && <Loader show={true} />}
      <Header title={'FAQ'} onBack={() => navigation.goBack()} />
      <View style={styles.parent}>
        <Text style={styles.title}>Questions</Text>

        {faqList.length !== 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 50}}
            data={faqList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <FaqView
                item={item}
                key={index}
                onPress={() => navigation.navigate('FAQDetail', {faq: item})}
              />
            )}
          />
        ) : (
          <View style={styles.noDataView}>
            <Icon name={'help'} size={90} color={theme.colors.PRIMARY} />
            <Text style={styles.noDataText}>No Faq Available</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '5%',
    marginTop: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    paddingBottom: '20%',
  },
  noDataText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: theme.colors.GREY,
  },
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(FAQScreen);
