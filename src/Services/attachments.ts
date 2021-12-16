import storage, {FirebaseStorageTypes} from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import getPath from '@flyerhq/react-native-android-uri-path';
import {
  updateAttachmentsLoad,
  updateAttachmentsProgress,
} from '../redux/actions';
import {permissionStorage} from './permissions';
import {Platform} from 'react-native';
//@ts-ignore
import RNVideoHelper from 'react-native-video-helper';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {addAttachmentFirestore} from './resources';
import RNFS from 'react-native-fs';

const compressVideo = async (path: string, dispatcher: any) => {
  try {
    const result = await RNVideoHelper.compress(path, {
      endTime: 120,
      quality: 'medium',
    }).progress((value: number) => {
      dispatcher(updateAttachmentsProgress(value));
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

let task: FirebaseStorageTypes.Task;

export const cancelUpload = () => {
  if (task === undefined) {
    return;
  }
  task
    .cancel()
    .then((result) => {
      if (result) {
        Snackbar.show({
          text: 'Upload Cancelled!',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        Snackbar.show({
          text: 'Unable to Cancel Upload',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    })
    .catch((error) => {
      Snackbar.show({
        text: 'Unable to Cancel Upload',
        duration: Snackbar.LENGTH_SHORT,
      });
    });
  task.catch(() => {});
};

export const uploadAttachment = async (
  leadId: string,
  uri: string,
  attachments: [],
  type: 'photo' | 'video' | 'file' | 'audio',
  filename: string,
  dispatcher: any,
) => {
  if (Platform.OS === 'android' && (await permissionStorage()) === false) {
    return;
  }
  dispatcher(updateAttachmentsLoad(true));
  if (uri.startsWith('content://')) {
    uri = (await RNFS.stat(uri)).originalFilepath;
  }
  if (type == 'video') {
    const data = await RNFS.stat(uri);
    uri = await compressVideo(uri, dispatcher);
  }
  if (uri.startsWith('file://') === false) {
    uri = 'file://' + uri;
  }
  const path = `${leadId}/${type}/${filename}`;
  const reference = storage().ref(path);
  task = reference.putFile(uri);
  task.on(
    'state_changed',
    (taskSnapshot) => {
      const ratio = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes;
      dispatcher(updateAttachmentsProgress(ratio));
    },
    (error) => {
      console.log('task cancelled', error);
      dispatcher(updateAttachmentsLoad(false));
      dispatcher(updateAttachmentsProgress(0));
    },
    async () => {
      {
        const url = await reference.getDownloadURL();
        dispatcher(updateAttachmentsProgress(1));
        const firestoreData = {
          name: filename,
          type: type,
          url: url,
          created_at: firestore.Timestamp.now(),
        };
        const result = await addAttachmentFirestore(
          leadId,
          firestoreData,
          attachments,
        );
        if (result) {
          Snackbar.show({
            text: 'Uploaded Successfully!',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
        dispatcher(updateAttachmentsLoad(false));
        dispatcher(updateAttachmentsProgress(0));
      }
    },
  );
};

export const onCamera = (
  type: 'photo' | 'video',
  callback: (data: any) => void,
  cameraType?: string,
) => {
  launchCamera(
    type == 'photo'
      ? {mediaType: 'photo', maxHeight: 720, maxWidth: 1280}
      : {
          mediaType: 'video',
          maxHeight: 480,
          maxWidth: 360,
          durationLimit: 120,
        },
    callback,
  );
};

export const onGallery = (
  type: 'photo' | 'video',
  callback: (data: any) => void,
) => {
  launchImageLibrary(
    type == 'photo'
      ? {mediaType: 'photo', maxHeight: 720, maxWidth: 1280}
      : {
          mediaType: 'video',
          maxHeight: 360,
          maxWidth: 480,
        },
    callback,
  );
};

export const onDocument = async (
  callback: (name: string, uri: string) => void,
) => {
  try {
    if (
      (Platform.OS === 'android' && (await permissionStorage())) ||
      Platform.OS === 'ios'
    ) {
      let path = '';
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (Platform.OS == 'android') {
        path = 'file://' + getPath(res.uri);
      } else {
        path = res.uri;
      }
      callback(res.name, path);
    } else {
      Snackbar.show({
        text: 'Storge Permission Required!',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  } catch (err) {
    console.log('Document picker error', err);
  }
};

export const shareFile = (
  fileUrl: string,
  setLoad: (value: boolean) => void,
) => {
  let fileType = '';
  setLoad(true);
  let imagePath: string;
  RNFetchBlob.config({
    fileCache: true,
  })
    .fetch('GET', fileUrl)
    .then((resp) => {
      imagePath = resp.path();
      fileType =
        Platform.OS === 'ios'
          ? resp.info().headers['Content-Type']
          : resp.info().headers['content-type'];
      return resp.readFile('base64');
    })
    .then(async (base64Data) => {
      console.log(fileType);
      var base64Data: any = `data:${fileType};base64,` + base64Data;
      try {
        await Share.open({
          url: base64Data,
          title: 'Share File',
          message: '',
          type: fileType,
        });
        setLoad(false);
      } catch (error) {
        setLoad(false);
        console.log('share error', error);
      }
      return RNFetchBlob.fs.unlink(imagePath);
    })
    .catch((error) => {
      setLoad(false);
      console.log('share file error', error);
    });
};

export const downloadFile = async (
  link: string,
  setLoad: (value: boolean) => void,
  fileName: string,
) => {
  if (
    (Platform.OS === 'android' && (await permissionStorage())) ||
    Platform.OS === 'ios'
  ) {
    const split = fileName.split('.');
    const ext = split[split.length - 1];
    setLoad(true);
    RNFetchBlob.config({
      overwrite: true,
      path: RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName,
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          RNFetchBlob.fs.dirs.DownloadDir +
          '/' +
          Date.now().toString() +
          '.' +
          ext,
        mediaScannable: true,
      },
    })
      .fetch('GET', link)

      .then((res) => {
        setTimeout(
          () =>
            Snackbar.show({
              text: 'File Downloaded Successfully!',
              duration: Snackbar.LENGTH_SHORT,
            }),
          100,
        );
        setLoad(false);
        console.log('The file saved to ', res.path());
      })
      .catch((error) => {
        setTimeout(
          () =>
            Snackbar.show({
              text: 'Download Failed, Try Again!',
              duration: Snackbar.LENGTH_SHORT,
            }),
          100,
        );
        setLoad(false);
        console.log('download error', error);
      });
  }
};
