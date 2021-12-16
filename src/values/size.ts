import {Dimensions, PixelRatio} from 'react-native';

const {height, width} = Dimensions.get('window');

//Return size mapped according to screen width
export const widthToDp = (value: string | number) => {
  let number = typeof value === 'number' ? value : parseFloat(value);
  return PixelRatio.roundToNearestPixel((width * number) / 100);
};

//Return size mapped according to screen height
export const heightToDp = (value: string | number) => {
  let number = typeof value === 'number' ? value : parseFloat(value);
  return PixelRatio.roundToNearestPixel((height * number) / 100);
};
