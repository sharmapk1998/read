import React, {FunctionComponent, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import FeatherIcons from 'react-native-vector-icons/Feather';
import theme from '../../values/theme';
import * as Progress from 'react-native-progress';
import VideoModal from '../Modals/VideoModal';
import ImageModal from '../Modals/ImageModal';
import PdfModal from '../Modals/PdfModal';
import AudioPlayerModal from '../Modals/AudioPlayerModal';
import Icon from 'react-native-vector-icons/Feather';
import {cancelUpload} from '../../Services/attachments';
import AttachmentIcons from './AttachmentIcons';
import {widthToDp} from '../../values/size';
import {inActiveStages} from '../../Services/contactsAPI';

type props = {
  attachments: any[];
  load: boolean;
  progress: number;
  leadId: string;
  leadData: any;
};

const AttachmentSection: FunctionComponent<props> = ({
  attachments,
  load,
  progress,
  leadId,
  leadData,
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
      {attachments && (
        <ScrollView
          nestedScrollEnabled={true}
          style={styles.parent}
          contentContainerStyle={{paddingBottom: 5, paddingHorizontal: 10}}>
          {attachments.length === 0 && load === false && (
            <View style={styles.noAttachmentView}>
              <Text style={styles.noAttachmentText}>No Attachments</Text>
            </View>
          )}
          {attachments.length !== 0 &&
            attachments.map((item: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
                onPress={() => onPress(index)}>
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
                  size={18}
                />
                <Text style={{marginLeft: 10, width: '88%'}}>{item.name}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
      {!inActiveStages.includes(leadData.stage) && !leadData.transfer_status && (
        <AttachmentIcons
          style={{
            marginLeft: 'auto',
            width: '32%',
            marginRight: 15,
            marginTop: 5,
          }}
          size={widthToDp(5)}
          leadId={leadId}
        />
      )}
      {load && (
        <View style={styles.loader}>
          <Progress.Bar
            width={100}
            progress={progress}
            color={theme.colors.HEADINGS}
          />
          <TouchableOpacity
            style={styles.cancelUploadButton}
            onPress={cancelUpload}>
            <Icon name={'x'} size={20} color={'#fff'} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  parent: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    height: 140,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#ffffff95',
    paddingTop: 20,
  },
  noAttachmentView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  noAttachmentText: {
    fontSize: 17,
    color: theme.colors.GREY_LIGHT,
  },
  cancelUploadButton: {
    marginTop: 20,
    backgroundColor: theme.colors.RED,
    padding: 2,
    borderRadius: 15,
  },
});

const mapStateToProps = (state: any) => {
  return {
    attachments: state.attachments.attachments,
    load: state.attachments.load,
    progress: state.attachments.progress,
  };
};

export default connect(mapStateToProps)(AttachmentSection);
