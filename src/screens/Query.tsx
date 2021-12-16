import React,{useState,FunctionComponent} from 'react'
import { Pressable, StyleSheet, Text, View, SafeAreaView, TextInput , Image,ScrollView} from 'react-native';
import { Header, GradientButton} from '../Components/index';
import DropDownPicker from 'react-native-dropdown-picker';
import Report from './Report';
import {connect, useDispatch} from 'react-redux';
import {BACKEND_URL, TOKEN} from '../values/backend';

type props = {
  onBack: () => void;
  show: boolean;
  user: any;
  navigation: any;
};

const Query: FunctionComponent<props>=({onBack, show,user,navigation})=> {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'test1', value: 'test1'},
    {label: 'test2', value: 'test2'}
  ]);
  const [number, setNumber] = useState("");
  const [file, setFile] = useState("");
  const [User_email, setUser_email] = useState(user.user_email);
  const [User_name, setUser_name] = useState(user.user_first_name + ' ' + user.user_last_name);
  const [User_id, setUser_id] = useState(user.uid);
  const [Org_id, setOrg_id] = useState(user.organization_id);
  const [desc, setDesc] = useState("");
  const dispatcher = useDispatch();

  const handleSubmit = () => {
    
  const query = {number, value, file, desc,User_email,User_name,User_id,Org_id};
    console.log("",query)
    fetch(BACKEND_URL + '/addQuery',{
      method:'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({query}),
    })
    .then((data) => {
      console.log('new query added')
      console.log("data -- ",data)
    })
    .catch(function(res){ console.log(res) })
  }
  console.log("user--",user)
  console.log("User_id--",user.uid)
  console.log("organization_id--",user.organization_id)
  
  return (
    <View >
        <ScrollView>
        <Header
        title="Query?"
        para1="Thanks for taking a good minute"
        para2="to submit your valuable info."
        button="Report"
        onPress={()=>navigation.navigate("Report")}/>
        <View style={styles.main}>
          <View style={styles.container}>
          <Text style={styles.i_text}>Mobile No.</Text>
          <TextInput 
          style={styles.input} 
          value={number} 
          onChangeText={(number) => setNumber(number)}></TextInput>
          </View>
          <View style={styles.container}>
          <Text style={styles.i_text}>Type of Query</Text>
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
          <Text style={styles.i_text}>Attachments</Text>
          <TextInput 
          style={styles.input} 
          value={file} 
          onChangeText={(file) => setFile(file)}></TextInput>
          </View>
          <View style={styles.container}>
          <Text style={styles.i_text}>Description</Text>
          <TextInput style={styles.input}  multiline={true}
            numberOfLines={5}
            underlineColorAndroid='transparent'
            value={desc}
            onChangeText={(desc) => setDesc(desc)}
            ></TextInput>
          </View>
          <View style={styles.container}>
            <GradientButton color1="#279F9F" color2="#71CACC" title="Submit" onPress={() => handleSubmit()}/>
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
    padding:6
  },
  container:{
    flexDirection:'column',
    marginVertical:8
    
  },
  main:{
    margin:25,
    marginTop:200,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,  
    elevation: 7
  }
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Query);