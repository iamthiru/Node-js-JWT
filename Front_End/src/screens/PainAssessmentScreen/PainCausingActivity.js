import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, ScrollView, Platform} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../constants/colors';
import CustomButton from '../../components/shared/CustomButton';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import CustomCheckBox from '../../components/shared/CustomCheckBox';
import {useDispatch, useSelector} from 'react-redux';
import {CREATE_ASSESSMENT_ACTION} from '../../constants/actions';
import Analytics from '../../utils/Analytics';
import { SCREEN_NAMES } from '../../constants/navigation';

const {width, height} = Dimensions.get('window');
let startTime = 0;
let endTime = 0;

const PainCausingActivity = ({gotoNext, gotoPrevious}) => {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const dispatch = useDispatch();
  const painCausingActivity = useSelector(
    (state) => state.painAssessmentData.selectedActivities
  );
  const pain_impact_activities = useSelector((state) => state.createAsseement?.pain_impact_activiy);
  const pain_activity = useSelector((state) => state.lookupData.lookup_data);

  const activity_data = pain_activity.find((item) => {
    return item.name === 'PainImpact';
  })?.lookup_data;
  useEffect(()=>{
    startTime = new Date().getTime()
  },[])
  useEffect(()=>{
    if(pain_impact_activities?.length){
      setSelectedActivities(pain_impact_activities)
    }
  },[pain_impact_activities?.length])


  const handlePrevious = () => {
    gotoPrevious();
    endTime = new Date().getTime()
    /* Analytics.setCurrentScreen(
        SCREEN_NAMES.PAINASSESSMENT,
        (endTime-startTime)/1000,
        startTime,
        endTime
    ) */
  };


  const handleContinue = () => {
    gotoNext();

    dispatch({
      type: CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
      payload: {
        pain_impact_activiy : selectedActivities
      },
    });
    endTime = new Date().getTime()
    /* Analytics.setCurrentScreen(
        SCREEN_NAMES.PAINASSESSMENT,
        (endTime-startTime)/1000,
        startTime,
        endTime
    ) */
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
            marginBottom: 12,
          }}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 22,
              color: COLORS.GRAY_90,
              fontWeight: '700',
              maxWidth: width - 60,
              marginBottom: 5,
            }}>
            {'What does the pain prevent you from doing?'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: width - 60,
              alignItems: 'center',
              marginBottom: 15,
            }}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                color: COLORS.GRAY_90,
                fontWeight: '700',
                width: width - 60 - 15 - 15,
              }}>
              {'Choose all that applies'}
            </Text>
            <CustomTouchableOpacity style={{marginLeft: 15}}>
              <AntDesignIcon
                name={'questioncircle'}
                size={15}
                color={COLORS.PRIMARY_MAIN}
              />
            </CustomTouchableOpacity>
          </View>

          {activity_data.map((item, index) => {
            return (
              <CustomCheckBox
                key={index}
                label={item.label}
                value={selectedActivities.includes(item.label)}
                onValueChange ={(value)=>{
                  if(value){
                    setSelectedActivities([...selectedActivities,item.label])
                  }
                  else{
                    let activites = [...selectedActivities]
                    activites.splice(activites.indexOf(item.label),1)
                    setSelectedActivities(activites)
                  }
                }}
                containerStyle={{
                  flexDirection: 'row',
                  width: width - 60,
                  marginBottom: index !== activity_data.length - 1 ? 16 : 0,
                }}
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
    </>
  );
};

export default PainCausingActivity;
