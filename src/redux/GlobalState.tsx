import React, {FunctionComponent, ReactChild} from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import allReducer from './reducers';

const store = createStore(allReducer);
type props = {
  children: ReactChild;
};

const GlobalState: FunctionComponent<props> = ({children}) => {
  return <Provider store={store}>{children}</Provider>;
};

export default GlobalState;