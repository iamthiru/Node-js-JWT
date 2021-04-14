import React from 'react';
import {View, Text} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../constants/colors';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';
import styles from '../../screens/Settings/styles';

const AccountDetails = ({ item,length,index}) => {

  const hideBorder = length-1 === index
  return (
    <CustomTouchableOpacity  key ={index} style={[styles.itemsView,{borderBottomWidth:hideBorder?0:1,}]}>
      <Text style={styles.itemTextStyle}>{item.label}</Text>
      <AntDesignIcon name={'arrowright'} style={styles.itemIcon} />
    </CustomTouchableOpacity>
  );
};
export default AccountDetails;