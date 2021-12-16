import React, {FunctionComponent, useRef, useState} from 'react';
import {ReactElement} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {widthToDp} from '../../values/size';
import theme from '../../values/theme';
import ImageModal from '../Modals/ImageModal';

const CarouselImage = ({
  item,
  onPress,
}: {
  item: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={{uri: item}}
        resizeMode={'contain'}
        style={{height: 175, width: '100%', borderRadius: 5}}
      />
    </TouchableOpacity>
  );
};

type props = {
  carouselList: string[];
  style?: ViewStyle;
  itemWidth?: any;
  ImageView?: (item: any) => ReactElement;
};

const CustomCarousel: FunctionComponent<props> = ({
  carouselList,
  style,
  ImageView,
  itemWidth,
}) => {
  const carouselRef = useRef(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [url, setUrl] = useState('');
  const onPress = (url: string) => {
    setUrl(url);
    setShowImageModal(true);
  };
  return (
    <>
      {showImageModal === true && (
        <ImageModal
          url={url}
          show={showImageModal}
          hide={() => setShowImageModal(false)}
          share={true}
        />
      )}
      <View style={[styles.carouselStyle, style]}>
        <Carousel
          ref={carouselRef}
          data={carouselList}
          renderItem={({item, index}: {item: any; index: number}) =>
            ImageView ? (
              ImageView(item)
            ) : (
              <CarouselImage item={item} onPress={() => onPress(item)} />
            )
          }
          sliderWidth={itemWidth ? itemWidth : widthToDp(90)}
          itemWidth={itemWidth ? itemWidth : widthToDp(90)}
          loop={true}
          autoplay={true}
          enableMomentum={false}
          lockScrollWhileSnapping={true}
          autoplayInterval={4000}
          onSnapToItem={(index: number) => setItemIndex(index)}
        />
        <Pagination
          //@ts-ignore
          carouselRef={carouselRef}
          tappableDots={true}
          dotsLength={carouselList.length}
          activeDotIndex={itemIndex}
          containerStyle={{
            marginTop: 10,
            alignSelf: 'center',
            width: carouselList.length * widthToDp(8),
            paddingVertical: 0,
          }}
          dotStyle={{
            width: 9,
            height: 9,
            borderRadius: 5,
            backgroundColor: theme.nav_colors.PRIMARY,
          }}
          inactiveDotStyle={{
            backgroundColor: theme.nav_colors.INACTIVE,
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.8}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  carouselStyle: {
    height: 200,
    width: '100%',
  },
});

export default CustomCarousel;
