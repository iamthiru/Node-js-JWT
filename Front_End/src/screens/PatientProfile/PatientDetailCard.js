import React, {useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {COLORS} from '../../constants/colors';
import styles from './styles';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import NewPatientPopUp from '../HomeScreen/NewPatientPopUp';

const {width, height} = Dimensions.get('window');

const PatientDetailCard = ({profile, setNewPatientPopUp, newPatientPopUp}) => {
  const [updateApiIntegrate, setUpdateApiIntegrate] = useState(false);

  return (
    <View style={styles.patientDetailCardMainView}>
      <Text style={styles.patientName}>
        {`${profile.first_name} ${profile.last_name}`}
      </Text>
      <Text style={styles.patientAge}>
        {new Date().getFullYear() - new Date(profile.dob).getFullYear()}
        {' year old, ' + profile.gender}
      </Text>
      <Text style={styles.medicalNumber}>
        {'Medical Number: ' + profile.medical_record_no}
      </Text>
      <View style={styles.editButton}>
        <CustomTouchableOpacity
          onPress={() => {
            setNewPatientPopUp(true);
            setUpdateApiIntegrate(true);
          }}
          style={styles.editButtonTouch}>
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
