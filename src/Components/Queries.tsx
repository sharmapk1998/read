import React,{FC} from 'react'
import { View, StyleSheet, Text } from 'react-native'

interface Props {
    title:string,
    description:string,
    tno:number,
    ctime:string,
    status:string,
    date:string
}

const Queries : FC <Props> = (props) => {
    return(
        <View style={styles.layout}>
            <View style={styles.container}>
                <Text style={styles.title}>{props.title}</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
                <Text style={styles.desc}>{props.description}</Text>
            
            <View style={styles.g_container}>
                <View style={styles.grp}>
                    <Text style={styles.g_text}>Ticket No.</Text>
                    <Text style={styles.g_value}>{props.tno}</Text>
                </View>
                <View style={styles.grp}>
                    <Text style={styles.g_text}>Closure time</Text>
                    <Text style={styles.g_value}>{props.ctime}</Text>
                </View>
                <View style={styles.grp}>
                    <Text style={styles.g_text}>Status</Text>
                    <Text style={styles.g_value}>{props.status}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    grp:{
        paddingHorizontal:10
    },
    g_text:{
        fontSize:12,
        fontWeight:'bold',
        color:'rgba(128, 128, 128, 1)',
        marginVertical:2
    },
    g_value:{
        fontSize:18,
        fontWeight:'bold',
        marginVertical:2
    },
    title:{
        fontSize:18,
        fontWeight:'bold'
    },
    date:{
        fontSize:12,
        fontWeight:'bold',
        color:'#535353',
        alignSelf:'center'
    },
    desc:{
        paddingLeft:15,
        paddingBottom:40,
        width:'90%',
        color:'rgba(128, 128, 128, 0.8)',
        fontWeight:'bold'
    },
    layout:{
        flexDirection:'column',
        backgroundColor:'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 5,  

    },
    container:{
        flexDirection:'row',
        justifyContent:'space-between',
        padding:13
    },
    g_container:{
        flexDirection:'row',
        justifyContent:'space-between',
        padding:13,
        backgroundColor:'rgba(128, 128, 128, 0.1)' 
    }

})

export default Queries