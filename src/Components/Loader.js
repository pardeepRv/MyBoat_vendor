import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, useTheme} from 'react-native-paper';

import {Colors} from '../Constants/Constants';
export const Loading = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator animating={true} color={Colors.orange} size={40} />
    </View>
  );
};
