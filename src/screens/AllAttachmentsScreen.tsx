import React, {FunctionComponent, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import Header from '../Components/Header';
import theme from '../values/theme';
import FeatherIcons from 'react-native-vector-icons/Feather';
import VideoModal from '../Components/Modals/VideoModal';
import ImageModal from '../Components/Modals/ImageModal';
import PdfModal from '../Components/Modals/PdfModal';
import AudioPlayerModal from '../Components/Modals/AudioPlayerModal';
import IconIon from 'react-native-vector-icons/Ionicons';
import {getNotificationTime} from '../Services/format';
import {shareFile} from '../Services/attachments';
import Loader from '../Components/Modals/Loader';

const AttachmentView = ({
  item,
  onPress,
  last,
}: {
  item: any;
  onPress: () => void;
  last: boolean;
}) => {
  const [load, setLoad] = useState(false);
  return (
    <>
      {load && <Loader show={load} />}
      <View style={styles.attachmentViewParent}>
        <TouchableOpacity
          style={styles.attachmentContent}
          onPress={() => onPress()}>
          <FeatherIcons
            name={
              item.type == 'photo'
                ? 'image'
                : item.type == 'video'
                ? 'video'
                : item.type == 'file'
                ? 'file-text'
                : 'mic'
            }
            color={theme.logo_colors.ADD}
            size={19}
          />
          <View style={{marginLeft: 15, width: '82%'}}>
            <Text style={{width: '100%'}}>{item.name}</Text>
            <Text
              style={{
                marginTop: 6,
                fontSize: 12,
                color: theme.colors.GREY,
              }}>
              {getNotificationTime(item.created_at.toDate())}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            shareFile(item.url, (value: boolean) => setLoad(value))
          }>
          <IconIon
            name={'share-social'}
            size={20}
            color={theme.nav_colors.PRIMARY}
          />
        </TouchableOpacity>
      </View>
      {last === false && (
        <View
          style={{
            height: 0.35,
            width: '90%',
            alignSelf: 'center',
            backgroundColor: theme.colors.GREY_LIGHT,
          }}
        />
      )}
    </>
  );
};

type props = {
  navigation: any;
  attachments: any;
};
const AllAttachmentsScreen: FunctionComponent<props> = ({
  navigation,
  attachments,
}) => {
  const [showImage, setShowImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [url, setUrl] = useState('');
  const [showPDF, setShowPDF] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const onPress = async (index: number) => {
    setUrl(attachments[index].url);
    if (attachments[index].type == 'photo') {
      setShowImage(true);
    } else if (attachments[index].type == 'video') {
      setShowVideo(true);
    } else if (attachments[index].type == 'file') {
      setShowPDF(true);
    } else {
      setShowAudioPlayer(true);
    }
  };
  return (
    <>
      {showVideo && (
        <VideoModal
          show={showVideo}
          hide={() => setShowVideo(false)}
          url={url}
        />
      )}
      {showImage && (
        <ImageModal
          show={showImage}
          hide={() => setShowImage(false)}
          url={url}
        />
      )}
      {showPDF && (
        <PdfModal show={showPDF} hide={() => setShowPDF(false)} url={url} />
      )}
      {showAudioPlayer && (
        <AudioPlayerModal
          show={showAudioPlayer}
          hide={() => setShowAudioPlayer(false)}
          url={url}
        />
      )}
      <Header title={'Attachments'} onBack={() => navigation.goBack()} />
      {attachments.length !== 0 && (
        <ScrollView
          style={styles.scrollViewParent}
          contentContainerStyle={{paddingBottom: 5, paddingHorizontal: 10}}>
          <View style={styles.attachmentContainer}>
            {attachments.map((item: any, index: number) => (
              <AttachmentView
                key={index}
                onPress={() => onPress(index)}
                item={item}
                last={index === attachments.length - 1}
              />
            ))}
          </View>
        </ScrollView>
      )}
      {attachments.length === 0 && (
        <View style={styles.noDataParent}>
          <IconIon name={'attach'} size={90} color={theme.nav_colors.PRIMARY} />
          <Text style={styles.noDataText}>No Attachments Available</Text>
        </View>
      )}

      <View style={styles.bottomBar}>
        <Text style={styles.totalText}>
          Total Attachments:{' '}
          <Text style={{fontWeight: 'bold', color: '#fff'}}>
            {attachments.length}
          </Text>
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewParent: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: '2%',
    paddingVertical: '5%',
  },
  attachmentContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  attachmentViewParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '4%',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  attachmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noDataParent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.GREY,
    fontWeight: 'bold',
  },
  bottomBar: {
    marginTop: 'auto',
    height: 35,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#4B4849',
  },
  totalText: {
    marginLeft: 'auto',
    marginRight: '10%',
    color: '#fff',
    fontSize: 16,
  },
});

const mapStateToProps = (state: any) => {
  return {
    attachments: state.attachments.attachments,
  };
};

export default connect(mapStateToProps)(AllAttachmentsScreen);
