import {useRoute} from '@react-navigation/core';
import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import CustomButton from '../../components/shared/CustomButton';
import {COLORS} from '../../constants/colors';
import {SCREEN_NAMES} from '../../constants/navigation';
import styles from './styles';
import Footer from '../../components/Footer';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import NewPatientPopUp from '../HomeScreen/NewPatientPopUp';
import {useDispatch} from 'react-redux';
import {PATIENT_NAME_ACTION} from '../../constants/actions';

const {width, height} = Dimensions.get('window');

const PatientDetailCard = ({profile, setNewPatientPopUp, newPatientPopUp}) => {
  const [updateApiIntegrate, setUpdateApiIntegrate] = useState(false);
  const dispatch = useDispatch();
  console.log('-------item----', profile);

  return (
    <View
      style={{
        width: width,
        paddingHorizontal: 30,
        paddingBottom: 20,
        backgroundColor: COLORS.WHITE,
        borderBottomColor: COLORS.BLACK,
        borderBottomWidth: 1,
      }}>
      <Text
        style={{
          color: COLORS.PRIMARY_DARKER,
          fontSize: 20,
          lineHeight: 32,
          fontWeight: '700',
        }}>
        {`${profile.first_name} ${profile.last_name}`}
      </Text>
      <Text
        style={{
          color: COLORS.PRIMARY_DARKER,
          fontSize: 16,
          lineHeight: 32,
          fontWeight: '400',
        }}>
        {new Date().getFullYear() - new Date(profile.dob).getFullYear()}
        {' year old, ' + profile.gender}
      </Text>
      <Text
        style={{
          color: COLORS.PRIMARY_DARKER,
          fontSize: 16,
          lineHeight: 32,
          fontWeight: '400',
        }}>
        {'Medical Number: ' + profile.medical_record_no}
      </Text>
      <View
        style={{
          position: 'absolute',
          top: 10,
          right: 30,
        }}>
        <CustomTouchableOpacity
          onPress={() => {
            setNewPatientPopUp(true);
            setUpdateApiIntegrate(true);
          }}
          style={{
            borderBottomColor: COLORS.PRIMARY_MAIN,
            borderBottomWidth: 1,
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.h3Label,

              {
                color: COLORS.PRIMARY_MAIN,
                marginRight: 0,
                fontWeight: '400',
              },
            ]}>
            Edit
          </Text>
        </CustomTouchableOpacity>
      </View>
      <NewPatientPopUp
        open={newPatientPopUp}
        onClose={() => setNewPatientPopUp(false)}
        patientData={profile}
        updateApiIntegrate={updateApiIntegrate}
      />
    </View>
  );
};

export default PatientDetailCard;
