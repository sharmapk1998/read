import React from 'react';
import {FunctionComponent} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Header from '../Components/Header';
import {properFormat} from '../Services/format';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../values/theme';
import {useState} from 'react';
import Loader from '../Components/Modals/Loader';
import {shareFile} from '../Services/attachments';
import {downloadFile} from '../Services/attachments';
import ImageZoom from 'react-native-image-pan-zoom';
import {heightToDp, widthToDp} from '../values/size';

type props = {
  navigation: any;
  route: any;
};

const PdfScreen: FunctionComponent<props> = ({navigation, route}) => {
  const [load, setLoad] = useState(false);
  const title = properFormat(route.params.title);
  const projectName = route.params.project_name;
  const doc = route.params.doc;
  const onShare = () => {
    shareFile(doc.link, (value) => setLoad(value));
  };
  return (
    <>
      <Loader show={load} />
      <Header title={title} onBack={() => navigation.goBack()} />
      <View style={styles.parent}>
        <View style={styles.headContainer}>
          <Text style={styles.head}>{`${title} for`}</Text>
          <Text style={[styles.head, {marginTop: 3}]} numberOfLines={1}>
            {projectName}
          </Text>
        </View>
        <View style={styles.pdfView}>
          {doc.type === 'pdf' ? (
            <Pdf
              source={{
                uri: doc.link,
                cache: true,
              }}
              style={styles.pdf}
            />
          ) : (
            <ImageZoom
              cropWidth={widthToDp(90)}
              cropHeight={heightToDp(70)}
              imageWidth={widthToDp(90)}
              imageHeight={heightToDp(70)}>
              <Image
                source={{uri: doc.link}}
                style={{
                  width: '80%',
                  height: '80%',
                  alignSelf: 'center',
                }}
                resizeMode={'contain'}
                onLoadStart={() => setLoad(true)}
                onLoadEnd={() => setLoad(false)}
              />
            </ImageZoom>
          )}
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.button} onPress={onShare}>
            <Icon name={'share-social'} size={20} color={theme.colors.GREY} />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={async () =>
              await downloadFile(doc.link, (value) => setLoad(value), doc.name)
            }>
            <Icon
              name={'download-outline'}
              size={20}
              color={theme.colors.GREY}
            />
            <Text style={styles.buttonText}>Download</Text>
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
    paddingTop: 20,
  },
  headContainer: {
    width: '100%',
    alignItems: 'center',
  },
  head: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  pdfView: {
    height: '80%',
    marginTop: 20,
  },
  pdf: {
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    flex: 1,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: '10%',
  },
  buttonText: {
    fontSize: 13,
    color: theme.colors.GREY,
  },
});

export default PdfScreen;
