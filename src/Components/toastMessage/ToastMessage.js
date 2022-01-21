import React from 'react';
import { View } from 'react-native';
import { Toast } from 'native-base';

const ToastMessage = (props) => {
  return (
    <View>
      {Toast.show({
        text: props.message,
        type: props.type,
        position: 'bottom',
        duration: 3000,
      })}
    </View>
  );
};

export default ToastMessage;
