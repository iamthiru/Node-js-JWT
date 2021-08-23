import React, {useEffect, useMemo} from 'react';
import {
  View,
  Text,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {formatAMPM} from '../../utils/date';
import styles from './styles';
import {FlatList} from 'react-native-gesture-handler';
import {
  BACK_SIDE_BODY_PARTS,
  FRONT_SIDE_BODY_PART_DATA,
} from '../../constants/painLocationConstants';

const {width, height} = Dimensions.get('window');

export const RenderDataItems = ({id, label}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingLeft: width * 0.28,
      }}>
      <Text style={[styles.dataText]}>{label}</Text>
    </View>
  );
};

const AssessmentDetailsScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const assessment_id = params?.assessment_id;
  const allAssessmentList = useSelector(
    (state) => state?.allAssessmentList?.data,
  );
  const pain_activities = useSelector((state) => state.lookupData.lookup_data);
  const pain_qualities = useSelector((state) => state.lookupData.lookup_data);

  const pain_impact_data = pain_activities.find((item) => {
    return item.name === 'PainImpact';
  })?.lookup_data;

  const quality_data = pain_qualities.find((item) => {
    return item.name === 'PainQuality';
  })?.lookup_data;

  const assessmentData = useMemo(() => {
    if (allAssessmentList?.length) {
      return allAssessmentList?.find((assessment) => {
        return assessment?.id === assessment_id;
      });
    }
  }, [allAssessmentList, assessment_id]);

  let date = assessmentData?.assessment_datetime
    ? new Date(assessmentData?.assessment_datetime)
    : null;
  const dateFormat = date
    ? `${new Date(date).toDateString()}  ${formatAMPM(date)}`
    : '-';
  const pain_impact_activities_list = Boolean(assessmentData?.description)
    ? JSON.parse(assessmentData?.description)
    : [];
  const pain_imapct_ids = Boolean(assessmentData?.pain_impact_id)
    ? JSON.parse(assessmentData?.pain_impact_id)
    : [];
  const pain_quality_ids = Boolean(assessmentData?.pain_quality_id)
    ? JSON.parse(assessmentData?.pain_quality_id)
    : [];

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

  const painLocationsList = [
    ...FRONT_SIDE_BODY_PART_DATA,
    ...BACK_SIDE_BODY_PARTS,
  ];

  const painLocations = Boolean(assessmentData?.pain_location_id)
    ? JSON.parse(assessmentData?.pain_location_id)
    : [];
  const locations = Boolean(painLocations)
    ? painLocations?.map((loc) => loc)
    : [];

  const selectedPainLocationsList = useMemo(() => {
    if (painLocationsList?.length) {
      return painLocationsList?.filter((item) => {
        return locations?.find((loc) => {
          return loc === item?.value;
        });
      });
    }
  }, [painLocationsList, locations]);

  return (
    <SafeAreaView style={styles.safaAreaBody}>
      <View
        style={{
          width: width,
          height: height,
          paddingTop: Boolean(Platform.OS === 'ios')
            ? height <= 736
              ? 20
              : 0
            : 50,
        }}>
        <View style={styles.headerStyle}>
          <CustomTouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesignIcon
              name={'arrowleft'}
              color={COLORS.GRAY_90}
              style={styles.arrowStyle}
            />
          </CustomTouchableOpacity>

          <Text style={styles.headerText}>Assessment Details</Text>
        </View>
        <View
          style={{
            paddingTop: height < 700 ? 10 : 20,
            flex: 2,
            width: width,
          }}>
          <View style={styles.dataFieldView}>
            <Text style={styles.subHeadingText}>{'Assessment Date: '}</Text>
            <Text style={styles.dataText}>{dateFormat}</Text>
          </View>
          <View style={styles.dataFieldView}>
            <Text style={styles.subHeadingText}>{'Verbal Ability: '}</Text>
            <Text style={styles.dataText}>{assessmentData?.type || '-'}</Text>
          </View>
          <View style={styles.dataFieldView}>
            <Text style={styles.subHeadingText}>{'NRS Score: '}</Text>
            <View>
              <Text>{''}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.dataText}>{'Most Pain: '}</Text>
                <Text style={styles.dataText}>
                  {assessmentData?.most_pain_score || 0}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.dataText}>{'Current Pain: '}</Text>
                <Text style={styles.dataText}>
                  {assessmentData?.current_pain_score || 0}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.dataText}>{'Least Pain: '}</Text>
                <Text style={styles.dataText}>
                  {' '}
                  {Boolean(assessmentData?.least_pain_score)
                    ? 0
                    : assessmentData?.least_pain_score}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.dataFieldView}>
            <Text style={styles.subHeadingText}>{'Note: '}</Text>
            <Text style={styles.dataText}>{assessmentData?.note || ''}</Text>
          </View>
          <View style={styles.dataFieldView}>
            <Text style={styles.subHeadingText}>{'Remainder : '}</Text>
            <Text style={styles.dataText}>
              {assessmentData?.isReminder ? 'true' : 'false'}
            </Text>
          </View>
          <View style={styles.dataFieldView}>
            <Text style={styles.subHeadingText}>{'Impact Score: '}</Text>
            <Text style={styles.dataText}>
              {Boolean(assessmentData?.total_score !== 99)
                ? parseInt(assessmentData?.total_score)
                : 'N/A'}
            </Text>
          </View>
          <ScrollView
            style={{
              paddingBottom: 50,
              maxHeight: height * 0.51,
            }}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            horizontal={false}>
            <View style={{paddingHorizontal: 30, paddingVertical: 10}}>
              <Text style={styles.subHeadingText}>{'Pain Qualities: '}</Text>
              <FlatList
                data={pain_imapct_lsit_data}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                style={{
                  maxHeight: height * 0.3,
                }}
                keyExtractor={(item) => item.value.toString()}
                nestedScrollEnabled
                renderItem={({item, index}) => {
                  return (
                    <RenderDataItems key={'_' + index} label={item?.label} />
                  );
                }}
              />
            </View>
            <View style={{paddingHorizontal: 30, paddingVertical: 10}}>
              <Text style={styles.subHeadingText}>{'Pain Timing: '}</Text>
              <FlatList
                data={pain_impact_activities_list || []}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                style={{
                  maxHeight: height * 0.3,
                }}
                keyExtractor={(item) => item}
                nestedScrollEnabled
                renderItem={({item, index}) => {
                  return <RenderDataItems key={'_' + index} label={item} />;
                }}
              />
            </View>
            <View style={{paddingHorizontal: 30, paddingVertical: 10}}>
              <Text style={styles.subHeadingText}>{'Pain  Activies: '}</Text>
              <FlatList
                data={pain_quality_data_list || []}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                style={{
                  maxHeight: height * 0.5,
                }}
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled
                renderItem={({item, index}) => {
                  return (
                    <RenderDataItems key={'_' + index} label={item?.label} />
                  );
                }}
              />
            </View>

            <View style={{paddingHorizontal: 30, paddingVertical: 10}}>
              <Text style={styles.subHeadingText}>{'Pain Locations: '}</Text>
              <FlatList
                data={selectedPainLocationsList}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                style={{
                  maxHeight: height * 0.3,
                }}
                keyExtractor={(item) => item.key}
                nestedScrollEnabled
                renderItem={({item, index}) => {
                  return (
                    <RenderDataItems
                      key={'_' + index}
                      label={item?.part_name}
                    />
                  );
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default AssessmentDetailsScreen;
