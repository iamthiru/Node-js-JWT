import {useRoute} from '@react-navigation/core';
import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {
  ALL_ASSESSMENTS_LIST_ACTION,
  ALL_PATIENTS_ACTIONS,
  GET_ASSESSMENT_ACTION,
  LATEST_ENTRY_ACTION,
  PATIENT_NAME_ACTION,
} from '../../constants/actions';
import medicationListAPI from '../../api/medicationList';
import lastMedicationAssessmentAPI from '../../api/lastMedicationAssessment';
import assessmentListAPI from '../../api/assessmentList';
import {getPatientListAPI} from '../../api/patientsData';
import Analytics from '../../utils/Analytics';
import {formatAMPM, padNumber} from '../../utils/date';

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
  button: 'View All Entries',
};

const PatientProfile = ({navigation}) => {
  const patientDetailsData = useSelector((state) => state.patientDetails);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.authToken);
  const userId = useSelector((state) => state.user.loggedInUserId);
  const selectedPatient = useSelector(
    (state) => state?.allPatients?.all_patients,
  )?.find((patient) => patient.id === patientDetailsData.item.id);
  const [latestMedicationData, setLatestMedicationData] = useState({});
  const [last_medication, setLast_medication] = useState([]);
  const [last_assessment, setLastAssessment] = useState([]);
  const [allAssessmentList, setAllAssessmentList] = useState([]);
  const [newPatientPopUp, setNewPatientPopUp] = useState(false);
  const lookup_data = useSelector((state) => state.lookupData.lookup_data);
  const all_medication_data = last_assessment?.medication;
  const [summaryChartData, setSummaryChartData] = useState([]);
  const [summaryChartLabels, setSummaryChartLabels] = useState([]);
  const scrollRef = useRef(null);
  const forceUpdate = useSelector((state) => state.patientProfileUpdate.update);
  useEffect(() => {
    let id = 0;
    let name = '';
    let dob = '';
    let medicalRecordNumber = '';
    let gender = '';
    let age = 0;
    if (selectedPatient) {
      id = selectedPatient?.id;
      name = `${selectedPatient?.first_name} ${selectedPatient?.last_name}`;
      dob = new Date(selectedPatient?.dob).toDateString();
      age =
        new Date().getFullYear() - new Date(selectedPatient?.dob).getFullYear();
      medicalRecordNumber = `${selectedPatient?.medical_record_no}`;
      gender = selectedPatient?.gender;
      Analytics.setPatientInfo(id, name, dob, age, medicalRecordNumber, gender);
      Analytics.removeData(`patients`)
    }
  }, [selectedPatient]);

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

  useEffect(() => {
    if (allAssessmentList?.length) {
      handleSummaryChartData(0);
    }
  }, [allAssessmentList?.length]);

  useEffect(() => {
    if (token && selectedPatient.id) {
      medicationListAPI(token, selectedPatient.id)
        .then((res) => {
          if (res.data.isError) {
            Alert.alert('-----invalid medication list-------');
          }
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
          setLastAssessment(result.data.result);
          dispatch({
            type: GET_ASSESSMENT_ACTION.GET_ASSESSMENT,
            payload: result.data.result,
          });

          dispatch({
            type: LATEST_ENTRY_ACTION.LATEST_ENTRY,
            payload: {
              assessmentDateAndTime:
                result.data.result.assessment?.assessment_datetime,
              impactScore: result.data.result.assessment?.total_score,
              medication_name_id:
                result.data.result.medication?.medication_class_id,
              medication_id: result.data.result.medication?.medication_id,
              frequency: result.data.result.medication?.frequency,
              createdAt: result.data.result.medication?.createdAt,
              dosage_unit_id: result.data.result.medication.dosage_unit_id,
              dosage_number: result.data.result.medication.dosage_number,
            },
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
  }, [token, selectedPatient, forceUpdate]);

  useEffect(() => {
    if (token) {
      getPatientListAPI(token, userId)
        .then((res) => {
          if (res.data.isError) {
            Alert.alert('all patinets  data error');
            return;
          }
          dispatch({
            type: ALL_PATIENTS_ACTIONS.ALL_PATIENTS,
            payload: res.data.result.sort(
              (item1, item2) => item2.createdAt - item1.createdAt,
            ),
          });
        })
        .catch((err) => {
          console.log('-----all patients error-----', err);
        });
    }
  }, [token]);


  useEffect(() => {
    if (token) {
      assessmentListAPI(token)
        .then((res) => {
          if (res.data.isError) {
            Alert.alert('-----invalid assessment list');
            return;
          }
          dispatch({
            type: ALL_ASSESSMENTS_LIST_ACTION.ALL_ASSESSMENT_LIST,
            payload: res.data.result,
          });
          let data = res.data.result.filter((item) => {
            return item?.patient_id === selectedPatient?.id;
          });

          setAllAssessmentList(data);
        })
        .catch((err) => {
          console.log('----assessment lsit error-----', err);
        });
    }
  }, [token, forceUpdate, selectedPatient]);

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

  const handleSummaryChartData = (index) => {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let fullDate = now.getDate();
    let hours = now.getHours();
    if (index === 0) {
      let date = new Date(year, month, fullDate, hours - 6).getTime();
      const data = allAssessmentList.filter((item) => {
        return item.assessment_datetime >= date;
      });
      const basedOnDateData = data?.sort(
        (item1, item2) =>
          item1?.assessment_datetime - item2?.assessment_datetime,
      );
      setSummaryChartData(basedOnDateData || []);
      let labels = basedOnDateData?.map((label) => {
        return `${formatAMPM(new Date(label?.assessment_datetime))}`;
      });
      setSummaryChartLabels(labels || []);
      return;
    }
    if (index === 1) {
      let date = new Date(year, month, fullDate, hours - 12).getTime();
      const data = allAssessmentList.filter((item) => {
        return item.assessment_datetime >= date;
      });
      const basedOnDateData = data?.sort(
        (item1, item2) => item1.assessment_datetime - item2.assessment_datetime,
      );
      setSummaryChartData(basedOnDateData || []);
      let labels = basedOnDateData?.map((label) => {
        return `${formatAMPM(new Date(label?.assessment_datetime))}`;
      });
      setSummaryChartLabels(labels);
      return;
    }
    if (index === 2) {
      let date = new Date(year, month, fullDate - 1, hours).getTime();
      const data = allAssessmentList.filter((item) => {
        return item.assessment_datetime >= date;
      });
      const basedOnDateData = data?.sort(
        (item1, item2) => item1.assessment_datetime - item2.assessment_datetime,
      );
      setSummaryChartData(basedOnDateData || []);
      let labels = basedOnDateData?.map((label) => {
        return `${padNumber(
          new Date(label?.assessment_datetime).getMonth() + 1,
        )}_${padNumber(new Date(label?.assessment_datetime).getDate())}`;
      });
      setSummaryChartLabels(labels);
      return;
    }
    if (index === 3) {
      let date = new Date(year, month, fullDate - 7, hours).getTime();
      const data = allAssessmentList.filter((item) => {
        return item.assessment_datetime >= date;
      });
      const basedOnDateData = data?.sort(
        (item1, item2) => item1.assessment_datetime - item2.assessment_datetime,
      );
      setSummaryChartData(basedOnDateData || []);
      let labels = basedOnDateData?.map((label) => {
        return `${padNumber(
          new Date(label?.assessment_datetime).getMonth() + 1,
        )}_${padNumber(new Date(label?.assessment_datetime).getDate())}`;
      });
      setSummaryChartLabels(labels);
      return;
    }
    if (index === 4) {
      const basedOnDateData = allAssessmentList?.sort(
        (item1, item2) => item1.assessment_datetime - item2.assessment_datetime,
      );
      setSummaryChartData(basedOnDateData || []);
      let labels = basedOnDateData?.map((label) => {
        return `${padNumber(
          new Date(label?.assessment_datetime).getMonth() + 1,
        )}_${padNumber(new Date(label?.assessment_datetime).getDate())}`;
      });
      setSummaryChartLabels(labels);
    }
  };

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
        <View style={styles.patient_main_view}>
          <View style={styles.main_view_position}>
            <CustomTouchableOpacity
              onPress={async() => {
                // navigation.goBack();
               await dispatch({
                  type:PATIENT_NAME_ACTION.PATIENT,
                  payload: null
                })
                navigation.navigate(SCREEN_NAMES.HOME)
              }}>
              <AntDesignIcon
                name={'arrowleft'}
                size={26}
                color={COLORS.GRAY_90}
              />
            </CustomTouchableOpacity>
          </View>
          <Text style={styles.patientProfileText}>Patient Profile</Text>
        </View>
      </View>
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <PatientDetailCard
          profile={selectedPatient}
          newPatientPopUp={newPatientPopUp}
          setNewPatientPopUp={setNewPatientPopUp}
        />
        <View style={styles.profileButtonsView}>
          <CustomButton
            onPress={() => {
              dispatch({
                type: PATIENT_NAME_ACTION.PATIENT,
                payload: {
                  patient_id: patientDetailsData?.item?.id,
                  patient_name:
                    patientDetailsData?.item?.first_name +
                    ' ' +
                    patientDetailsData?.item?.last_name,
                },
              });
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
              dispatch({
                type: PATIENT_NAME_ACTION.PATIENT,
                payload: {
                  patient_id: patientDetailsData.item.id,
                  patient_name:
                    patientDetailsData.item.first_name +
                    ' ' +
                    patientDetailsData.item.last_name,
                },
              });
              navigation.navigate(SCREEN_NAMES.NEW_MEDICATION,{medicationList : last_medication});
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
        {!Boolean(
          (last_assessment &&
            last_assessment.assessment &&
            Object.keys(last_assessment.assessment).length !== 0) ||
            (last_medication && last_medication.length !== 0),
        ) ? (
          <NoEntryCard />
        ) : (
          <>
            <LatestEntryCard
              last_assessment={last_assessment}
              last_medication={last_medication}
              scrollRef={scrollRef}
            />
            {Boolean(allAssessmentList?.length > 0) && (
              <SummaryChart
                last_assessment={last_assessment}
                last_medication={last_medication}
                lookup_data={lookup_data}
                allAssessmentList={allAssessmentList}
                patientData={
                  summaryChartData?.map((list) => {
                    let dateTime = list?.assessment_datetime;
                    return {
                      value: list?.total_score,
                      time: dateTime,
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
                handleSummaryChartData={handleSummaryChartData}
                summaryChartData={summaryChartData}
                summaryChartLabels={summaryChartLabels}
                scrollRef={scrollRef}
              />
            )}
            <AllEntryCard allEntries={allAssessmentList} />
              <View style ={{
                height : height > 900 ? width/2.2 :height > 700 ? width/2.8 : width/3.4
              }}>
              </View>
          </>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

export default PatientProfile;
