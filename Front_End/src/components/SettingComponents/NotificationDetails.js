import React from 'react';
import {Text} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import styles from '../../screens/Settings/styles';

const NotificationDetails = ({item, length, index}) => {
  const hideBorder = length - 1 === index;
  return (
    <CustomTouchableOpacity key ={index}
      style={[styles.itemsView, {borderBottomWidth: hideBorder ? 0 : 1}]}>
      <Text style={styles.itemTextStyle}>{item.label}</Text>
      <AntDesignIcon name={'arrowright'} style={styles.itemIcon} />
    </CustomTouchableOpacity>
  );
};
export default NotificationDetails;
