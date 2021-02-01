import React from 'react';
import {
  Platform,
  TouchableOpacity as AndroidTouchableOpacity,
} from 'react-native';
import {TouchableOpacity as IosTouchableOpacity} from 'react-native-gesture-handler';

const CustomTouchableOpacity = (props) => {
  if (Platform.OS === 'android' && !props.useGesture)
    return <AndroidTouchableOpacity {...props} />;
  else return <IosTouchableOpacity {...props} />;
};

export default CustomTouchableOpacity;
