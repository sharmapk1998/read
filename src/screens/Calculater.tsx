import React,{FunctionComponent} from 'react'
import {Text, View} from 'react-native'
import { Calculator } from 'react-native-calculator'
import Header from '../Components/Header';

type props = {
    navigation: any;
    route: any;
  };

const Calculater:FunctionComponent<props> = ({
    navigation,
    route,
  }) => {
    return (
        <View style={{ flex: 1 }}>
            <Header title={'Calculator'} onBack={() => navigation.goBack()} />
            <View style={{ flex: 1 }}>
            <Calculator style={{height:"100%"}} calcButtonBackgroundColor='#279F9F' />
            </View>
        </View>
    )
}

export default Calculater
