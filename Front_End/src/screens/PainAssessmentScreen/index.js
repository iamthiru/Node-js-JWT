import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import GeneralStatusBar from '../../components/shared/GeneralStatusBar';
import ProgressBar from '../../components/shared/ProgressBar';
import {COLORS} from '../../constants/colors';
import {SCREEN_NAMES} from '../../constants/navigation';
import PainQuality from './PainQuality';
import VerbalAbility from './VerbalAbility';
import PainLocation from './PainLocation';
import NRSScore from './NRSScore';
import styles from './styles';
import PainTiming from './PainTiming';
import {PAIN_FREQUENCY, VERBAL_ABILITY} from '../../constants/painAssessment';
import PainCausingActivity from './PainCausingActivity';
import Note from './Note';
import Reminder from './Reminder';
import Result from './Result';
import {useDispatch, useSelector} from 'react-redux';
import {
  CREATE_ASSESSMENT_ACTION,
  PAIN_LOCATIONS_ACTION,
} from '../../constants/actions';
import Analytics from '../../utils/Analytics';

const {width, height} = Dimensions.get('window');

const totalSteps = 8;

const PainAssessmentScreen = ({navigation}) => {
  const selectedAssessmentData = useSelector((state) => state.createAsseement);

  const [currentStep, setCurrentStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [verbalAbility, setVerbalAbility] = useState(
    VERBAL_ABILITY.VERBAL.value,
  );
  const [assessmentStartTime , setAssessmentStartTime ] = useState(0)

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
  }, [navigation]);

  const dispatch = useDispatch();

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  const gotoNext = () => {
    if (currentStep === totalSteps) {
      setShowResult(true);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const gotoPrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleBackPress = () => {
    if (showResult) {
      setShowResult(false);
    }
    closeScreen();
    dispatch({
      type: PAIN_LOCATIONS_ACTION.PAIN_LOCATION,
      payload: [],
    });
    dispatch({
      type: CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
      payload: {
        type: VERBAL_ABILITY.VERBAL.value,
        patient_id: 0,
        patient_name: '',
        current_pain: 0,
        most_pain: 0,
        least_pain: 0,
        painImpactId: 0,
        painImapctName: '',
        painLocation_id: 0,
        pain_activity_id: 0,
        pain_activity_name: '',
        painFrequency: [],
        painDate: null,
        painTime: null,
        remainder_date: null,
        reminder_time: null,
        isRemainder: false,
        assessment_date: null,
        pain_qualities: [],
        pain_impact_activiy: [],
        pupilary_result_data:[],
        // frequence: 0,
        // pain_frequency_id: 0,
        frequencyData: null,
        total_score: 0,
        notes: '',
        otherText: '',
      },
    });
  };

  const closeScreen = () => {
    navigation.goBack();
    // handleBackPress()
  };

  const getHeading = () => {
    switch (currentStep) {
      case 1:
        return 'Verbal or Not';
      case 2:
        return 'NRS Score';
      case 3:
        return 'Location';
      case 4:
        return 'Pain Quality';
      case 5:
        return 'Time';
      case 6:
        return 'Activity';
      case 7:
        return 'Note';
      case 8:
        return 'Reminder';
      default:
        return '-';
    }
  };

  return (
    <View style={styles.body}>
      <GeneralStatusBar
        backgroundColor={COLORS.PRIMARY_MAIN}
        barStyle="light-content"
      />
      <View
        style={{
          width: width,
          paddingTop: 12,
          paddingBottom: showResult ? 7 : 12,
          backgroundColor: COLORS.PRIMARY_MAIN,
          borderBottomWidth: 2,
          borderBottomColor: COLORS.SECONDARY_DARKER,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: showResult ? 0 : 12,
            width: width,
            paddingHorizontal: 16,
          }}>
          {/* <CustomTouchableOpacity onPress={handleBackPress}>
            <AntDesignIcon name={'arrowleft'} color={COLORS.WHITE} size={22} />
          </CustomTouchableOpacity> */}
          <View></View>
          <Text
            style={{
              fontSize: 20,
              lineHeight: 28,
              textAlign: 'center',
              color: COLORS.WHITE,
            }}>
            {showResult ? 'Pain Assessment' : getHeading()}
          </Text>
          {!showResult && (
            <CustomTouchableOpacity
              onPress={() => {
                closeScreen();
                handleBackPress();
              }}>
              <AntDesignIcon name={'close'} color={COLORS.WHITE} size={22} />
            </CustomTouchableOpacity>
          )}
          {showResult && <View style={{width: 22, height: 22}} />}
        </View>
        {!showResult && (
          <>
            <View
              style={{
                width: width - 32,
                height: 10,
                marginBottom: 6,
                marginHorizontal: 16,
              }}>
              <ProgressBar
                currentStep={currentStep}
                totalSteps={totalSteps}
                width={width - 32}
                containerStyle={{width: width - 32}}
                indicatorStyle={{width: width - 32}}
              />
            </View>
            <Text
              style={{
                marginLeft: 25,
                fontSize: 12,
                lineHeight: 16,
                fontWeight: '700',
                color: COLORS.WHITE,
              }}>{`Step ${currentStep} of ${totalSteps}`}</Text>
          </>
        )}
      </View>

      {showResult && (
        <>
          <Result />
        </>
      )}

      {!showResult && (
        <>
          <Text
            style={{
              width: width,
              textAlign: 'left',
              paddingLeft: 30,
              fontSize: 12,
              lineHeight: 16,
              color: COLORS.GRAY_80,
              marginTop: 16,
              marginTop: 11,
              marginBottom: 6,
            }}>
            {'Answer from last assessment is preselected'}
          </Text>
          {currentStep === 1 && (
            <VerbalAbility
              gotoNext={gotoNext}
              verbalAbility={verbalAbility}
              setVerbalAbility={setVerbalAbility}
              assessmentStartTime = {assessmentStartTime}
              setAssessmentStartTime = {setAssessmentStartTime}
            />
          )}
          {currentStep === 2 && (
            <NRSScore
              gotoNext={gotoNext}
              gotoPrevious={gotoPrevious}
              verbalAbility={verbalAbility}
            />
          )}
          {currentStep === 3 && (
            <PainLocation gotoNext={gotoNext} gotoPrevious={gotoPrevious} />
          )}
          {currentStep === 4 && (
            <PainQuality gotoNext={gotoNext} gotoPrevious={gotoPrevious} />
          )}
          {currentStep === 5 && (
            <PainTiming gotoNext={gotoNext} gotoPrevious={gotoPrevious} />
          )}
          {currentStep === 6 && (
            <PainCausingActivity
              gotoNext={gotoNext}
              gotoPrevious={gotoPrevious}
            />
          )}
          {currentStep === 7 && (
            <Note gotoNext={gotoNext} gotoPrevious={gotoPrevious} />
          )}
          {currentStep === 8 && (
            <Reminder 
            gotoNext={gotoNext} 
            gotoPrevious={gotoPrevious} 
            assessmentStartTime = {assessmentStartTime}
            />
          )}
        </>
      )}
    </View>
  );
};

export default PainAssessmentScreen;
