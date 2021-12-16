import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import theme from '../values/theme';
import Icon from 'react-native-vector-icons/Ionicons';
type props = {
  data: any[];
  title: string;
  titleStyle?: TextStyle;
  pickerStyle?: ViewStyle;
  selected: string;
  setSelected: (value: any) => void;
  style?: ViewStyle;
  search?: boolean;
  notMandatory?: boolean;
};

const CustomPicker: FunctionComponent<props> = ({
  title,
  data,
  titleStyle,
  pickerStyle,
  selected,
  setSelected,
  style,
  search,
  notMandatory,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  useEffect(() => {
    if (search === false || search === undefined) {
      setFilteredData(data);
      return;
    }
    if (searchQuery.length === 0) {
      setFilteredData(data);
    } else {
      let newData = [...data];
      newData = data.filter((item: string) =>
        item.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(newData);
    }
  }, [data, searchQuery]);
  return (
    <>
      <View style={style}>
        <Text style={[{fontWeight: 'bold'}, titleStyle]}>
          {title}
          {notMandatory === undefined && (
            <Text style={{color: theme.colors.RED}}> *</Text>
          )}
        </Text>
        <TouchableOpacity
          style={[styles.picker, pickerStyle]}
          onPress={() => setShowMenu(true)}>
          <Text style={styles.selectedText}>
            {selected.charAt(0).toUpperCase() + selected.slice(1)}
          </Text>
          <Icon name={'caret-down'} size={18} color={'#00000070'} />
        </TouchableOpacity>
      </View>
      <Modal
        visible={showMenu}
        onRequestClose={() => setShowMenu(false)}
        transparent={true}>
        <Pressable onPress={() => setShowMenu(false)} style={styles.modal}>
          <View
            style={
              search
                ? [styles.menuContainer, {height: (data.length + 1) * 50 + 55}]
                : [styles.menuContainer, {height: (data.length + 1) * 50}]
            }>
            <ScrollView
              style={styles.menu}
              contentContainerStyle={{paddingHorizontal: '2%'}}>
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  setShowMenu(false);
                  setSelected('select');
                }}>
                <Text style={[styles.itemText, {color: '#00000080'}]}>
                  - Select -
                </Text>
              </TouchableOpacity>
              {search && (
                <View style={styles.searchParent}>
                  <TextInput
                    placeholder={'Search'}
                    style={styles.searchBox}
                    placeholderTextColor={theme.colors.PLACEHOLDER}
                    value={searchQuery}
                    onChangeText={(value) => setSearchQuery(value)}
                  />
                  <Icon name={'search'} />
                </View>
              )}
              {filteredData.map((item: string, index: number) => (
                <TouchableOpacity
                  style={
                    index + 1 === data.length
                      ? [styles.itemContainer, {borderBottomWidth: 0}]
                      : styles.itemContainer
                  }
                  key={index}
                  onPress={() => {
                    setShowMenu(false);
                    setSelected(item);
                  }}>
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  picker: {
    width: '100%',
    marginTop: 15,
    backgroundColor: theme.colors.GREY_BACKGROUND,
    borderRadius: 10,
    paddingHorizontal: '5%',
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedText: {
    fontSize: 16,
    width: '95%',
  },
  modal: {
    height: '100%',
    width: '100%',
    backgroundColor: '#00000050',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    width: '85%',
    maxHeight: '70%',
  },
  menu: {
    width: '100%',
    backgroundColor: '#fff',
  },
  itemContainer: {
    height: 50,
    borderBottomColor: theme.colors.GREY_LIGHT,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 0.3,
  },
  itemText: {
    fontSize: 16,
  },
  searchParent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    borderColor: theme.colors.GREY_LIGHT,
    borderWidth: 0.3,
    borderRadius: 50,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  searchBox: {
    width: '90%',
    paddingVertical: 5,
  },
});

export default CustomPicker;
