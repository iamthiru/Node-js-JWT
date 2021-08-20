import React, { useMemo } from 'react';
import {View, Text, Dimensions, Platform, StatusBar, ScrollView} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import DeviceInfo from 'react-native-device-info';
import {useNavigation, useRoute} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { formatAMPM } from '../../utils/date';

const {width, height} = Dimensions.get('window');

const AssessmentDetailsScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute()
  const  assessment_id  = params?.assessment_id
  const allAssessmentList = useSelector((state)=>state?.allAssessmentList?.data)
  const pain_activities = useSelector((state) => state.lookupData.lookup_data);
  const pain_qualities = useSelector((state) => state.lookupData.lookup_data);

 
  const pain_impact_data = pain_activities.find((item) => {
    return item.name === 'PainImpact';
  })?.lookup_data;

  
  const quality_data = pain_qualities.find((item) => {
    return item.name === 'PainQuality';
  })?.lookup_data;





  const assessmentData = useMemo(()=>{
    if(allAssessmentList?.length){
      return allAssessmentList?.find((assessment)=>{
        return assessment?.id === 116 //assessment_id
      })
    }
  },[allAssessmentList,assessment_id])
  let date = assessmentData?.assessment_datetime ? new Date( assessmentData?.assessment_datetime ) : null
  const dateFormat = date ? `${new Date(date).toDateString()}  ${formatAMPM(date)}` : '-'
  const pain_activity =  Boolean(assessmentData?.description) ? JSON.parse(assessmentData?.description) : []
  const pain_imapct_ids = Boolean(assessmentData?.pain_impact_id) ? JSON.parse(assessmentData?.pain_impact_id) : []
  const pain_quality_ids =Boolean(assessmentData?.pain_quality_id) ? JSON.parse(assessmentData?.pain_quality_id) : []


  const pain_quality_data_list = useMemo(() => {
    if (quality_data?.length && pain_quality_ids?.length) {
      return quality_data.filter((data) => {
        return pain_quality_ids?.find((qid) => {
          return data.id === qid;
        });
      });
    }
  }, [quality_data, pain_quality_ids]);

  
  const pain_imapct_lsit_data = useMemo(() => {
    if (pain_impact_data?.length && pain_imapct_ids?.length) {
      return pain_impact_data.filter((data) => {
        return pain_imapct_ids?.find((id) => {
          return data.id === id;
        });
      });
    }
  }, [pain_impact_data, pain_imapct_ids]);



  console.log('--after filtering impact---',pain_imapct_lsit_data)
  console.log('---after filtering pain qualities---',pain_quality_data_list)
  


  return (
    <View
      style={{
        width: width,
        backgroundColor: COLORS.GRAY_10,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: Boolean(Platform.OS === 'ios') ? 0 : 50,
      }}>
      {Platform.OS === 'android' && (
        <StatusBar
          backgroundColor={'transparent'}
          barStyle="dark-content"
          translucent
        />
      )}
      <View
        style={{
          width: width,
          height: 80,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          justifyContent: 'space-evenly',
          backgroundColor: COLORS.PRIMARY_LIGHTERs
        }}>
        <CustomTouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesignIcon name={'arrowleft'} size={26} color={COLORS.GRAY_90} />
        </CustomTouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            color: COLORS.PRIMARY_MAIN,
            fontSize: 24,
            lineHeight: 30,
            fontWeight: '400',
          }}>
          Assessment Details
        </Text>
      </View>
      <View
        style={{
          width: width,
          paddingHorizontal: 30,
          paddingVertical: 10,

          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.GRAY_90,
            fontWeight: '800',
          }}>
          {'Time : '}
        </Text>
        <Text style={{fontSize: 16}}>{dateFormat}</Text>
      </View>
      <View
        style={{
          width: width,
          paddingHorizontal: 30,
          paddingVertical: 10,

          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.GRAY_90,
            fontWeight: '800',
          }}>
          {'VerbalAbility: '}
        </Text>
        <Text style={{fontSize: 16}}>{assessmentData?.type||'-'}</Text>
      </View>
      <View
        style={{
          width: width,
          paddingHorizontal: 30,
          paddingVertical: 10,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.GRAY_90,
            fontWeight: '800',
          }}>
          {'NRS Score: '}
        </Text>
        <Text style={{fontSize: 16}}>{assessmentData?.current_pain_score || 0}</Text>
      </View>
      <View
        style={{
          width: width,
          paddingHorizontal: 30,
          paddingVertical: 10,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.GRAY_90,
            fontWeight: '800',
          }}>
          {'Pain Timing'}
        </Text>
        {pain_activity.map((data) => {
          return <Text style ={{paddingHorizontal:5}}>{data}</Text>;
        })}
      </View>
      <View
        style={{
          width: width,
          paddingHorizontal: 30,
          paddingVertical: 10,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.GRAY_90,
            fontWeight: '800',
          }}>
          {'Pain Quality'}
        </Text>
        {[1, 2, 3].map((data) => {
          return <Text>{data}</Text>;
        })}
      </View>
      <View
        style={{
          width: width,
          paddingHorizontal: 30,
          paddingVertical: 10,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.GRAY_90,
            fontWeight: '800',
          }}>
          {'Pain Timing'}
        </Text>
      </View>
      <View
        style={{
          width: width,
          paddingHorizontal: 30,
          paddingVertical: 10,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.GRAY_90,
            fontWeight: '800',
          }}>
          {'Pain Activity'}
        </Text>
        {[1, 2, 3].map((data) => {
          return <Text>{data}</Text>;
        })}
      </View>
      <View
        style={{
          width: width,
          paddingHorizontal: 30,
          paddingVertical: 10,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.GRAY_90,
            fontWeight: '800',
          }}>
          {'Note:'}
        </Text>
        <Text style={{fontSize: 16}}>{'Note'}</Text>
      </View>
      {/* <View
        style={{
          width: width,
          paddingHorizontal: 30,
          paddingVertical: 10,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: COLORS.GRAY_90,
            fontWeight: '800',
          }}>
          {'Reminder:'}
        </Text>
        <Text style={{fontSize: 16}}>{'true'}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal:30
        }}>
        <Text style={{fontSize: 14, lineHeight: 22, fontWeight: '700'}}>
          PUPILLARY RESULT:
        </Text>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              fontWeight: '700',
              paddingLeft: 10,
            }}>
            {'PUAL:'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              fontWeight: '700',
              paddingLeft: 5,
            }}>
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              fontWeight: '700',
              paddingLeft: 10,
            }}>
            {'Ratio:'}
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              fontWeight: '700',
              paddingLeft: 5,
            }}>
          </Text>
        </View> */}
      {/* </View> */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal:30
        }}>
        <Text style={{fontSize: 14, lineHeight: 22, fontWeight: '700'}}>
          Pupillary Dilation Score:
        </Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 22,
            fontWeight: '700',
            paddingLeft: 10,
          }}>
            {'pupilary dilation'}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal:30
        }}>
        <Text style={{fontSize: 14, lineHeight: 22, fontWeight: '700'}}>
          Impact Score:
        </Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 22,
            fontWeight: '700',
            paddingLeft: 10,
          }}>
            {Boolean(parseInt(assessmentData?.facial_expression)!==99)? parseInt(assessmentData?.facial_expression) : 0}
        </Text>
      </View>
    </View>
  );
};
export default AssessmentDetailsScreen;
