import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import CustomButton from '../shared/CustomButton';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';
import { SCREEN_NAMES } from '../../constants/navigation';
import { useDispatch } from 'react-redux';
import { PAIN_ASSESSMENT_DATA_ACTION, PATIENT_DETAILS_ACTION, PATIENT_NAME_ACTION } from '../../constants/actions';

const {width, height} = Dimensions.get('window');

const PatientDetailModal = ({open, onClose, patientData}) => {
    const navigation = useNavigation()
    const  dispatch = useDispatch()
  const age =
    new Date().getFullYear() - new Date(patientData.dob).getFullYear();
  return (
    <ReactNativeModal
      isVisible={open}
      deviceHeight={height}
      deviceWidth={width}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={500}
      animationOutTiming={500}
      onBackdropPress={() => {
        onClose();
      }}
      backdropOpacity={0.6}
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}  
    >
      <View style={styles.mainView}>
        <View style={styles.nameView}>
          <Text style={styles.nameText}>{`${patientData.first_name} ${patientData.last_name}`}</Text>
          <AntDesignIcon
            name={'close'}
            style={styles.closeIcon}
            onPress={() => {
              onClose();
            }}
          />
        </View>
        <View style={styles.medicalNumberView}>
          <Text style={styles.medicalText}>{age + '  year old' + ', '}</Text>
          <Text style={styles.genderText}>{patientData.gender}</Text>
        </View>
        <View style={styles.medicalNumberView}>
          <Text style={styles.medicalText}>Medical Number:</Text>
          <Text style={styles.medicalRecord}>{patientData.medical_record_no}</Text>
        </View>
        <View style={styles.buttonView}>
          <CustomButton
            onPress={() => {
              dispatch({
                type:PATIENT_NAME_ACTION.PATIENT,
                payload:{
                  patient_id:patientData.id,
                 patient_name:patientData.first_name + ' ' +patientData.last_name
                }

              })
              dispatch({
                type: PATIENT_DETAILS_ACTION.PATIENT_DETAILS,
                payload: patientData,
              });
                navigation.navigate(SCREEN_NAMES.PAINASSESSMENT,{
                    name:patientData.name
                })
            }}
            title="Add Patient"
            textStyle={styles.textStyle}
            style={styles.styles}
          />
          <CustomTouchableOpacity
            onPress={() => {
              onClose();
            }}
            style={styles.cancelView}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </CustomTouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
};
export default PatientDetailModal;
