import {useRoute} from '@react-navigation/core';
import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
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
import {useDispatch, useSelector} from 'react-redux';
import {
  ALL_ASSESSMENTS_LIST_ACTION,
  ALL_PATIENTS_ACTIONS,
  GET_ASSESSMENT_ACTION,
  PATIENT_NAME_ACTION,
} from '../../constants/actions';
import medicationListAPI from '../../api/medicationList';
import lastMedicationAssessmentAPI from '../../api/lastMedicationAssessment';
import assessmentListAPI from '../../api/assessmentList';
import {formatAMPM} from '../../utils/date';
import { getPatientListAPI } from '../../api/patientsData';

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
  const {item} = params;
  const entry = false;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.authToken);
  const userId = useSelector((state) => state.user.loggedInUserId);
  const selectedPatient = useSelector((state)=>state?.allPatients?.all_patients)?.find((patient)=>patient.id === item.id)



  const [latestMedicationData, setLatestMedicationData] = useState({});
  const [last_medication, setLast_medication] = useState([]);
  const [last_assessment, setLastAssessment] = useState([]);
  const [allAssessmentList, setAllAssessmentList] = useState([]);
  const [newPatientPopUp,setNewPatientPopUp] = useState(false)
  const lookup_data = useSelector((state) => state.lookupData.lookup_data);
  const all_assessment_data = last_assessment?.assessment;
  const all_medication_data = last_assessment?.medication;

  useEffect(() => {
    if (token && selectedPatient.id) {
      medicationListAPI(token, selectedPatient.id)
        .then((res) => {
          if (res.data.isError) {
            Alert.alert('-----invalid medication list-------');
          }
          console.log('-----medication list------', res.data.result);

          setLast_medication(res.data.result);
        })
        .catch((err) => {
          console.log('medication list error-----', err);
        });
      lastMedicationAssessmentAPI(token, selectedPatient.id)
        .then((result) => {
          if (result.data.isError) {
            Alert.alert(
              '-------invalid last medication Assessment data---------',
            );
          }
          console.log('----last medication all list ------', result);
          setLastAssessment(result.data.result);
          dispatch({
            type: GET_ASSESSMENT_ACTION.GET_ASSESSMENT,
            payload: result.data.result,
          });
          setLatestMedicationData({
            ...latestMedicationData,
            assessment: result.data.result.assessment,
            medication: result.data.result.medication,
          });
        })
        .catch((err) => {
          console.log('------last medication error------', err);
        });
    }
  }, [token, selectedPatient.id]);
  

  useEffect(()=>{
    if(token){
      getPatientListAPI(token)
      .then((res)=>{
        if (res.data.isError) {
          Alert.alert('all patinets  data error');
          return;
        }
        console.log('result', res);
        dispatch({
          type: ALL_PATIENTS_ACTIONS.ALL_PATIENTS,
          payload: res.data.result
        });
      })
      .catch((err) => {
        console.log('-----all patients error-----', err);
      });
    }

  },[token])

  useEffect(() => {
    if (token) {
      assessmentListAPI(token)
        .then((res) => {
          if (res.data.isError) {
            Alert.alert('-----invalid assessment list');
            return;
          }
          console.log('----all assessment list-----', res);
          dispatch({
            type: ALL_ASSESSMENTS_LIST_ACTION.ALL_ASSESSMENT_LIST,
            payload: res.data.result,
          });
          setAllAssessmentList(res.data.result);
        })
        .catch((err) => {
          console.log('----assessment lsit error-----', err);
        });
    }
  }, [token]);
  const medicationList = useMemo(() => {
    return lookup_data
      .find((item) => {
        return item.name === 'MedicationClass';
      })
      ?.lookup_data?.find((item) => {
        return item.id === all_medication_data?.medication_class_id;
      })
      ?.lookup_data?.find((item) => {
        return item.id === all_medication_data?.medication_id;
      });
  }, [lookup_data, all_medication_data]);

  const dosage = useMemo(() => {
    if (lookup_data) {
      return lookup_data
        ?.find((item) => {
          return item.name === 'Dose';
        })
        ?.lookup_data?.find((item) => {
          return item.id === all_medication_data?.dosage_unit_id;
        });
    }
  }, [lookup_data, all_medication_data]);





  return (
    <View
      style={[
        styles.body,
        {
          paddingTop: Boolean(Platform.OS === 'ios') ? 0 : 50,
        },
      ]}>
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
        <PatientDetailCard 
        profile={selectedPatient} 
        newPatientPopUp ={newPatientPopUp}
         setNewPatientPopUp= {setNewPatientPopUp}
         />
        <View
          style={{
            paddingVertical: 20,
            width: width,
            alignItems: 'center',
          }}>
          <CustomButton
            onPress={() => {
              navigation.navigate(SCREEN_NAMES.PAINASSESSMENT);
              dispatch({
                type: PATIENT_NAME_ACTION.PATIENT,
                payload: {
                  patient_id: item.id,
                  patient_name: item.first_name + ' ' + item.last_name,
                },
              });
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
               dispatch({
                type: PATIENT_NAME_ACTION.PATIENT,
                payload: {
                  patient_id: item.id,
                  patient_name: item.first_name + ' ' + item.last_name,
                },
              });

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
        {Boolean((last_assessment.length ===0  && last_medication.length === 0)) ? (
          <NoEntryCard />
        ) : (
          <>
            <LatestEntryCard
              latestEntryData={latestEntryData}
              data={latestMedicationData}
              last_assessment={last_assessment}
              last_medication={last_medication}
            />
            {
            Boolean(allAssessmentList?.length) ?
           
            <SummaryChart
              last_assessment={last_assessment}
              last_medication={last_medication}
              lookup_data={lookup_data}
  
              patientData={
                allAssessmentList?.map((list) => {
                  let dateTime = new Date(list.assessment_datetime);

                  return {
                    value: list?.total_score,
                    time: dateTime.toDateString(),
                    score: list?.current_pain_score,
                    medicationData: `${
                      (medicationList?.label && medicationList?.label) || ''
                    } ${
                      all_medication_data?.dosage_number
                        ? all_medication_data?.dosage_number
                        : ''
                    } ${dosage?.label ? dosage?.label : ''}`,
                  };
                }) || []
              }
              patientReport={reportData}
            />
            :
            <Text style ={{
              fontSize:25,
              textAlign:'center',
              paddingVertical:20,
              fontWeight:'600',
              color:COLORS.PRIMARY_MAIN
            }}>
              No Data Found
            </Text>
          }
            <AllEntryCard allEntries={allAssessmentList} />
          </>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

export default PatientProfile;
