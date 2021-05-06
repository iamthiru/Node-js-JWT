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
import {PAIN_ASSESSMENT_DATA_ACTION} from '../../constants/actions';

const PainAssessment = ({route}) => {
  const assessment_data = useSelector(
    (state) => state.painAssessmentData.patient_name,
  );
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

  useEffect(() => {
    if (time) {
      timeFormat(time);
    }
  }, [time]);

  useEffect(() => {
    if (assessment_data) {
      setPatient(assessment_data);
    }
  }, [assessment_data]);

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
            paddingTop: Boolean(Platform.OS === 'ios') ? 0 : 50,
          },
        ]}>
        <View style={styles.headerStyle}>
          <AntDesignIcon
            name={'arrowleft'}
            onPress={() => {
              navigation.goBack();
              dispatch({
                type:PAIN_ASSESSMENT_DATA_ACTION.PAIN_ASSESSMENT_DATA,
                payload:''
              })
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
                  style={{
                    width: width * 0.4,
                    backgroundColor: COLORS.SECONDARY_MAIN,
                    borderColor: COLORS.PRIMARY_MAIN,
                    borderWidth: 1.8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 30,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    navigation.navigate(SCREEN_NAMES.ASSIGN_PATIENT);
                  }}>
                  <Text
                    style={{
                      color: COLORS.GRAY_90,
                      textAlign: 'center',
                      paddingHorizontal: 5,
                    }}>
                    Add Patient
                  </Text>
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
              style={styles.startButton}
            />
          </View>
        ) : (
          <View
            style={{
              width: width,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 50,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.SECONDARY_MAIN,
                width: width * 0.6,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: COLORS.PRIMARY_MAIN,
                borderWidth: 2,
                borderRadius: 5,
              }}
              disabled={Boolean(patient === '')}
              onPress={() => {
                navigation.navigate(SCREEN_NAMES.PAIN_ASSESSMENT);
              }}>
              <Text
                style={{
                  color: COLORS.GRAY_90,
                  fontWeight: '600',
                }}>
                START
              </Text>
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
              }
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
export default PainAssessment;
