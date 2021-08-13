import React from 'react';
import {View, Text, useWindowDimensions} from 'react-native';

import {COLORS} from '../../constants/colors';
import styles from './styles';

const NoEntryCard = ({}) => {
  const {width, height} = useWindowDimensions();
  
  return (
    <View
      style={[
        styles.patientCardContainer,
        {
          height: height * 0.18,
        },
      ]}>
      <View
        style={{
          padding: 20,
        }}>
        <Text style={styles.noEntryMainLabel}>No Entry Yet</Text>
        <Text numberOfLines={3} style={[styles.noEntrySubLabel,{fontSize : height>850 ? 16 : 14,lineHeight:height>850 ? 24 : 20,}]}>
          You don’t have any entry yet. Start a new pain assessment or
          medication.
        </Text>
      </View>
    </View>
  );
};

export default NoEntryCard;
