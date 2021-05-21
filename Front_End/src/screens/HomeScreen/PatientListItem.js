import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import {SCREEN_NAMES} from '../../constants/navigation';
import styles from './styles';
import {formatAMPM} from '../../utils/date';

const PatientListItem = ({item, index}) => {
  const navigation = useNavigation();

  return (
    <CustomTouchableOpacity
    key ={index}
      style={styles.patientItemContainer}
      onPress={() => {
        navigation.navigate(SCREEN_NAMES.PATIENT_PROFILE, {item});
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
          {`${formatAMPM(new Date(item.createdAt))}`}
        </Text>
        <AntDesignIcon name={'arrowright'} size={20} color={COLORS.GRAY_90} />
      </View>
    </CustomTouchableOpacity>
  );
};

export default PatientListItem;
