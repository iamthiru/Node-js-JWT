import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, Platform, ScrollView} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../constants/colors';
import CustomRadioButton from '../../components/shared/CustomRadioButton';
import CustomButton from '../../components/shared/CustomButton';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {formatAMPM} from '../../utils/date';
import {useNavigation} from '@react-navigation/native';
import {SCREEN_NAMES} from '../../constants/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {ASSESSMENT_TIME_DURATION_ACTION, CREATE_ASSESSMENT_ACTION} from '../../constants/actions';
import Analytics from '../../utils/Analytics';
let startTime = 0;
let endTime = 0;

const {width, height} = Dimensions.get('window');

const Reminder = ({gotoNext, gotoPrevious,assessmentStartTime}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [needReminder, setNeedReminder] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    startTime = new Date().getTime();
  }, []);

  const patientData = useSelector((state) => state.patientData.patient);
  const selectedAssessmentData = useSelector((state) => state.createAsseement);

  useEffect(() => {
    if (selectedAssessmentData?.isRemainder) {
      setNeedReminder(selectedAssessmentData?.isRemainder);
    }
    else{
      setNeedReminder(selectedAssessmentData?.isRemainder);
    }
    if (selectedAssessmentData.remainder_date) {
      setSelectedDate(selectedAssessmentData?.remainder_date);
    }
    if (selectedAssessmentData?.reminder_time) {
      setSelectedDate(selectedAssessmentData?.reminder_time);
    }
  }, [
    selectedAssessmentData?.isRemainder,
    selectedAssessmentData?.reminder_time,
    selectedAssessmentData?.remainder_date,
  ]);

  const handlePrevious = () => {
    gotoPrevious();
    endTime = new Date().getTime();
    /* Analytics.setCurrentScreen(
      SCREEN_NAMES.PAINASSESSMENT,
      (endTime - startTime) / 1000,
      startTime,
      endTime,
    ); */
  };

  const handleContinue = async() => {
    endTime = new Date().getTime();
    dispatch({
      type : ASSESSMENT_TIME_DURATION_ACTION.ASSESSMENT_TIME_DURATION,
      payload : {
        assessmentStartTime  : assessmentStartTime,
        assessmentEndTime : new Date().getTime()
      }
    })

    /* Analytics.setCurrentScreen(
      SCREEN_NAMES.PAINASSESSMENT,
      (endTime - startTime) / 1000,
      startTime,
      endTime,
    ); */
    if (needReminder) {
      dispatch({
        type: CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
        payload: {
          remainder_date: selectedDate,
          reminder_time: selectedTime,
          isRemainder: needReminder,
          // assessment_date: new Date().getTime(),
          // frequence: '1',
          // pain_frequency_id: '1',
          // total_score: '1',
        },
      });
    } else {
      dispatch({
        type: CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
        payload: {
          remainder_date: selectedDate,
          reminder_time: selectedTime,
          isRemainder: needReminder,
          // assessment_date: new Date().getTime(),
          // frequence: '1',
          // pain_frequency_id: '1',
          // total_score: '1',
        },
      });
    }
    navigation.navigate(SCREEN_NAMES.PUPILLARY_DILATION);
  };

  const hideDateTimePickers = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  return (
    <>
      <ScrollView>
        <View
          style={{
            width: width,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.PRIMARY_MAIN,
            backgroundColor: COLORS.WHITE,
            paddingHorizontal: 30,
            paddingVertical: 27,
            marginBottom: 30,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: width - 60,
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 22,
                color: COLORS.GRAY_90,
                fontWeight: '700',
                maxWidth: width - 60 - 15 - 15,
              }}>
              {'Would you like to set a reminder for the next assessment?'}
            </Text>
            {/* <CustomTouchableOpacity style={{marginLeft: 15}}>
              <AntDesignIcon
                name={'questioncircle'}
                size={15}
                color={COLORS.PRIMARY_MAIN}
              />
            </CustomTouchableOpacity> */}
          </View>

          <CustomRadioButton
            containerStyle={{marginBottom: 15}}
            label={'Yes'}
            selected={needReminder}
            onPress={() => setNeedReminder(true)}
          />
          <CustomRadioButton
            label={'No'}
            selected={!needReminder}
            onPress={() => setNeedReminder(false)}
          />
        </View>

        <View
          style={{
            width: width,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.PRIMARY_MAIN,
            backgroundColor: COLORS.WHITE,
            paddingHorizontal: 30,
            paddingVertical: 27,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: width - 60,
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 22,
                color: COLORS.GRAY_90,
                fontWeight: '700',
                width: width - 60 - 15 - 15,
              }}>
              {'Next Assessment'}
            </Text>
            {/* <CustomTouchableOpacity style={{marginLeft: 15}}>
              <AntDesignIcon
                name={'questioncircle'}
                size={15}
                color={COLORS.PRIMARY_MAIN}
              />
            </CustomTouchableOpacity> */}
          </View>

          <CustomTouchableOpacity
            onPressIn={() => {
              setShowDatePicker(true);
            }}
            style={{marginBottom: 10}}>
            <View
              style={{
                flexDirection: 'row',
                width: width / 2 - 30,
                height: 36,
                borderRadius: 5,
                backgroundColor: COLORS.WHITE,
                borderColor: COLORS.GRAY_80,
                borderWidth: 1,
                minWidth: 100,
                paddingVertical: 6,
                paddingLeft: 16,
                paddingRight: 7.5,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{fontSize: 16, lineHeight: 24, color: COLORS.GRAY_90}}>
                {selectedDate
                  ? `${
                      selectedDate.getMonth() + 1
                    }/${selectedDate.getDate()}/${selectedDate.getFullYear()}`
                  : ''}
              </Text>
              <AntDesignIcon
                name={'calendar'}
                size={15}
                color={COLORS.GRAY_90}
              />
            </View>
          </CustomTouchableOpacity>

          <CustomTouchableOpacity
            onPressIn={() => {
              setShowTimePicker(true);
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: width / 2 - 30,
                height: 36,
                borderRadius: 5,
                backgroundColor: COLORS.WHITE,
                borderColor: COLORS.GRAY_80,
                borderWidth: 1,
                minWidth: 100,
                paddingVertical: 6,
                paddingLeft: 16,
                paddingRight: 7.5,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{fontSize: 16, lineHeight: 24, color: COLORS.GRAY_90}}>
                {selectedTime ? `${formatAMPM(selectedTime)}` : ''}
              </Text>
              <AntDesignIcon
                name={'caretdown'}
                size={15}
                color={COLORS.GRAY_90}
              />
            </View>
          </CustomTouchableOpacity>
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          width: width,
          paddingHorizontal: 13,
          marginBottom: 15 + (Platform.OS === 'ios' ? getStatusBarHeight() : 0),
          marginTop: 10,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
        <CustomButton
          onPress={() => handlePrevious()}
          title="Previous"
          textStyle={{color: COLORS.GRAY_90}}
          type="secondary"
          style={{
            width: (width - 16 - 16 - 75) / 2,
            backgroundColor: COLORS.WHITE,
          }}
          iconLeft={
            <AntDesignIcon
              name={'arrowleft'}
              size={16}
              color={COLORS.GRAY_90}
            />
          }
        />
        <CustomButton
          onPress={() => handleContinue()}
          title="Continue"
          textStyle={{color: COLORS.GRAY_90}}
          style={{
            width: (width - 16 - 16 - 75) / 2,
            backgroundColor: COLORS.SECONDARY_MAIN,
            borderColor: COLORS.PRIMARY_MAIN,
            borderWidth: 1,
          }}
          iconRight={
            <AntDesignIcon
              name={'arrowright'}
              size={16}
              color={COLORS.GRAY_90}
            />
          }
        />
      </View>

      {Platform.OS === 'ios' && (showDatePicker || showTimePicker) && (
        <Modal
          isVisible={showDatePicker || showTimePicker}
          onDismiss={() => hideDateTimePickers()}
          onBackdropPress={() => hideDateTimePickers()}>
          <View style={{
            alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 10,}}>
            <DateTimePicker
              style={{width: '100%', backgroundColor: 'white'}}
              value={showDatePicker ? selectedDate : selectedTime}
              mode={showDatePicker ? 'date' : 'time'}
              display="inline"
              onChange={(event, value) => {
                if (showDatePicker) {
                  setSelectedDate(value);
                } else {
                  setSelectedTime(value);
                }
              }}
            />
          </View>
        </Modal>
      )}

      {Platform.OS === 'android' && (showDatePicker || showTimePicker) && (
        <DateTimePicker
          value={showDatePicker ? selectedDate : selectedTime}
          mode={showDatePicker ? 'date' : 'time'}
          display="default"
          onChange={(event, value) => {
            if (showDatePicker) {
              setShowDatePicker(false);
              if (value) {
                setSelectedDate(value);
              }
            } else {
              setShowTimePicker(false);
              if (value) {
                setSelectedTime(value);
              }
            }
          }}
        />
      )}
    </>
  );
};

export default Reminder;
