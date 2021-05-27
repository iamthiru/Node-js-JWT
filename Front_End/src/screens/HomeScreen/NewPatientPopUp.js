import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DeviceInfo from 'react-native-device-info';
import ReactNativeModal from 'react-native-modal';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import CustomTextInput from '../../components/shared/CustomTextInput';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import styles from './styles';
import {GENDER_OPTIONS, EYE_COLOR_OPTIONS} from '../../constants/patient';
import CustomDropDown from '../../components/shared/CustomDropDown';
import CustomButton from '../../components/shared/CustomButton';
import {useNavigation} from '@react-navigation/core';
import {SCREEN_NAMES} from '../../constants/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {
  ALL_PATIENTS_ACTIONS,
  PATIENT_NAME_ACTION,
} from '../../constants/actions';
import {addPatientAPI, getPatientListAPI} from '../../api/patientsData';
import patientUpdateApi from '../../api/patientUpdate';

const {width, height} = Dimensions.get('window');

const NewPatientPopUp = ({
  open,
  onClose,
  patientData,
  updateApiIntegrate,
  goToAssessment,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [gender, setGender] = useState(null);
  const [eyeColor, setEyeColor] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [medicalRecord, setMedicalRecord] = useState('');
  const [errorState, setErrorState] = useState([]);
  const userId = useSelector((state) => state.user.loggedInUserId);
  const token = useSelector((state) => state.user.authToken);
  const patientType = updateApiIntegrate ? 'Edit Patient' : 'New Patient';
  const [patientId, setPatientId] = useState(0);

  useEffect(() => {
    if (patientData?.first_name) {
      setFirstName(patientData?.first_name);
    }
    if (patientData?.last_name) {
      setLastName(patientData?.last_name);
    }
    if (patientData?.dob) {
      setSelectedDate(new Date(patientData.dob));
    }
    if (patientData?.medical_record_no) {
      setMedicalRecord(patientData.medical_record_no);
    }
    if (patientData?.gender) {
      setGender(patientData.gender);
    }
    if (patientData?.eyeColor) {
      setEyeColor(patientData?.eyeColor);
    }
  }, [patientData]);

  const validate = useCallback(() => {
    if (errorState?.length) {
      return true;
    }
    if (!lastName || !firstName || !gender || !eyeColor || !selectedDate) {
      return true;
    }
    return false;
  }, [errorState, firstName, lastName, gender, eyeColor, selectedDate]);

  const handleAddPatientApi = useCallback(() => {
    addPatientAPI(
      {
        firstName: firstName[0].toUpperCase()+firstName.slice(1),
        lastName: lastName[0].toUpperCase()+lastName.slice(1),
        dob: new Date(selectedDate).getTime(),
        gender: gender,
        eyeColor: eyeColor,
        medicalRecordNo: medicalRecord,
        createdBy: userId,
      },
      token,
    )
      .then((res) => {
        console.log('-------new Patient Added sucessfully------', res);
        setFirstName('');
        setLastName('');
        setGender(null);
        setEyeColor(null);
        setMedicalRecord('');
        setSelectedDate(null);
        if (res.data.isError) {
          Alert.alert('Invalid data patient data');
          return;
        }
        setPatientId(res.data.result.insertId);
        getPatientListAPI(token)
          .then((res) => {
            if (res.data.err) {
              Alert.alert('------all aptient error------');
              return;
            }
            dispatch({
              type: ALL_PATIENTS_ACTIONS.ALL_PATIENTS,
              payload: res.data.result.sort(
                (item1, item2) => item2.createdAt - item1.createdAt,
              ),
            });
            if (onClose) {
              onClose();
            }
          })
          .catch((err) => {
            console.log('-------error------', err);
          });
      })
      .catch((err) => {
        console.log('-----error-----', err);
      });
  }, [
    dispatch,
    firstName,
    lastName,
    gender,
    eyeColor,
    selectedDate,
    medicalRecord,
  ]);

  const handleSubmit = useCallback(() => {
    if (updateApiIntegrate) {
      patientUpdateApi(
        {
          id: patientData.id,
          first_name: firstName[0].toUpperCase()+firstName.slice(1),
          last_name: lastName[0].toUpperCase()+lastName.slice(1),
          dob: new Date(selectedDate).getTime(),
          eyeColor: eyeColor,
          gender: gender,
          medicalRecordNo: medicalRecord,
          modifiedAt: userId,
        },
        token,
      )
        .then((res) => {
          console.log('--------update data sucessfully-----', res);
          getPatientListAPI(token)
            .then((res) => {
              if (res.data.isError) {
                Alert.alert('all patinets  data error');
                return;
              }
              console.log('result', res);
              setFirstName('');
              setLastName('');
              setGender(null);
              setEyeColor(null);
              setMedicalRecord('');
              setSelectedDate(null);
              getPatientListAPI(token);
              dispatch({
                type: ALL_PATIENTS_ACTIONS.ALL_PATIENTS,
                payload: res.data.result.sort(
                  (item1, item2) => item2.createdAt - item1.createdAt,
                ),
              });
            })
            .catch((err) => {
              console.log('-----all patients error-----', err);
            });
          if (onClose) {
            onClose();
          }
        })
        .catch((err) => {
          console.log('----update error-----', err);
        });
    } else if (goToAssessment) {
      handleAddPatientApi();
      dispatch({
        type: PATIENT_NAME_ACTION.PATIENT,
        payload: {
          patient_id: patientId,
          patient_name: firstName[0].toUpperCase()+firstName.slice(1) + ' ' + lastName[0].toUpperCase()+lastName.slice(1),
        },
      });
      navigation.navigate(SCREEN_NAMES.PAINASSESSMENT);
    } else {
      handleAddPatientApi();
    }
  }, [
    dispatch,
    firstName,
    lastName,
    gender,
    eyeColor,
    selectedDate,
    medicalRecord,
  ]);

  return (
    <ReactNativeModal
      isVisible={open}
      deviceHeight={height}
      deviceWidth={width}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={1000}
      animationOutTiming={1000}
      backdropOpacity={0.6}
      coverScreen={true}
      onStartShouldSetResponder={Keyboard.dismiss}>
      <View style={styles.popUpModal}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}>
          <CustomTouchableOpacity
            onPress={() => {
              if (onClose) {
                onClose();
              }
              setFirstName('');
              setLastName('');
              setGender(null);
              setEyeColor(null);
              setMedicalRecord('');
              setSelectedDate(null);
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
                },
              ]}>
              Cancel
            </Text>
          </CustomTouchableOpacity>
          <Text
            style={[
              styles.h12Label,
              {
                color: COLORS.PRIMARY_MAIN,
                fontWeight: '400',
              },
            ]}>
            {patientType}
          </Text>
          <View
            style={{
              borderBottomColor: COLORS.PRIMARY_MAIN,
              borderBottomWidth: 1,
              alignItems: 'center',
            }}
            // disabled={validate()}
            // onPress={handleSubmit}
          >
            {/* <Text
              style={[
                styles.h3Label,
                {
                  color: COLORS.PRIMARY_MAIN,
                  marginRight: 0,
                  fontWeight: '700',
                },
              ]}>
              Done
            </Text> */}
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: width - 60,
            marginHorizontal: 30,
          }}>
          <ScrollView
            style={{
              marginTop: 20,
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                width: width - 60,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 28,
                  color: COLORS.GRAY_90,
                  fontWeight: '400',
                  maxWidth: width - 60,
                }}>
                {'Name*'}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: width - 60,
                justifyContent: 'space-between',
              }}>
              <CustomTextInput
                placeholder="First"
                onChangeText={(value) => {
                  if (/^(?:[A-Za-z]+)$/.test(value)) {
                    setFirstName(value);
                  } else {
                    console.log('accepts alphabets letters only');
                  }
                }}
                value={firstName}
                inputStyle={{
                  width: (width - 60) / 2 - 20,
                  borderWidth: 0,
                  backgroundColor: 'transparent',
                }}
                containerStyle={{
                  borderRadius: 5,
                  backgroundColor: COLORS.WHITE,
                  borderWidth: 1,
                  borderColor: COLORS.GRAY_80,
                  height: 55,
                }}
                onBlur={() => {}}
              />
              <CustomTextInput
                placeholder="Last"
                onChangeText={(value) => {
                  if (/^(?:[A-Za-z]+)$/.test(value)) {
                    setLastName(value);
                  } else {
                    console.log('accepts alphabets letters only');
                  }
                }}
                value={lastName}
                inputStyle={{
                  width: (width - 60) / 2 - 20,
                  borderWidth: 0,
                  backgroundColor: 'transparent',
                }}
                containerStyle={{
                  borderRadius: 5,
                  backgroundColor: COLORS.WHITE,
                  borderWidth: 1,
                  borderColor: COLORS.GRAY_80,
                  height: 55,
                }}
                onBlur={() => {}}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: width - 60,
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 28,
                  color: COLORS.GRAY_90,
                  fontWeight: '400',
                  maxWidth: width - 60,
                }}>
                {'Date of Birth*'}
              </Text>
            </View>

            <CustomTouchableOpacity
              onPress={() => {
                setShowDatePicker(true);
              }}
              style={{
                width: width - 60,
                height: 55,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: COLORS.GRAY_80,
                backgroundColor: COLORS.WHITE,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 24,
                  color: selectedDate ? COLORS.GRAY_90 : COLORS.GRAY_60,
                }}>
                {selectedDate
                  ? `${
                      selectedDate.getMonth() + 1
                    }/${selectedDate.getDate()}/${selectedDate.getFullYear()}`
                  : 'Select a Date'}
              </Text>
              <AntDesignIcon
                name={'calendar'}
                size={15}
                color={COLORS.GRAY_90}
              />
            </CustomTouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                width: width - 60,
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 28,
                  color: COLORS.GRAY_90,
                  fontWeight: '400',
                  maxWidth: width - 60,
                }}>
                {'Gender*'}
              </Text>
            </View>

            <CustomDropDown
              items={GENDER_OPTIONS}
              value={gender}
              onChangeValue={(item) => {
                setGender(item.value);
              }}
              containerStyle={{marginBottom: 10, width: width - 60}}
              placeholder={'Select One'}
            />

            <View
              style={{
                flexDirection: 'row',
                width: width - 60,
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 28,
                  color: COLORS.GRAY_90,
                  fontWeight: '400',
                  maxWidth: width - 60,
                }}>
                {'Eye Color*'}
              </Text>
            </View>

            <CustomDropDown
              items={EYE_COLOR_OPTIONS}
              value={eyeColor}
              onChangeValue={(item) => {
                setEyeColor(item.value);
              }}
              containerStyle={{marginBottom: 10, width: width - 60}}
              placeholder={'Select One'}
            />

            <View
              style={{
                flexDirection: 'row',
                width: width - 60,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 28,
                  color: COLORS.GRAY_90,
                  fontWeight: '400',
                  maxWidth: width - 60,
                }}>
                {'Medical Record'}
              </Text>
            </View>

            <CustomTextInput
              placeholder="Enter Number"
              onChangeText={(value) => {
                setMedicalRecord(value);
              }}
              value={medicalRecord}
              inputStyle={{
                width: width - 60,
                borderWidth: 0,
                backgroundColor: 'transparent',
              }}
              containerStyle={{
                borderRadius: 5,
                backgroundColor: COLORS.WHITE,
                borderWidth: 1,
                borderColor: COLORS.GRAY_80,
                height: 55,
              }}
              keyboardType="numeric"
              onBlur={() => {}}
            />
          </ScrollView>
          <View
            style={{
              marginBottom: DeviceInfo.hasNotch() ? 60 : 40,
              height: 100,
              width: width - 60,
              alignItems: 'center',
            }}>
            <CustomButton
              onPress={handleSubmit}
              title="Confirm"
              textStyle={{
                color: validate() ? COLORS.GRAY_90 : COLORS.WHITE,
                textAlign: 'center',
              }}
              disabled={validate()}
              style={{
                width: width * 0.6,
                backgroundColor: validate()
                  ? COLORS.SECONDARY_LIGHTER
                  : COLORS.PRIMARY_MAIN,
                borderColor: COLORS.PRIMARY_MAIN,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}
            />
            <CustomTouchableOpacity
              style={{
                borderBottomColor: COLORS.PRIMARY_MAIN,
                borderBottomWidth: 1,
                alignItems: 'center',
                marginTop: 10,
              }}
              onPress={() => {
                if (onClose) {
                  onClose();
                }
                navigation.navigate(SCREEN_NAMES.PATIENT_LIST);
              }}>
              <Text
                style={[
                  styles.h3Label,
                  {
                    color: COLORS.PRIMARY_MAIN,
                    marginRight: 0,
                    fontWeight: '700',
                  },
                ]}>
                View Exisiting Patient Instead
              </Text>
            </CustomTouchableOpacity>
          </View>
        </View>
      </View>

      <ReactNativeModal
        isVisible={showDatePicker && Platform.OS === 'ios'}
        onDismiss={() => setShowDatePicker(false)}
        onBackdropPress={() => setShowDatePicker(false)}
        animationIn="zoomIn"
        animationOut="zoomOut">
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            borderRadius: 10,
            padding: 10,
          }}>
          <DateTimePicker
            themeVariant="dark"
            style={{width: '100%'}}
            value={selectedDate || new Date()}
            mode={'date'}
            maximumDate={new Date()}
            display="inline"
            onChange={(event, value) => {
              if (showDatePicker) {
                setSelectedDate(value);
              }
            }}
          />
        </View>
      </ReactNativeModal>

      {Boolean(showDatePicker && Platform.OS === 'android') && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode={'date'}
          maximumDate={new Date()}
          display="default"
          onChange={(event, value) => {
            if (showDatePicker) {
              setShowDatePicker(false);
              setSelectedDate(value);
            }
          }}
        />
      )}
    </ReactNativeModal>
  );
};

export default NewPatientPopUp;
