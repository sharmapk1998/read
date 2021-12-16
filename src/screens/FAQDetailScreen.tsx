import React, {FunctionComponent} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Header from '../Components/Header';
import theme from '../values/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import {shareFaq} from '../Services/faq';

type props = {
  navigation: any;
  route: any;
};

const FAQDetailScreen: FunctionComponent<props> = ({navigation, route}) => {
  const faq = route.params.faq;
  return (
    <>
      <Header title={'FAQ'} onBack={() => navigation.goBack()} />
      <View style={styles.parent}>
        <View style={styles.faqView}>
          <Text style={styles.question}>{faq.question}</Text>
          <Text style={styles.answer}>{faq.answer}</Text>
          <TouchableOpacity
            style={styles.share}
            onPress={() => shareFaq(faq.question, faq.answer)}>
            <Icon
              name={'share-social'}
              size={22}
              color={theme.colors.PRIMARY}
            />
          </TouchableOpacity>
        </View>
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
  faqView: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: '3%',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 17,
    lineHeight: 24,
  },
  answer: {
    marginTop: 15,
    lineHeight: 20,
    color: theme.colors.GREY,
  },
  share: {
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 10,
  },
});

export default FAQDetailScreen;
