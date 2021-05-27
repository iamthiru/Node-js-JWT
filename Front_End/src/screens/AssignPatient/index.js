import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Platform,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../constants/colors';
import DeviceInfo from 'react-native-device-info';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import CustomTextInput from '../../components/shared/CustomTextInput';
import CustomButton from '../../components/shared/CustomButton';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomDropDown from '../../components/shared/CustomDropDown';
import AllPatientList from '../../components/SectionListPatient';
import assignPatientStyles from './styles';
import {sortByListOptions} from '../../constants/AssignPatientConstants';
import NewPatientPopUp from '../HomeScreen/NewPatientPopUp';
import PatientDetailModal from '../../components/PatientDetailsModal';
import {useSelector} from 'react-redux';
import Analytics from '../../utils/Analytics';

const AssignPatient = () => {
  const {width, height} = useWindowDimensions();
  const [searchString, setSearchString] = useState('');
  const [sortBy, setSortedBy] = useState('last_name');
  const navigation = useNavigation();
  const styles = assignPatientStyles({width, height, COLORS, Platform});
  const [openNewPatient, setOpenNewPatient] = useState(false);
  const [showPatient, setShowPatient] = useState(false);
  const [patientData, setPatientData] = useState({});
  const painAssessment = true;

  useEffect(() => {
    let startTime = 0;
    let endTime = 0;
    const unsubscribeFocus = navigation.addListener('focus', () => {
      startTime = new Date().getTime();
    });

    const unsubscribeBlur = navigation.addListener('blur', (e) => {
      endTime = new Date().getTime();
      let screenName =
        e && e.target && e.target.substring(0, e.target.indexOf('-'));
      Analytics.setCurrentScreen(
        screenName,
        (endTime - startTime) / 1000,
        startTime,
        endTime,
      );
    });

    const unsubscribeBeforeRemove = navigation.addListener(
      'beforeRemove',
      (e) => {
        endTime = new Date().getTime();
        let screenName =
          e && e.target && e.target.substring(0, e.target.indexOf('-'));
        Analytics.setCurrentScreen(
          screenName,
          (endTime - startTime) / 1000,
          startTime,
          endTime,
        );
      },
    );

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      unsubscribeBeforeRemove();
    };
  }, [navigation]);
  return (
    <View
      style={[
        styles.assignPatientMainView,
        {
          // paddingTop:Boolean(Platform.OS === 'ios') ?0:Boolean(openNewPatient)?70:50
          paddingTop: Boolean(Platform.OS === 'ios')
            ? height <= 736
              ? 20
              : 0
            : Boolean(openNewPatient)
            ? 70
            : 50,
        },
      ]}>
      {Platform.OS === 'android' && (
        <StatusBar
          backgroundColor={'transparent'}
          barStyle="dark-content"
          translucent
        />
      )}
      <View
        style={[
          ,
          styles.assignPatientContainerView,
          {
            marginTop: Platform.OS === 'android' ? -20 : 0,
            paddingTop: DeviceInfo.hasNotch() ? 45 : 20,
          },
        ]}>
        <View style={styles.assignPatientSecondView}>
          <View style={styles.assignPatientBackButtonView}>
            <CustomTouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesignIcon
                name={'arrowleft'}
                size={30}
                color={COLORS.GRAY_90}
              />
            </CustomTouchableOpacity>
          </View>
          <Text style={styles.assignPatientMainText}>Assign Patient</Text>
        </View>
      </View>
      <CustomTextInput
        placeholder="Search Name"
        inputStyle={styles.inputStyles}
        value={searchString}
        onChangeText={(text) => setSearchString(text)}
      />
      <View style={styles.assignPatientButton}>
        <CustomButton
          onPress={() => {
            setOpenNewPatient(true);
          }}
          title="New Patient"
          textStyle={{
            color: COLORS.WHITE,
            textAlign: 'center',
            paddingRight: 50,
          }}
          iconLeft={
            <FontAwesome5 name={'user-plus'} size={20} color={COLORS.WHITE} />
          }
          style={styles.assignButtonStyles}
        />
      </View>
      <View style={styles.assignDropDownView}>
        <CustomDropDown
          TextStylle={styles.dropDownTextStyles}
          caretdown="caretdown"
          labelText="Sort By :"
          arrow={true}
          arrowSize={20}
          items={sortByListOptions}
          labelStyle={styles.dropDownLabelStyle}
          value={sortBy}
          placeholderStyle={styles.dropDownPlaceHolder}
          onChangeValue={(item) => setSortedBy(item.value)}
          containerStyle={styles.dropDownContainerStyle}
        />
      </View>
      <AllPatientList
        sortBy={sortBy}
        searchString={searchString}
        setShowPatient={setShowPatient}
        setPatientData={setPatientData}
        painAssessment
      />
      <NewPatientPopUp
        open={openNewPatient}
        goToAssessment = {true}
        onClose={() => {
          setOpenNewPatient(false);
        }}
      />
      <PatientDetailModal
        open={showPatient}
        onClose={() => {
          setShowPatient(false);
        }}
        patientData={patientData}
      />
    </View>
  );
};
export default AssignPatient;
