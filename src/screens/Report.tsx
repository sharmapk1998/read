import React,{useState,FunctionComponent,useEffect} from 'react'
import { Pressable, StyleSheet, Text, View, SafeAreaView, TextInput , Image, ScrollView} from 'react-native';
import { Header, Queries } from '../Components/index';
import Feedback from '../Components/feedback';
// import Filter from '../icons/filter.svg';
import {connect, useDispatch} from 'react-redux';
import {fetchquery} from '../Services/query';
import {BACKEND_URL, TOKEN} from '../values/backend';
import axios from 'axios';

type props = {
  onBack: () => void;
  show: boolean;
  user: any;
  navigation: any;
};



const Report: FunctionComponent<props>=({
  onBack,
  show,
  user,
  navigation,
}) => {
  const [load, setLoad] = useState(false);
  const [finalDataList, setFinalDataList] = useState<any[]>([]);
  const dispatcher = useDispatch();

  useEffect(() => {
    fetchquery(
      user.uid,
      dispatcher,
       (data) => setFinalDataList(data),
       (value) => setLoad(value),
       );
}, [user]);

  return (
    <View>
        <Header 
        title="Report"
        para1="Thanks for taking a good minute"
        para2="Detailed report."
        button="Query"
        onPress={()=>navigation.navigate("Query")}/>
        <View style={styles.main}>
          <View style={styles.container}>
          <TextInput style={styles.input} placeholder="Search" />
          </View>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <View style={styles.q}>
            <Text style={styles.q_text}>Queries : 0</Text>
            {/* <Image source={Filter} style={{width:30,height:30}}/> */}
          </View>
          <View style={styles.query}>
          <Queries title="Analytic/Report issue" date="25-06-2021" description="Lorem upsum is a placeholder text also used commonly in app development" tno={1234} ctime="11:30 am" status="Open"/> 
          <Feedback/>
          </View>
          <View style={styles.query}>
          <Queries title="Analytic/Report issue" date="25-06-2021" description="Lorem upsum is a placeholder text also used commonly in app development" tno={1234} ctime="11:30 am" status="Open"/> 
          <Feedback/>
          </View>
          <View style={styles.query}>
          <Queries title="Analytic/Report issue" date="25-06-2021" description="Lorem upsum is a placeholder text also used commonly in app development" tno={1234} ctime="11:30 am" status="Open"/> 
          <Feedback/>
          </View>
          </ScrollView>
         {/*<Text style={styles.call}>Call Now</Text>*/}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  query:{
      marginVertical:20,
      elevation:5
    },
  q:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginVertical:45
  },
  q_text:{
    fontSize:20,
    fontWeight:'bold',
    color:  '#279F9F',
  },
  input:{
    alignSelf:'center',
    backgroundColor:'white',
    fontWeight:"bold",
    padding:10,
    width:"98%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,  
    elevation: 5
  },
  container:{
    flexDirection:'column',
    marginVertical:-20
    
  },
  main:{
    borderTopLeftRadius:40,
    borderTopRightRadius:40,
    marginTop:200,
    justifyContent: 'center',
    padding: 20,
    paddingTop:0,
    backgroundColor: 'white',

  }
});

const mapStateToProps = (state: any) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Report);