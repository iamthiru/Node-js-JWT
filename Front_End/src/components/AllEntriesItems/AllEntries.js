import React from 'react';
import {View, Text} from 'react-native';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import styles from '../../screens/PatientProfile/styles';
import { formatAMPM } from '../../utils/date';

const AllEntries = ({data}) => {

  const date = new Date((data.assessment_datetime))
  const dateFormat = `${date.toDateString()} ${formatAMPM(date)}`
  return (
    <View style={styles.allEntriesContainer}>
      <View
        style={{
          paddingLeft: 10,
        }}>
        <Text style={{color: COLORS.GRAY_90}}>{dateFormat}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <CustomTouchableOpacity
          style={{
            paddingRight: 15,
          }}>
          <View style={styles.allEntriesButtonStyle}>
            <Text
              style={{
                color: COLORS.WHITE,
              }}>
              {data.total_score}
            </Text>
          </View>
        </CustomTouchableOpacity>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesignIcon name={'arrowright'} size={20} color={COLORS.GRAY_90} />
        </View>
      </View>
    </View>
  );
};
export default AllEntries;
