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
import {PAIN_FREQUENCY} from '../../constants/painAssessment';
import {formatAMPM} from '../../utils/date';
import {useDispatch, useSelector} from 'react-redux';
import {CREATE_ASSESSMENT_ACTION} from '../../constants/actions';
import Analytics from '../../utils/Analytics';
import {SCREEN_NAMES} from '../../constants/navigation';

const {width, height} = Dimensions.get('window');

var startTime;
var endTime;

const PainTiming = ({gotoNext, gotoPrevious}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [painFrequency, setPainFrequency] = useState(PAIN_FREQUENCY[0].value);
  const dispatch = useDispatch();

  const painTimingData = useSelector(
    (state) => state.painAssessmentData?.painFrequency_data,
  );

  const selectedAssessmentData = useSelector((state) => state.createAsseement);

  useEffect(() => {
    if (selectedAssessmentData?.description) {
      setPainFrequency(selectedAssessmentData?.description);
    }
    if (selectedAssessmentData?.painDate) {
      setSelectedDate(selectedAssessmentData?.painDate);
    }
    if (selectedAssessmentData?.painTime) {
      setSelectedTime(selectedAssessmentData?.painTime);
    }
  }, [
    selectedAssessmentData?.painDate,
    selectedAssessmentData?.painTime,
    selectedAssessmentData?.description,
  ]);

  useEffect(() => {
    if (painTimingData) {
      setPainFrequency(painTimingData.painFrequency);
      setSelectedDate(painTimingData.selectedDate);
      setSelectedTime(painTimingData.selectedTime);
    }
  }, [painTimingData]);

  const handlePrevious = () => {
    gotoPrevious();
    endTime = new Date().getTime();
    Analytics.setCurrentScreen(
      SCREEN_NAMES.PAINASSESSMENT,
      (endTime - startTime) / 1000,
      startTime,
      endTime,
    );
  };

  const handleContinue = () => {
    endTime = new Date().getTime();
    Analytics.setCurrentScreen(
      SCREEN_NAMES.PAINASSESSMENT,
      (endTime - startTime) / 1000,
      startTime,
      endTime,
    );
    dispatch({
      type: CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
      payload: {
        description: painFrequency,
        painDate: selectedDate,
        painTime: selectedTime,
      },
    });
    gotoNext();
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
            paddingTop: 27,
            paddingBottom: 67,
            marginBottom: 38,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: width - 60,
              alignItems: 'center',
              marginBottom: 15,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 22,
                color: COLORS.GRAY_90,
                fontWeight: '700',
                maxWidth: width - 60 - 15 - 15,
              }}>
              {'When did the pain start?'}
            </Text>
            <CustomTouchableOpacity style={{marginLeft: 15}}>
              <AntDesignIcon
                name={'questioncircle'}
                size={15}
                color={COLORS.PRIMARY_MAIN}
              />
            </CustomTouchableOpacity>
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

        <View
          style={{
            width: width,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.PRIMARY_MAIN,
            backgroundColor: COLORS.WHITE,
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: width - 60,
              alignItems: 'center',
              marginBottom: 15,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 22,
                color: COLORS.GRAY_90,
                fontWeight: '700',
                maxWidth: width - 60,
              }}>
              {'Choose a description'}
            </Text>
          </View>
          {PAIN_FREQUENCY.map((item) => {
            return (
              <CustomRadioButton
                key={item.value}
                containerStyle={{marginBottom: 15}}
                label={item.label}
                selected={painFrequency === item.value}
                onPress={() => setPainFrequency(item.value)}
              />
            );
          })}
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
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <DateTimePicker
              style={{width: '100%', backgroundColor: 'white'}}
              value={showDatePicker ? selectedDate : selectedTime}
              mode={showDatePicker ? 'date' : 'time'}
              display="default"
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

export default PainTiming;
