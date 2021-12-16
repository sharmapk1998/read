import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {checkUser} from '../Services/auth';
import {configureNotification} from '../Services/notification';

const Check = ({navigation}: any) => {
  const dispatcher = useDispatch();
  useEffect(() => {
    configureNotification(dispatcher);
    checkUser(navigation, dispatcher);
  }, []);
  return <></>;
};

export default Check;
