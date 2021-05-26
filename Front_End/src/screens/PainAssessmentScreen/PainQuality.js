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
import {SCREEN_NAMES} from '../../constants/navigation';

const {width, height} = Dimensions.get('window');
var startTime;
var endTime;

const PainQuality = ({gotoNext, gotoPrevious}) => {
  const [selectedPainQualities, setSelectedPainQualities] = useState([]);
  const painQuality = useSelector(
    (state) => state.painAssessmentData.selectedPainQualities,
  );
  const selectedAssessmentData = useSelector((state) => state.createAsseement);

  const pain_qualities = useSelector((state) => state.lookupData.lookup_data);

  const quality_data = pain_qualities.find((item) => {
    return item.name === 'PainQuality';
  })?.lookup_data;

  useEffect(() => {
    startTime = new Date().getTime();
  }, []);
  useEffect(() => {
    if (selectedAssessmentData?.pain_activity_name) {
      setSelectedPainQualities([selectedAssessmentData?.pain_activity_name]);
    }
  }, [selectedAssessmentData?.pain_activity_id]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (painQuality && painQuality.length) {
      setSelectedPainQualities([...painQuality]);
    }
  }, [painQuality]);

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
    gotoNext();
    endTime = new Date().getTime();
    Analytics.setCurrentScreen(
      SCREEN_NAMES.PAINASSESSMENT,
      (endTime - startTime) / 1000,
      startTime,
      endTime,
    );
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
            marginBottom: 12,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: width - 60,
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 22,
                color: COLORS.GRAY_90,
                fontWeight: '700',
                maxWidth: width - 60 - 15 - 15,
              }}>
              {'What is the quality of the pain?'}
            </Text>
            <CustomTouchableOpacity style={{marginLeft: 15}}>
              <AntDesignIcon
                name={'questioncircle'}
                size={15}
                color={COLORS.PRIMARY_MAIN}
              />
            </CustomTouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              color: COLORS.GRAY_90,
              fontWeight: '700',
              maxWidth: width - 60,
              marginBottom: 12,
            }}>
            {'Choose all that applies'}
          </Text>

          {quality_data.map((item, index) => {
            return (
              <CustomCheckBox
                key={index}
                label={item.label}
                value={selectedPainQualities.includes(item.label)}
                onValueChange={(label) => {
                  if (label) {
                    setSelectedPainQualities([
                      ...selectedPainQualities,
                      item.label,
                    ]);

                    dispatch({
                      type: CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
                      payload: {
                        pain_activity_id: item.value,
                        pain_activity_name: item.label,
                      },
                    });
                  } else {
                    let qualities = [...selectedPainQualities];
                    qualities.splice(qualities.indexOf(item.label), 1);
                    setSelectedPainQualities(qualities);

                    dispatch({
                      type: CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
                      payload: {
                        pain_activity_id: item.value,
                        pain_activity_name: item.label,
                      },
                    });
                  }
                }}
                containerStyle={{
                  flexDirection: 'row',
                  width: width - 60,
                  marginBottom: 16,
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

export default PainQuality;
