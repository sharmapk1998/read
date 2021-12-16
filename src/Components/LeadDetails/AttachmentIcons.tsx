import moment from 'moment';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import {connect, useDispatch} from 'react-redux';
import {
  onCamera,
  onGallery,
  uploadAttachment,
  onDocument,
} from '../../Services/attachments';
import theme from '../../values/theme';
import RecordingModal from '../Modals/RecordingModal';
import RenameModal from '../Modals/RenameModal';
import SourceSelectModal from '../Modals/SourceSelectModal';

type props = {
  style: ViewStyle;
  size: number;
  leadId: string;
  attachments: [];
};

const AttachmentIcons: FunctionComponent<props> = ({
  style,
  size,
  leadId,
  attachments,
}) => {
  const dispatcher = useDispatch();
  const [rename, setRename] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [attachmentData, setAttachmentData] = useState<{
    uri: string;
    type: 'photo' | 'file' | 'video' | 'audio';
  }>({uri: '', type: 'photo'});
  const [fileName, setFilename] = useState('');
  const [selectSource, setSelectSource] = useState(false);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');

  const pickMedia = (data: any) => {
    setTimeout(() => setSelectSource(false), 100);
    if (data.didCancel === true) {
      return;
    }
    if (data) {
      data.type = mediaType;
      setAttachmentData(data);
      setTimeout(() => setRename(true), 200);
      if (data.fileName) {
        if (data.fileName.split('-')[3]) {
          setFilename(
            data.fileName.split('-')[3] + '-' + data.fileName.split('-')[4],
          );
        } else if (data.fileName) {
          const name = data.fileName.split('/');
          setFilename(name[name.length - 1]);
        }
      } else {
        setFilename(moment().format());
      }
    }
  };

  const pickDocument = async (name: string, uri: string) => {
    setAttachmentData({uri: uri, type: 'file'});
    setFilename(name);
    setRename(true);
  };
  const uploadRecording = async (uri: string | undefined) => {
    if (uri) {
      setAttachmentData({uri: uri, type: 'audio'});
      setFilename(moment().format());
      setRename(true);
    }
  };

  return (
    <>
      {selectSource && (
        <SourceSelectModal
          show={selectSource}
          onCamera={() => onCamera(mediaType, pickMedia)}
          onGallery={() => onGallery(mediaType, pickMedia)}
          onBack={() => setSelectSource(false)}
        />
      )}

      {rename && (
        <RenameModal
          show={rename}
          value={fileName}
          onSubmit={() =>
            uploadAttachment(
              leadId,
              attachmentData.uri,
              attachments,
              attachmentData.type,
              fileName,
              dispatcher,
            )
          }
          onChange={(value) => setFilename(value)}
          hide={() => setRename(false)}
        />
      )}

      {showRecorder && (
        <RecordingModal
          show={showRecorder}
          hide={() => setShowRecorder(false)}
          onFinish={uploadRecording}
        />
      )}

      <View
        style={[
          {flexDirection: 'row', justifyContent: 'space-between'},
          style,
        ]}>
        <FeatherIcons
          name={'image'}
          color={theme.logo_colors.ADD}
          size={size}
          onPress={() => {
            setMediaType('photo');
            setSelectSource(true);
          }}
        />
        <FeatherIcons
          name={'mic'}
          color={theme.logo_colors.ADD}
          size={size}
          onPress={() => setShowRecorder(true)}
        />
        <FeatherIcons
          onPress={() => onDocument(pickDocument)}
          name={'file-text'}
          color={theme.logo_colors.ADD}
          size={size}
        />
        <FeatherIcons
          name={'video'}
          color={theme.logo_colors.ADD}
          size={size}
          onPress={() => {
            setMediaType('video');
            setSelectSource(true);
          }}
        />
      </View>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    attachments: state.attachments.attachments,
  };
};

export default connect(mapStateToProps)(AttachmentIcons);
