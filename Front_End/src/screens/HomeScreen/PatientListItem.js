import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import {SCREEN_NAMES} from '../../constants/navigation';
import styles from './styles';


const PatientListItem = ({item,index}) => {


  const navigation = useNavigation();
  const [AmOrPm, setAmOrPm] = useState('');
  const [formattedTime, setFormattedTime] = useState({
    hours: 0,
    minutes: 0,
  });


  useEffect(() => {
    if (item.createdAt) {
      timeFormat(item.createdAt);
    }
  }, [item?.createdAt]);

  const timeFormat = (time) => {
    let timer = new Date(time);
    let getHours = timer.getHours();
    let getMinutes = timer.getMinutes();
    let amORpm = getHours > 12 ? 'PM' : 'AM';
    setAmOrPm(amORpm);
    let hoursFormat = getHours % 12;
    setFormattedTime({
      hours: Boolean(hoursFormat === 0) ? 12 : hoursFormat,
      minutes: Boolean(getMinutes < 10) ? '0' + getMinutes : getMinutes,
    });
  };

  return (
    <CustomTouchableOpacity
      style={styles.patientItemContainer}
      onPress={() => {
        navigation.navigate(SCREEN_NAMES.PATIENT_PROFILE,{item});
      }}>
      <Text
        style={[
          styles.h2Label,
          {
            width: undefined,
          },
        ]}>
        {`${item.first_name} ${item.last_name}`}
      </Text>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Text
          style={[
            styles.h3Label,
            {
              width: undefined,
            },
          ]}>
          {`${formattedTime.hours} : ${formattedTime.minutes}  ${AmOrPm}`}
        </Text>
        <AntDesignIcon name={'arrowright'} size={20} color={COLORS.GRAY_90} />
      </View>
    </CustomTouchableOpacity>
  );
};

export default PatientListItem;
