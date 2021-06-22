import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, Platform, ScrollView} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../constants/colors';
import CustomRadioButton from '../../components/shared/CustomRadioButton';
import CustomButton from '../../components/shared/CustomButton';
import CustomTextInput from '../../components/shared/CustomTextInput';
import {VERBAL_ABILITY} from '../../constants/painAssessment';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';
import {CREATE_ASSESSMENT_ACTION} from '../../constants/actions';
import {useNavigation} from '@react-navigation/native';
import Analytics from '../../utils/Analytics';
import {SCREEN_NAMES} from '../../constants/navigation';

const {width, height} = Dimensions.get('window');

let startTime = 0;
let endTime = 0;

const VerbalAbility = ({gotoNext, verbalAbility, setVerbalAbility}) => {
  const patientData = useSelector((state) => state.patientData.patient);
  const selectedAssessmentData = useSelector((state) => state.createAsseement);
  const navigation = useNavigation();

  useEffect(() => {
    startTime = new Date().getTime();
  }, []);

  useEffect(() => {
    if (selectedAssessmentData && selectedAssessmentData?.type) {
      setVerbalAbility(selectedAssessmentData?.type);
    }
  }, [selectedAssessmentData?.type]);

  const [otherText, setOtherText] = useState('');
  const dispatch = useDispatch();

  const handleContinue = () => {
    endTime = new Date().getTime();
    /* Analytics.setCurrentScreen(
      SCREEN_NAMES.PAINASSESSMENT,
      (endTime-startTime)/1000,
      startTime,
      endTime
    ) */
    gotoNext();
    if (verbalAbility) {
      dispatch({
        type: CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
        payload: {
          type: verbalAbility,
          patient_id: patientData?.patient_id,
          patient_name: patientData?.patient_name,
        },
      });
    }
  };
  const handleNavigation = () => {
    navigation.navigate(SCREEN_NAMES.PUPILLARY_DILATION);
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
            paddingVertical: 20,
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
              {'Is this patient currently verbal or not ?'}
            </Text>
            <CustomTouchableOpacity style={{marginLeft: 15}}>
              <AntDesignIcon
                name={'questioncircle'}
                size={15}
                color={COLORS.PRIMARY_MAIN}
              />
            </CustomTouchableOpacity>
          </View>
          <CustomRadioButton
            containerStyle={{marginBottom: 15}}
            label={VERBAL_ABILITY.VERBAL.label}
            selected={verbalAbility === VERBAL_ABILITY.VERBAL.value}
            onPress={() => setVerbalAbility(VERBAL_ABILITY.VERBAL.value)}
          />
          <CustomRadioButton
            containerStyle={{marginBottom: 15}}
            label={VERBAL_ABILITY.NON_VERBAL.label}
            selected={verbalAbility === VERBAL_ABILITY.NON_VERBAL.value}
            onPress={() => setVerbalAbility(VERBAL_ABILITY.NON_VERBAL.value)}
          />
          <View style={{flexDirection: 'row', width: width - 60}}>
            <CustomRadioButton
              label={VERBAL_ABILITY.OTHER.label}
              selected={verbalAbility === VERBAL_ABILITY.OTHER.value}
              onPress={() => setVerbalAbility(VERBAL_ABILITY.OTHER.value)}
            />
            <CustomTextInput
              value={otherText}
              onChangeText={(value) => setOtherText(value)}
              containerStyle={{paddingBottom: 0, marginLeft: 8}}
              inputStyle={{
                height: 24,
                borderRadius: 0,
                borderWidth: 0,
                borderBottomWidth: 1,
                paddingLeft: 0,
              }}
            />
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <CustomButton
            onPress={() => handleNavigation()}
            title="Skip Assessment"
            textStyle={{
              color: COLORS.GRAY_90,
              textAlign: 'center',
              paddingHorizontal: 5,
            }}
            style={{
              width: (width - 16 - 16) / 2,
              borderColor: COLORS.PRIMARY_DARKER,
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: 48,
              borderRadius: 10,
              backgroundColor: COLORS.SECONDARY_MAIN,
            }}
          />
        </View>
      </ScrollView>
      <View
        style={{
          width: width,
          paddingHorizontal: 13,
          marginBottom: 15 + (Platform.OS === 'ios' ? getStatusBarHeight() : 0),
          marginTop: 10,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>
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
    </>
  );
};

export default VerbalAbility;
