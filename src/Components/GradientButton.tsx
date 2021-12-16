import React,{FC} from 'react'
import { Pressable, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
    title:string;
    color1:string;
    color2:string;
    onPress: () => void;
}

const GradientButton : FC <Props> = (props) => {
    return (
      <Pressable onPress={props.onPress}>
        <LinearGradient colors={[`${props.color1}`, `${props.color2}`]} 
          style={styles.linearGradient} 
          start={{ y: 0.0, x: 0.0 }} end={{ y: 0.0, x: 1.0 }}>
          <Text style={styles.buttonText}>{props.title}</Text>
        </LinearGradient>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    linearGradient: {
        marginTop:10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
      },
      buttonText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        fontWeight:'bold',
        color: '#ffffff',
        backgroundColor: 'transparent',
      },
})

export default GradientButton;