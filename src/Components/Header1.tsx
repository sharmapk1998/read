import React,{FC} from 'react'
import { Pressable, StyleSheet, Text, View} from 'react-native';

interface Props {
    title:string;
    para1:string;
    para2:string;
    button:string;
    onPress: () => void;
}

const Header1 : FC <Props> = (props) => {
    return (
        <View style={styles.navbar}>
          <View style={styles.n_container}>
            <View>
              <Text style={styles.heading}>{props.title}</Text>
              <Text style={styles.para}>{props.para1}{"\n"}{props.para2}</Text>
            </View>
            <Pressable style={styles.button} onPress={props.onPress}><Text style={styles.b_text}>{props.button}</Text></Pressable>
          </View> 
        </View>
    )
}

const styles = StyleSheet.create({
    b_text:{
        color:  '#279F9F',
        fontSize:15,
        marginHorizontal:5,
        
        fontWeight:'bold'
    },
    heading:{
        fontSize:28,
     
        color:'white'
    },
    para:{
        fontSize:16,
      
        color:'white',
        marginVertical:15,
        marginBottom:60
        
    },
    button:{
        alignSelf:'flex-start',
        marginVertical:3,
        backgroundColor:'white',
        padding:10,
        borderRadius:5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,  
        elevation: 5
    },
    navbar:{
      position:'absolute',
      backgroundColor:'#279F9F',
      width:'100%',
    },
    n_container:{
      marginVertical:60,
      marginHorizontal:20,
      flexDirection:'row',
      justifyContent:'space-between'
      
    },
});

export default Header1;
