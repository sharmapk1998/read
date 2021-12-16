import React, { useState } from 'react';
import {StyleSheet} from 'react-native';
import GlobalState from './redux/GlobalState';
import IndexRoute from './routes/IndexRoute';
// import {checkConnected} from './Services/net';
// import NoNetwork from './screens/NoNetwork'

const App = () => {
  // const [connected , setConnected] = useState(false)
  // checkConnected().then((res:any) => {
  //   setConnected(res)
  // })
  return (
    // connected?(
    <GlobalState>
      <IndexRoute />
    </GlobalState>
    // ):(<NoNetwork/>)
  );
};

const styles = StyleSheet.create({});

export default App;
