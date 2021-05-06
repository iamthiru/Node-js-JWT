import {useRoute} from '@react-navigation/core';
import React from 'react';
import {
  View,
  Text,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomButton from '../../components/shared/CustomButton';
import {COLORS} from '../../constants/colors';
import {SCREEN_NAMES} from '../../constants/navigation';
import styles from './styles';
import Footer from '../../components/Footer';
import PatientDetailCard from './PatientDetailCard';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import NoEntryCard from './NoEntryCard';
import LatestEntryCard from './LatestEntryCard';
import SummaryChart from './SummaryChart';
import AllEntryCard from './AllEntryCard';
import {ALLENTRIES_DATA} from '../../constants/PatientProfile/allEntries';


const {width, height} = Dimensions.get('window');
const reportData = {
  key: 'time',
  time: 'Sep 10, 2020, 4:00 pm',
  score: '9',
  medication: {
    medication_per: 'xxxmed 500 mg',
    medication_times: 'every 4 hour',
  },
  note: 'Lorem ipsum dolor sit amet, consectetur elit',
  button: 'View Entry',
};
const latestEntryData = {
  key: 'latest_entry',
  time: 'Sep 10, 2020, 5:00 pm',
  buttonText: '11',
  pain_Medication: {
    name: 'xxxxx',
    Dosage: 'xxxxx',
    Usage: {
      dose: '1 pill every 4 hour',
      start_time: 'Starting Sep 10, 2020, 3:0 pm',
      end_time: 'No end time',
    },
  },
};

const PatientProfile = ({navigation}) => {
  const params = useRoute()?.params;
  const item = params;
  const entry = false;



  return (
    <View style={[styles.body,
    {
      paddingTop:Boolean(Platform.OS === 'ios') ? 0:50
    }]}>
      {Platform.OS === 'android' && (
        <StatusBar
          backgroundColor={'transparent'}
          barStyle="dark-content"
          translucent
        />
      )}
      <View style={styles.headingContainer}>
        <View
          style={{
            height: 50,
            width: width,
            marginHorizontal: 10,
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          <View
            style={{
              position: 'absolute',
              top: 12,
              zIndex: 1,
            }}>
            <CustomTouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesignIcon
                name={'arrowleft'}
                size={26}
                color={COLORS.GRAY_90}
              />
            </CustomTouchableOpacity>
          </View>
          <Text
            style={{
              textAlign: 'center',
              color: COLORS.PRIMARY_MAIN,
              fontSize: 24,
              lineHeight: 30,
              fontWeight: '400',
            }}>
            Patient Profile
          </Text>
        </View>
      </View>
      <ScrollView
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <PatientDetailCard profile={item} />
        <View
          style={{
            paddingVertical: 20, 
            width: width,
            alignItems: 'center',
          }}>
          <CustomButton
            onPress={() => {
              navigation.navigate(SCREEN_NAMES.PAINASSESSMENT);
            }}
            title="New Assessment"
            textStyle={{
              color: COLORS.GRAY_90,
              textAlign: 'center',
              paddingHorizontal: 5,
            }}
            iconRight={
              <MaterialCommunityIcons
                name={'clipboard-plus'}
                size={20}
                color={COLORS.GRAY_90}
              />
            }
            style={styles.secondaryButton}
          />
          <CustomButton
            onPress={() => {
              navigation.navigate(SCREEN_NAMES.NEW_MEDICATION);
            }}
            title="Change Medication"
            textStyle={{
              color: COLORS.WHITE,
              textAlign: 'center',
              paddingHorizontal: 5,
            }}
            iconRight={
              <FontAwesome5 name={'user-plus'} size={20} color={COLORS.WHITE} />
            }
            style={styles.primaryButton}
          />
        </View>
        {Boolean(entry) ? (
          <NoEntryCard />
        ) : (
          <>
            <LatestEntryCard latestEntryData={latestEntryData} />
            <SummaryChart
              patientData={[
                15,
                32,
                22,
                25,
                14,
                19,
                4,
                10,
                21,
                8,
                13,
                11,
                40,
              ].map((data) => {
                return {
                  value: data,
                  time: '3:00 pm',
                  score: data % 10,
                  xxmed: data * 10,
                };
              })}
              patientReport={reportData}
            />
            <AllEntryCard entriesData={ALLENTRIES_DATA} />
          </>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

export default PatientProfile;
