import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import theme from '../../values/theme';
import Modal from 'react-native-modal';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Icon from 'react-native-vector-icons/Ionicons';
import {secToTime} from '../../Services/format';
type props = {
  hide: () => void;
  show: boolean;
  onFinish: (path: string | undefined) => void;
};

const RecordingModal: FunctionComponent<props> = ({show, hide, onFinish}) => {
  const [recording, setRecording] = useState(false);
  const [pause, setPause] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const closeModal = async () => {
    try {
      await AudioRecorder.stopRecording();
    } catch (error) {
      console.log('recorder close', error);
    }
    hide();
  };

  useEffect(() => {
    AudioRecorder.checkAuthorizationStatus().then((result) => {
      if (result === false) {
        AudioRecorder.requestAuthorization().then((result) => {
          hide();
        });
      } else {
        let audioPath = AudioUtils.CachesDirectoryPath + '/test.aac';
        AudioRecorder.prepareRecordingAtPath(audioPath, {
          SampleRate: 22050,
          Channels: 1,
          AudioQuality: 'Medium',
          AudioEncoding: 'aac',
        });
        AudioRecorder.onProgress = (data) => {
          setRecordingTime(secToTime(Math.round(data.currentTime)));
        };
        AudioRecorder.onFinished = (data) => {
          console.log('finished', data);
          if (data.status === 'OK') {
            onFinish(data.audioFileURL);
          } else {
            onFinish(undefined);
          }
          hide();
        };
      }
    });
  }, []);

  const startRecording = async () => {
    Vibration.vibrate(200);
    try {
      await AudioRecorder.startRecording();
    } catch (error) {
      console.log('start record error', error);
    }
    setRecording(true);
  };

  const pauseRecording = async () => {
    await AudioRecorder.pauseRecording();
    setPause(true);
  };
  const resumeRecording = async () => {
    await AudioRecorder.resumeRecording();
    setPause(false);
  };
  const stopRecording = async () => {
    Vibration.vibrate(200);
    await AudioRecorder.stopRecording();
    setRecording(false);
  };
  return (
    <Modal
      useNativeDriver={true}
      isVisible={show}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      style={styles.parent}>
      <View style={styles.recorderParent}>
        {recording === false && (
          <TouchableOpacity
            style={styles.recordButton}
            onPress={startRecording}>
            <Icon name={'mic'} size={50} color={theme.logo_colors.ADD} />
            <Text>Start Recording</Text>
          </TouchableOpacity>
        )}
        {recording === true && (
          <>
            <View style={styles.onRecordingView}>
              {pause === false && (
                <TouchableOpacity onPress={pauseRecording}>
                  <Icon name={'pause'} size={28} />
                </TouchableOpacity>
              )}
              {pause === true && (
                <TouchableOpacity onPress={resumeRecording}>
                  <Icon name={'play'} size={28} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={stopRecording}>
                <Icon name={'stop'} size={28} color={theme.colors.RED} />
              </TouchableOpacity>
            </View>
            <Text style={{marginTop: 25}}>{recordingTime}</Text>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parent: {
    margin: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recorderParent: {
    width: '40%',
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '55%',
  },
  onRecordingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
  },
});

export default RecordingModal;
