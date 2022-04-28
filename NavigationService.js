// NavigationService.js
import * as React from 'react';
import {CommonActions} from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params = {}) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function resetRoute(name, params = {}) {
  let action = CommonActions.reset({
    index: 0,
    routes: [{name: name, params: params}],
  });
  navigationRef.current?.dispatch(action);
}

export function logout() {
  let action = CommonActions.reset({
    index: 0,
    routes: [{name: 'Login'}],
  });
  navigationRef.current?.dispatch(action);
}
