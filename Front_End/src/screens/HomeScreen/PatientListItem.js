import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useMemo, useState} from 'react';
import {View, Text} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import {SCREEN_NAMES} from '../../constants/navigation';
import styles from './styles';
import {formatAMPM, padNumber} from '../../utils/date';
import {useDispatch, useSelector} from 'react-redux';
import {
  PATIENT_DETAILS_ACTION,
  PATIENT_PROFILE_UPDATE_ACTION,
} from '../../constants/actions';
let now = new Date();
let year = now.getFullYear();
let month = now.getMonth();
let day = now.getDate();
const yesterday = new Date(year, month, day - 1).getTime();

const PatientListItem = ({item, index}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  
  const createdDateOrTime = useMemo(() => {
    let dateOrTime = new Date(item?.createdAt);
    let year = dateOrTime.getFullYear()
    let month = dateOrTime.getMonth()+1
    let date = dateOrTime.getDate()
    
    if (yesterday && item?.createdAt) {
      if (item?.createdAt > yesterday) {
        return `${year}/${padNumber(month)}/${date}   ${formatAMPM(dateOrTime)}`;
      } else {
        return `${year}/${padNumber(month)}/${date}  ${formatAMPM(dateOrTime)}`;
      }
    }
  }, [yesterday, item?.createdAt]);
  

  return (
    <CustomTouchableOpacity
      key={index}
      style={styles.patientItemContainer}
      onPress={() => {
        navigation.navigate(SCREEN_NAMES.PATIENT_PROFILE);
        dispatch({
          type: PATIENT_DETAILS_ACTION.PATIENT_DETAILS,
          payload: item,
        });
        dispatch({
          type: PATIENT_PROFILE_UPDATE_ACTION.PATIENT_PROFILE_UPDATE,
          payload: true,
        });
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
          {createdDateOrTime}
        </Text>
        <AntDesignIcon name={'arrowright'} size={20} color={COLORS.GRAY_90} />
      </View>
    </CustomTouchableOpacity>
  );
};

export default PatientListItem;
