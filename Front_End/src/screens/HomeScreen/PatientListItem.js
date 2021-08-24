import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
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
const {width, height} = Dimensions.get('window');
let now = new Date();
let year = now.getFullYear();
let month = now.getMonth();
let day = now.getDate();
const yesterday = new Date(year, month, day - 1).getTime();

const PatientListItem = ({item, index}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const createdDateOrTime = useMemo(() => {
    let dateOrTime = item?.modifiedAt
      ? new Date(item?.modifiedAt)
      : new Date(item?.createdAt);
    let year = dateOrTime.getFullYear();
    let month = dateOrTime.getMonth() + 1;
    let date = dateOrTime.getDate();

    if (yesterday && dateOrTime.getTime()) {
      if (dateOrTime.getTime() > yesterday) {
        return `Today  ${formatAMPM(dateOrTime)}`;
      } else {
        return `${month}/${date}/${year}  ${formatAMPM(dateOrTime)}`;
      }
    }
  }, [yesterday, item?.modifiedAt, item?.createdAt]);

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
      <View>
        <Text
          style={[
            styles.h3Label,
            {
              width: undefined,
            },
          ]}>
          {createdDateOrTime}
        </Text>
        <Text
        numberOfLines = {1}
          style={[
            styles.h2Label,
            {
              width: width * 0.8,
            },
          ]}>
          {`${item.first_name} ${item.last_name}`}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
        }}>
        <AntDesignIcon name={'arrowright'} size={20} color={COLORS.GRAY_90} />
      </View>
    </CustomTouchableOpacity>
  );
};

export default PatientListItem;
