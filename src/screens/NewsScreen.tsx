import React, {FunctionComponent} from 'react';
import {StyleSheet} from 'react-native';
import Header from '../Components/Header';
import {WebView} from 'react-native-webview';
import {useState} from 'react';
import Loader from '../Components/Modals/Loader';
import CitySelectModal from '../Components/Modals/CitySelectModal';
import {useEffect} from 'react';
import {connect} from 'react-redux';
import {fetchNewsData} from '../Services/resources';

type props = {
  navigation: any;
  user: any;
};

const NewsScreen: FunctionComponent<props> = ({navigation, user}) => {
  const [newsData, setNewsData] = useState<{[key: string]: string}>({});
  const [load, setLoad] = useState(true);
  const [city, setCity] = useState('');
  const [showSelect, setShowSelect] = useState(false);

  const onBack = () => {
    setShowSelect(false);
    navigation.goBack();
  };

  const setCityFunc = (city: string) => {
    setLoad(true);
    setCity(city);
    setShowSelect(false);
  };

  useEffect(() => {
    fetchNewsData(user.organization_id, (data) => setNewsData(data)).then(
      () => {
        setLoad(false);
        setTimeout(() => setShowSelect(true), 100);
      },
    );
  }, [user.organization_id]);

  return (
    <>
      <CitySelectModal
        show={showSelect}
        onBack={onBack}
        setCity={setCityFunc}
        cityList={Object.keys(newsData)}
      />
      <Loader show={load} />
      <Header title={'News'} onBack={() => navigation.goBack()} />
      {city !== '' && (
        <WebView
          source={{
            uri: newsData[city],
          }}
          onLoadEnd={() => setLoad(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(NewsScreen);
