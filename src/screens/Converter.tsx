import React,{useState,FunctionComponent,useEffect} from 'react'
import { Pressable, StyleSheet, Text, View, SafeAreaView, TextInput , Image,ScrollView} from 'react-native';
import Header from '../Components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import convert from "convert-units";
import SubmitButton from '../Components/SubmitButton';
type props = {
  onBack: () => void;
  show: boolean;
  user: any;
  navigation: any;
};

const Query: FunctionComponent<props>=({
  onBack,
  show,
  user,
  navigation,
})=> {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [value, setValue] = useState<any>();
  const [value2, setValue2] = useState<any>();
  const [items, setItems] = useState([
    {label: 'Square Millimeters', value: 'mm2'},                 
    {label: 'Centimetrers', value: 'cm2'},
    {label: 'Square Meters', value: 'm2'},
    {label: 'Hectares', value: 'ha'},
    {label: 'Square Kilometers', value: 'km2'},
    {label: 'Square Inches', value: 'in2'},
    {label: 'Square Yards', value: 'yd2'},
    {label: 'Square Feet', value: 'ft2'},
    {label: 'Square Miles', value: 'mi2'},
    {label: 'Acres', value: 'ac'},
  ]);
  const [items2, setItems2] = useState([
    {label: 'Square Millimeters', value2: 'mm2'},                 
    {label: 'Centimetrers', value2: 'cm2'},
    {label: 'Square Meters', value2: 'm2'},
    {label: 'Hectares', value2: 'ha'},
    {label: 'Square Kilometers', value2: 'km2'},
    {label: 'Square Inches', value2: 'in2'},
    {label: 'Square Yards', value2: 'yd2'},
    {label: 'Square Feet', value2: 'ft2'},
    {label: 'Square Miles', value2: 'mi2'},
    {label: 'Acres', value2: 'ac'},
  ]);
  const [number, setNumber] = useState<any>();
  const [Ans1, setAns1] = useState<any>();
  // const [Ans2, setAns2] = useState();
  // const [Ans3, setAns3] = useState();
  // const [Ans4, setAns4] = useState();
  // const [Ans5, setAns5] = useState();
  // const [Ans6, setAns6] = useState();
  // const [Ans7, setAns7] = useState();
  // const [Ans8, setAns8] = useState();
  // const [Ans9, setAns9] = useState();
  // const [Ans10, setAns10] = useState();
  

//   const handleConversion = () => {
//     let A= convert(number).from(value).to(value2);
//     setAns1(A)
// }

  useEffect(() => {
    let A= convert(number).from(value).to(value2);
    return () => {
      setAns1(A) 
    }
  }, [number])

  return (
    <View style={{height:"100%"}} >
        <ScrollView>
        <Header title={'Converter'} onBack={() => navigation.goBack()} />
          
        <View style={styles.main}>
        <View style={styles.main1}>
          <View style={styles.container}>
          <Text style={styles.i_text}>Unit From</Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="-Select-"
            placeholderStyle={{color:"grey"}}
            style={styles.input}
          />
          </View>
          <View style={styles.container}>
          <Text style={styles.i_text}>Unit To</Text>
          <DropDownPicker
            open={open1}
            value={value2}
            items={items2}
            setOpen={setOpen1}
            setValue={setValue2}
            setItems={setItems2}
            placeholder="-Select-"
            placeholderStyle={{color:"grey"}}
            style={styles.input}
          />
          </View>
        </View>
        <View style={styles.main}>
        <View style={styles.container}>
          <Text style={styles.i_text}>Value</Text>
          <TextInput style={styles.input} value={number} keyboardType="numeric" onChange={(number) => setNumber(number)}></TextInput>
        </View>
        {/* <SubmitButton
            title={'Update'}
            style={{marginTop: 50}}
            onPress={handleConversion}
          /> */}
          <View style={styles.container}>
          <Text style={styles.i_text}>Converted Value</Text>
          <Text style={styles.solve} >{Ans1}</Text>
          </View>
        </View>
        </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  call:{
    alignSelf:'center',
    fontSize:16,
    fontWeight:'bold',
    color:'#279F9F'  
  },
  
  i_text:{
    color:'#535353',
    fontSize:16,
    fontWeight:'bold',
    margin:5,
    
  },
  input:{
    borderWidth:1.5,
    borderColor:'rgba(128, 128, 128, 0.3)',
    borderRadius:10,
    padding:6,
    height:45,
    alignContent:"center",
  },
  container:{
    marginVertical:8,
    width:"45%",
    marginHorizontal:8
  },
  main:{
    justifyContent: 'center',
    marginHorizontal:8
  },
  main1:{
    flexDirection:'row',
    justifyContent: 'center',
  },
  solve:{
    borderWidth:1.5,
    padding:12,
    height:45,
    borderColor:'rgba(128, 128, 128, 0.3)',
    borderRadius:10,
    color:'#279F9F',
    fontSize:16,
    fontWeight:'bold',
    width:150,
    alignSelf:"center",
  }
});

export default Query;