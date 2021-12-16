import React,{FC, useState} from 'react'
import { Pressable, StyleSheet, Text, View, SafeAreaView, Image, TextInput } from 'react-native';
const smiley  = require("../icons/smiley.png")
const black = require("../icons/black.png")

const Feedback : FC  = () => {
    const [done,setDone] = useState(false)
    const [comment,setComment] = useState<any>("");
    if(done){
        return(
            <View style={{margin:10}}>
                 <Text style={{alignSelf:'center'}}>{comment}</Text>
            <View style={styles.feedback}>
                <Pressable onPress={() => setDone(true)}><Image source={black} style={styles.smiley}/></Pressable>
                <Pressable onPress={() => setDone(true)}><Image source={black} style={styles.smiley}/></Pressable>
                <Pressable onPress={() => setDone(true)}><Image source={black} style={styles.smiley}/></Pressable>
                <Pressable onPress={() => setDone(true)}><Image source={smiley} style={styles.smiley}/></Pressable>
                <Pressable onPress={() => setDone(true)}><Image source={smiley} style={styles.smiley}/></Pressable>
            </View>
               
            </View>
        )
    }
    return (
        <View>
        {/* <View style={styles.feedback}>
            <Text>Ratings and Reviews</Text>
            <View style={styles.stars}>
                <Pressable onPress={() => setDone(true)}><Image source={smiley} style={styles.smiley}/></Pressable>
                <Pressable onPress={() => setDone(true)}><Image source={smiley} style={styles.smiley}/></Pressable>
                <Pressable onPress={() => setDone(true)}><Image source={smiley} style={styles.smiley}/></Pressable>
                <Pressable onPress={() => setDone(true)}><Image source={smiley} style={styles.smiley}/></Pressable>
                <Pressable onPress={() => setDone(true)}><Image source={smiley} style={styles.smiley}/></Pressable>
            </View>
            
        </View> */}
        <TextInput style={styles.input} placeholder="Add your review here" placeholderTextColor="black" value={comment} onChange={(comment) => setComment({comment})}></TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    stars:{
        flexDirection:'row'
    },
    input:{
        borderWidth:0,
        padding:10
      },
    feedback:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10,
        backgroundColor:'rgba(128, 128, 128, 0.05)' 
    },
    smiley:{
        height:25,
        width:25,
        margin:2
    }
})

export default Feedback;