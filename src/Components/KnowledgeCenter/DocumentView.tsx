import React, {FunctionComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Pdf from 'react-native-pdf';
import theme from '../../values/theme';
import {getPdfDate} from '../../Services/format';
import {widthToDp} from '../../values/size';

type props = {
  doc: any;
  style?: ViewStyle;
  onPress: () => void;
};

const DocumentView: FunctionComponent<props> = ({doc, style, onPress}) => {
  return (
    <TouchableOpacity style={[styles.pdfView, style]} onPress={onPress}>
      {doc.type === 'pdf' ? (
        <Pdf
          source={{
            uri: doc.link,
            cache: true,
          }}
          style={styles.pdf}
          page={1}
          scale={3}
          singlePage={true}
        />
      ) : (
        <Image
          source={{uri: doc.link}}
          style={styles.pdf}
          resizeMode={'contain'}
        />
      )}
      <View style={styles.pdfBar}>
        <Icon
          name={doc.type === 'pdf' ? 'file-pdf' : 'file-image'}
          color={'#E63A3B'}
          size={19}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.filename} numberOfLines={1}>
            {doc.name}
          </Text>
          <Text style={styles.date}>{getPdfDate(doc.created_at.toDate())}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pdfView: {
    height: widthToDp(52),
    width: widthToDp(80),
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginRight: 25,
  },
  pdf: {
    height: '72%',
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  pdfBar: {
    height: '28%',
    width: '100%',
    paddingHorizontal: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  icon: {},
  textContainer: {
    marginLeft: 15,
    height: '100%',
    justifyContent: 'space-evenly',
    paddingVertical: '2%',
    width: '80%',
  },
  filename: {
    fontSize: 14,
    width: '100%',
  },
  date: {
    fontSize: 11,
    color: theme.colors.GREY,
  },
});

export default DocumentView;
