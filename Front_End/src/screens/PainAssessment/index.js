import React, {useEffect, useState} from 'react';
import {View, Text, useWindowDimensions, SafeAreaView} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import CustomButton from '../../components/shared/CustomButton';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../constants/colors';
import styles from './styles';
import {useNavigation, useRoute} from '@react-navigation/native';
import CustomDropDown from '../../components/shared/CustomDropDown';
import CustomTextInput from '../../components/shared/CustomTextInput';
import {SCREEN_NAMES} from '../../constants/navigation';

const dropDownData = [
  {
    key: '6:00 pm',
    label: '6:00 pm',
    value: '6:00 pm',
  },
  {
    key: '5:00 pm',
    label: '5:00 pm',
    value: '5:00 pm',
  },
  {
    key: '7:00 pm',
    label: '7:00 pm',
    value: '7:00 pm',
  },
];

const PainAssessment = ({route}) => {
  const name = useRoute()?.params?.name;

  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [patient, setPatient] = useState('');
  const [time, setTime] = useState('6:00 pm');

  useEffect(() => {
    if (name) {
      setPatient(name);
    }
  }, [name]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainView}>
        <View style={styles.headerStyle}>
          <AntDesignIcon
            name={'arrowleft'}
            onPress={() => {
              navigation.goBack();
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
              <CustomButton
                onPress={() => {
                  navigation.navigate(SCREEN_NAMES.ASSIGN_PATIENT);
                }}
                title="Add Patient"
                textStyle={styles.buttonTextStyle}
                style={styles.addPatientButton}
              />
            ) : (
              <View style={styles.inputView}>
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
            <AntDesignIcon name={'calendar'} size={15} color={COLORS.GRAY_90} />
          </CustomTouchableOpacity>
        </View>

        <View style={styles.dropView}>
          <Text style={styles.patientText}>Assessment Time</Text>
          <CustomDropDown
            TextStylle={styles.dropDownTextStyle}
            caretdown="caretdown"
            arrow={false}
            items={dropDownData}
            labelStyle={styles.dropDownLabel}
            value={time}
            arrowSize={14}
            onChangeValue={(item) => setTime(item.value)}
            containerStyle={styles.dropDownContainer}
          />
        </View>
        <View style={styles.labelsView}>
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
        <View style={styles.buttonView}>
          <CustomButton
            onPress={() => {
              navigation.navigate(SCREEN_NAMES.PAIN_ASSESSMENT);
            }}
            title="Start"
            textStyle={styles.buttonTextStyle}
            style={styles.startButton}
          />
        </View>
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
      </View>
    </SafeAreaView>
  );
};
export default PainAssessment;