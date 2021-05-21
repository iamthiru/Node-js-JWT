import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import CustomButton from '../../components/shared/CustomButton';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../constants/colors';
import styles from './styles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import CustomTextInput from '../../components/shared/CustomTextInput';
import {SCREEN_NAMES} from '../../constants/navigation';
import {PATIENT_NAME_ACTION} from '../../constants/actions';

const PainAssessment = ({route}) => {
  const patientData = useSelector((state) => state.patientName.patient);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerAndroid, setShowDatePickerAndroid] = useState(false);
  const [showTimerAndroid, setTimerAndroid] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [patient, setPatient] = useState('');
  const [time, setTime] = useState(null);
  const [showTimer, setShowTimer] = useState(false);
  const [AmOrPm, setAmOrPm] = useState('');
  const [formattedTime, setFormattedTime] = useState({
    hours: 0,
    minutes: 0,
  });
  const [assementDate, setAssessmentDate] = useState({});
  const selectedAssessmentData = useSelector((state) => state.createAsseement);

  useEffect(() => {
    if (time) {
      timeFormat(time);
    }
  }, [time]);

  useEffect(() => {
    if (patientData) {
      setPatient(patientData.patient_name);
    }
  }, [patientData]);

  const timeFormat = (time) => {
    let getHours = time.getHours();
    let getMinutes = time.getMinutes();
    let amORpm = getHours > 12 ? 'PM' : 'AM';
    setAmOrPm(amORpm);
    let hoursFormat = getHours % 12;
    setFormattedTime({
      hours: Boolean(hoursFormat === 0) ? 12 : hoursFormat,
      minutes: Boolean(getMinutes < 10) ? '0' + getMinutes : getMinutes,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.mainView,
          {
            paddingTop: Boolean(Platform.OS === 'ios')
              ? height <= 736
                ? 20
                : 0
              : 50,
          },
        ]}>
        <View style={styles.headerStyle}>
          <AntDesignIcon
            name={'arrowleft'}
            onPress={() => {
              navigation.goBack();
              dispatch({
                type: PATIENT_NAME_ACTION.PATIENT,
                payload: null,
              });
            }}
            color={COLORS.GRAY_90}
            style={styles.arrowLeft}
          />
          <Text style={styles.heading}>Pain Assessment</Text>
        </View>
        <View style={styles.secondMainView}>
          <Text style={styles.patientText}>Patient: </Text>
          <View>
            {patient === '' ? (
              Boolean(Platform.OS === 'ios') ? (
                <CustomButton
                  onPress={() => {
                    navigation.navigate(SCREEN_NAMES.ASSIGN_PATIENT);
                  }}
                  title="Add Patient"
                  textStyle={styles.buttonTextStyle}
                  style={styles.addPatientButton}
                />
              ) : (
                <TouchableOpacity
                  style={styles.addPatientTouch}
                  onPress={() => {
                    navigation.navigate(SCREEN_NAMES.ASSIGN_PATIENT);
                  }}>
                  <Text style={styles.addPatientText}>Add Patient</Text>
                </TouchableOpacity>
              )
            ) : (
              <View style={[styles.inputView]}>
                <CustomTextInput
                  onChangeText={(value) => {
                    setPatient(value);
                  }}
                  value={patient}
                  inputStyle={styles.input}
                  containerStyle={styles.container}
                  onBlur={() => {}}
                />
                <AntDesignIcon
                  name={'arrowright'}
                  color={COLORS.GRAY_90}
                  style={styles.arrow}
                />
              </View>
            )}
          </View>
        </View>
        <View style={styles.date}>
          <Text style={styles.patientText}>Assessment Date:</Text>
          {Boolean(Platform.OS === 'ios') ? (
            <CustomTouchableOpacity
              onPress={() => {
                setShowDatePicker(true);
              }}
              style={styles.dataTextInput}>
              <Text style={styles.dateLabel}>
                {selectedDate
                  ? `${
                      selectedDate.getMonth() + 1
                    }/${selectedDate.getDate()}/${selectedDate.getFullYear()}`
                  : '9/07/2020'}
              </Text>
              <AntDesignIcon
                name={'calendar'}
                size={15}
                color={COLORS.GRAY_90}
              />
            </CustomTouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setShowDatePickerAndroid(true);
              }}
              style={styles.dataTextInput}>
              <Text style={styles.dateLabel}>
                {selectedDate
                  ? `${
                      selectedDate.getMonth() + 1
                    }/${selectedDate.getDate()}/${selectedDate.getFullYear()}`
                  : '9/07/2020'}
              </Text>
              <AntDesignIcon
                name={'calendar'}
                size={15}
                color={COLORS.GRAY_90}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.dropView}>
          <Text style={styles.patientText}>Assessment Time</Text>
          <View style={styles.time}>
            {Boolean(Platform.OS === 'ios') ? (
              <CustomTouchableOpacity
                onPress={() => {
                  setShowTimer(true);
                }}
                style={styles.dataTextInput}>
                <Text style={styles.dateLabel}>
                  {time
                    ? `${formattedTime.hours} : ${formattedTime.minutes}  ${AmOrPm}`
                    : '6:00 PM'}
                </Text>
                <AntDesignIcon
                  name={'caretdown'}
                  size={15}
                  color={COLORS.GRAY_90}
                />
              </CustomTouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setTimerAndroid(true);
                }}
                style={styles.dataTextInput}>
                <Text style={styles.dateLabel}>
                  {time
                    ? `${formattedTime.hours} : ${formattedTime.minutes}  ${AmOrPm}`
                    : '6:00 PM'}
                </Text>
                <AntDesignIcon
                  name={'caretdown'}
                  size={15}
                  color={COLORS.GRAY_90}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={[
            styles.labelsView,
            {
              width: Boolean(Platform.OS === 'ios') ? width * 0.8 : width * 0.9,
            },
          ]}>
          <Text style={styles.labelStyle}>
            1. Confirm the assment date and time.
          </Text>
          <Text style={styles.labelStyle}>
            2. The assessment has 10 steps and will{' '}
          </Text>
          <Text style={styles.subLabel}>take approximately 5-10 minutes.</Text>
          <Text style={styles.labelStyle}>
            3. Please complete it in one setting.
          </Text>
        </View>
        {Boolean(Platform.OS === 'ios') ? (
          <View style={styles.buttonView}>
            <CustomButton
              disabled={Boolean(patient === '')}
              onPress={() => {
                navigation.navigate(SCREEN_NAMES.PAIN_ASSESSMENT);
              }}
              title="Start"
              textStyle={styles.buttonTextStyle}
              style={[
                styles.startButton,
                {
                  backgroundColor: Boolean(patient === '')
                    ? COLORS.SECONDARY_LIGHTER
                    : COLORS.SECONDARY_MAIN,
                },
              ]}
            />
          </View>
        ) : (
          <View style={styles.satrtButtonView}>
            <TouchableOpacity
              style={styles.startButtonTouch}
              disabled={Boolean(patient === '')}
              onPress={() => {
                navigation.navigate(SCREEN_NAMES.PAIN_ASSESSMENT, assementDate);
              }}>
              <Text style={styles.startText}>START</Text>
            </TouchableOpacity>
          </View>
        )}
        <ReactNativeModal
          isVisible={showDatePicker && Platform.OS === 'ios'}
          onDismiss={() => setShowDatePicker(false)}
          onBackdropPress={() => setShowDatePicker(false)}
          animationIn="zoomIn"
          animationOut="zoomOut">
          <View style={styles.datePickerView}>
            <DateTimePicker
              style={{width: '100%'}}
              value={selectedDate || new Date()}
              mode={'date'}
              maximumDate={new Date()}
              display="inline"
              onChange={(event, value) => {
                if (showDatePicker) {
                  setSelectedDate(value);
                  setAssessmentDate({
                    ...assementDate,
                    date: selectedDate,
                  });
                }
              }}
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal
          isVisible={showTimer && Platform.OS === 'ios'}
          onDismiss={() => setShowTimer(false)}
          onBackdropPress={() => setShowTimer(false)}
          animationIn="zoomIn"
          animationOut="zoomOut">
          <View style={styles.datePickerView}>
            <DateTimePicker
              style={{width: '100%'}}
              value={time || new Date()}
              mode={'time'}
              maximumDate={new Date()}
              display="spinner"
              onChange={(event, value) => {
                if (showTimer) {
                  setTime(value);
                  setAssessmentDate({
                    ...assementDate,
                    time: time,
                  });
                }
              }}
            />
          </View>
        </ReactNativeModal>
        {Boolean(showDatePickerAndroid && Platform.OS === 'android') && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode={'date'}
            maximumDate={new Date()}
            display="default"
            onChange={(event, value) => {
              if (showDatePickerAndroid) {
                setShowDatePickerAndroid(false);
                setSelectedDate(value);
                setAssessmentDate({
                  ...assementDate,
                  date: selectedDate,
                });
              }
            }}
          />
        )}
        {Boolean(showTimerAndroid && Platform.OS === 'android') && (
          <DateTimePicker
            value={time || new Date()}
            mode={'time'}
            maximumDate={new Date()}
            display="spinner"
            onChange={(event, value) => {
              if (showTimerAndroid) {
                setTimerAndroid(false);
                setTime(value);
                setAssessmentDate({
                  ...assementDate,
                  time: time,
                });
              }
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
export default PainAssessment;
