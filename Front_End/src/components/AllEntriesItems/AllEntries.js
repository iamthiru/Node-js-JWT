import React, {useMemo} from 'react';
import {View, Text} from 'react-native';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import styles from '../../screens/PatientProfile/styles';
import {formatAMPM} from '../../utils/date';
import {useDispatch} from 'react-redux';
import {ASSESSMENT_DETAILS_DATA} from '../../constants/actions';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_NAMES} from '../../constants/navigation';

const AllEntries = ({data}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const date = new Date(data.assessment_datetime);
  const dateFormat = `${date.toDateString()} ${formatAMPM(date)}`;
  const impactScoreData = useMemo(() => {
    if (data.total_score === 99) {
      return 'N/A';
    } else {
      return '' + data?.total_score;
    }
  }, [data.total_score]);
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
          disabled={true}
          style={{
            paddingRight: 15,
          }}>
          <View style={styles.allEntriesButtonStyle}>
            <Text
              style={{
                color: COLORS.WHITE,
              }}>
              {impactScoreData}
            </Text>
          </View>
        </CustomTouchableOpacity>
        <CustomTouchableOpacity
          onPress={async () => {
            navigation.navigate(SCREEN_NAMES.ASSESSMENT_DETAILS, {
              assessment_id: data?.id,
            });
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesignIcon name={'arrowright'} size={20} color={COLORS.GRAY_90} />
        </CustomTouchableOpacity>
      </View>
    </View>
  );
};
export default AllEntries;
