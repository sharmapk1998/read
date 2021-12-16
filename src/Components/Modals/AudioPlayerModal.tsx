import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';

import theme from '../../values/theme';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import {secToTime} from '../../Services/format';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import Snackbar from 'react-native-snackbar';

type props = {
  hide: () => void;
  show: boolean;
  url: string;
};
var audio: Sound;
var timeout: any;
const AudioPlayerModal: FunctionComponent<props> = ({show, hide, url}) => {
  const [play, setPlay] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [totalSec, setTotalSec] = useState(0);
  const [loading, setLoading] = useState(false);
  const [seekbarValue, setSeekbarValue] = useState(0);
  useEffect(() => {
    setCurrentSec(0);
    setLoading(true);
    Sound.setCategory('Playback');
    audio = new Sound({uri: url}, (error: any) => {
      setLoading(false);
      if (error) {
        console.log('failed to load the sound', error);
        hide();
        Snackbar.show({
          text: 'Error Playing Audio!!',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        setSeekbarValue(0);
        const dur = Math.round(audio.getDuration());
        setTotalSec(dur);
      }
    });
    return () => {
      clearTimeout(timeout);
      audio.release();
    };
  }, []);

  const setNewCurrentTime = () => {
    clearTimeout(timeout);
    setCurrentSec(Math.floor(seekbarValue));
    audio.setCurrentTime(seekbarValue);
    playAudio();
  };

  useEffect(() => {
    if (play && currentSec !== totalSec) {
      timeout = setTimeout(() => setCurrentSec(currentSec + 1), 1000);
    } else if (play && currentSec === totalSec) {
      setTimeout(() => {
        setPlay(false);
        setCurrentSec(0);
      }, 1000);
    }
  });
  const closeModal = () => {
    clearTimeout(timeout);
    audio.release();
    hide();
  };

  const playAudio = () => {
    setPlay(true);
    audio.play();
  };

  const pauseAudio = () => {
    setPlay(false);
    audio.pause();
  };

  return (
    <Modal
      isVisible={show}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      useNativeDriver={true}
      style={styles.parent}>
      {loading === false && (
        <View style={styles.playerParent}>
          {play === false ? (
            <TouchableOpacity onPress={playAudio}>
              <Icon name={'play'} size={28} color={theme.colors.PRIMARY} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pauseAudio}>
              <Icon name={'pause'} size={28} color={theme.colors.PRIMARY} />
            </TouchableOpacity>
          )}
          <Slider
            onValueChange={(value) => {
              setSeekbarValue(value);
            }}
            onSlidingStart={pauseAudio}
            onSlidingComplete={setNewCurrentTime}
            style={styles.seekBar}
            value={currentSec}
            maximumValue={totalSec}
            minimumValue={0}
          />
          <Text style={styles.timeText}>
            {secToTime(currentSec) + '/' + secToTime(totalSec)}
          </Text>
        </View>
      )}
      {loading === true && (
        <ActivityIndicator size="large" color={theme.colors.PRIMARY} />
      )}
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
  playerParent: {
    width: '90%',
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: '6%',
  },
  seekBar: {
    width: '75%',
  },
  timeText: {
    fontSize: 10,
    color: theme.colors.GREY,
  },
});

export default AudioPlayerModal;
