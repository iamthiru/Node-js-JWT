import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import CustomDropDown from '../../components/shared/CustomDropDown';
import {COLORS} from '../../constants/colors';
import {SCREEN_NAMES} from '../../constants/navigation';
import CustomButton from '../../components/shared/CustomButton';
import CustomTextInput from '../../components/shared/CustomTextInput';
import {useSelector, useDispatch} from 'react-redux';
import createMedicationAPI from '../../api/createMedication';
import {
  CREATE_ASSESSMENT_ACTION,
  CREATE_MEDICATION_ACTION,
  LATEST_ENTRY_ACTION,
  PATIENT_PROFILE_UPDATE_ACTION,
} from '../../constants/actions';
import Analytics from '../../utils/Analytics';
import {formatAMPM} from '../../utils/date';

const createSectionListData = (data) => {
  let lookup = [];
  data.forEach((item) => {
    let currentItem = lookup.find((l) => l.title === item.heading);
    if (currentItem) {
      currentItem.data.push(item);
    } else {
      lookup.push({
        title: item.heading,
        data: [item],
      });
    }
  });
  return lookup;
};

const NewMedication = () => {
  const {params} = useRoute();
  const medicationListData = params?.medicationList || [];
  const window = useWindowDimensions();
  const {width, height} = window;
  const navigation = useNavigation();
  const [frequency, setFrequency] = useState('');
  const [medicationClass, setMedicationClass] = useState(null);
  const [unit, setUnit] = useState(null);
  const [unitValue, setUnitValue] = useState('');
  const [medicationName, setMedicationName] = useState(null);
  const [medicationData, setMedicationData] = useState(null);
  const [showmedicationInput, setShowMedicationInput] = useState(false);
  const [medicationInputName, setMedicationInputname] = useState('');
  const [errosState, setErrorState] = useState([]);
  const [medicationClassData, setMedicationClassData] = useState({});
  const dispatch = useDispatch();
  const lookup_data = useSelector((state) => state.lookupData.lookup_data);
  const patientData = useSelector((state) => state.patientData.patient);
  const token = useSelector((state) => state.user.authToken);
  const userId = useSelector((state) => state.user.loggedInUserId);
  const latestData = useSelector((state) => state.latestEntry);
  const forceUpdate = useSelector((state) => state.patientProfileUpdate.update);

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

  const medication = useMemo(() => {
    return (
      lookup_data?.find((item) => {
        return item?.name === 'MedicationClass';
      })?.lookup_data || []
    );
  }, [lookup_data]);

  const frequency_data = useMemo(() => {
    return (
      lookup_data?.find((item) => {
        return item?.name === 'Frequency';
      })?.lookup_data || []
    );
  }, lookup_data);

  const dosage = useMemo(() => {
    return (
      lookup_data?.find((item) => {
        return item?.name === 'Dose';
      })?.lookup_data || []
    );
  }, [lookup_data]);

  useEffect(() => {
    if (
      lookup_data &&
      latestData?.medication_name_id &&
      latestData?.medication_id &&
      latestData?.dosage_number &&
      latestData?.dosage_unit_id &&
      latestData?.frequency
    ) {
      if (latestData?.medication_name_id) {
        const medication_class =
          lookup_data
            ?.find((item) => {
              return item?.name === 'MedicationClass';
            })
            ?.lookup_data?.find((item) => {
              return item.id === latestData?.medication_name_id;
            }) || {};
        setMedicationClass(medication_class.name || '');
        setMedicationClassData(medication_class);
      }
      if (latestData?.medication_id) {
        const data = lookup_data
          ?.find((item) => {
            return item?.name === 'MedicationClass';
          })
          ?.lookup_data?.find((item) => {
            return item.id === latestData?.medication_name_id;
          })
          ?.lookup_data?.find((item) => {
            return item.id === latestData?.medication_id;
          });
        setMedicationName(data.label);
        setMedicationData(data);
      }
      if (latestData?.dosage_number) {
        setUnitValue(latestData?.dosage_number.toString());
      }
      if (latestData?.dosage_unit_id) {
        const data = lookup_data
          ?.find((item) => {
            return item.name === 'Dose';
          })
          ?.lookup_data?.find((item) => {
            return item.id === latestData?.dosage_unit_id;
          });
        setUnit(data.value);
      }
      if (latestData?.frequency) {
        setFrequency(latestData?.frequency);
      }
    }
  }, [
    latestData?.frequency,
    latestData?.dosage_unit_id,
    latestData?.dosage_number,
    latestData?.medication_id,
    latestData?.medication_name_id,
  ]);

  const getMedicationName = useCallback(
    (data) => {
      let medicationName = '';
      let dosageQuantity = '';
      if (medication && dosage) {
        let getMedicationClass = medication?.find(
          (item) => item?.id === data?.medication_class_id,
        );
        let getMedicationData = getMedicationClass?.lookup_data?.find(
          (item) => item?.id === data?.medication_id,
        );
        let dosageData = dosage?.find(
          (item) => item?.id === data?.dosage_unit_id,
        );
        medicationName = getMedicationData?.label;
        dosageQuantity = dosageData?.label;
        return `${medicationName} ${data?.dosage_number} ${dosageQuantity} `;
      }
    },
    [medication],
  );

  const getDateAndTime = useCallback((data) => {
    let date = new Date(data);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${month}/${day}/${year} ${formatAMPM(date)}`;
  },[]);

  const validate = useCallback(() => {
    if (errosState?.length) {
      return true;
    }
    if (
      !frequency ||
      !medicationClass ||
      !unit ||
      !unitValue ||
      (showmedicationInput && !medicationInputName) ||
      !medicationName
    ) {
      return true;
    }
    return false;
  }, [
    errosState,
    frequency,
    medicationClass,
    unit,
    unitValue,
    medicationName,
    medicationInputName,
    showmedicationInput,
  ]);

  const handleMedication = () => {
    createMedicationAPI(
      {
        patient_id: patientData.patient_id,
        medication_class_id: medicationClassData?.id
          ? medicationClassData.id
          : 1,
        medication_id: medicationData?.id ? medicationData.id : 1,
        dosage_number: unitValue ? unitValue : 0,
        dosage_unit_id: unit ? unit : 0,
        frequency: frequency ? frequency : '',
        createdBy: userId,
        modifiedBy: userId,
      },
      token,
    )
      .then((res) => {
        if (res.data.isError) {
          Alert.alert('invalid data', res);
          return;
        }
        dispatch({
          type: LATEST_ENTRY_ACTION.LATEST_ENTRY,
          payload: {
            medication_name_id: medicationClassData?.id,
            medication_id: medicationData?.id,
            frequency: frequency,
            dosage_unit_id: unit,
            dosage_number: unitValue,
            createdAt: new Date().getTime(),
          },
        });
        dispatch({
          type: PATIENT_PROFILE_UPDATE_ACTION.PATIENT_PROFILE_UPDATE,
          payload: !forceUpdate,
        });

        dispatch({
          type: CREATE_MEDICATION_ACTION.CREATE_MEDICATION,
          payload: {
            patient_id: patientData.patient_id,
            medication_class_id: medicationClassData?.id
              ? medicationClassData.id
              : 1,
            medication_id: medicationData?.id ? medicationData.id : 1,
            dosage_number: unitValue ? unitValue : 0,
            dosage_unit_id: unit ? unit : 0,
            frequency: frequency ? frequency : '',
            createdBy: userId,
          },
        });
        navigation.navigate(SCREEN_NAMES.PATIENT_PROFILE);
      })
      .catch((err) => {
        console.log('----medication error-----', err);
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.PRIMARY_MAIN,
      }}>
      {Platform.OS === 'android' && (
        <StatusBar backgroundColor={COLORS.PRIMARY_MAIN} />
      )}
      <View
        style={{
          flex: 1,
          width: window.width,
        }}>
        {/* ---  Header Start --- */}
        <View
          style={{
            width: window.width,
            borderBottomColor: COLORS.STATE_SUCCESS,
            borderBottomWidth: 3,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingVertical: window.height > 900 ? 20 : 8,
          }}>
          <CustomTouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesignIcon
              name={'arrowleft'}
              color={COLORS.WHITE}
              size={22}
              style={{paddingTop: window.height > 900 ? 10 : 0}}
            />
          </CustomTouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              lineHeight: 28,
              textAlign: 'center',
              color: COLORS.WHITE,
              paddingTop: window.height > 900 ? 10 : 0,
            }}>
            {SCREEN_NAMES.NEW_MEDICATION}
          </Text>
          <View
            style={{
              width: 22,
            }}>
            {
              //right iconsa
            }
          </View>
        </View>
        {/* ---  Header Ends --- */}
        {/* ---  Body Starts--- */}
        <View
          style={{
            flex: 1,
            width: width,
            justifyContent: 'center',
            alignItems: 'flex-start',
            backgroundColor: COLORS.WHITE,
            paddingHorizontal: 30,
          }}>
          <ScrollView
            style={{width: width}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                width: width - 60,
                alignItems: 'center',
                marginVertical: 16,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 14,
                  color: COLORS.GRAY_80,
                  fontWeight: '600',
                  maxWidth: width - 60,
                }}>
                {'Answer from last assessment is preselected.'}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: width - 60,
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 22,
                  color: COLORS.GRAY_90,
                  fontWeight: '700',
                  maxWidth: width - 60,
                }}>
                {'Medication Class'}
              </Text>
            </View>

            <CustomDropDown
              items={medication}
              medicationClass={true}
              value={medicationClass}
              onChangeValue={(item) => {
                setMedicationClass(item.name);
                setMedicationClassData(item);
                setMedicationName(null);
                if (showmedicationInput) {
                  setShowMedicationInput(false);
                }
              }}
              containerStyle={{marginBottom: 20, width: window.width * 0.8}}
              placeholder={'Choose a medication class'}
            />

            <View
              style={{
                flexDirection: 'row',
                width: width - 60,
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 22,
                  color: COLORS.GRAY_90,
                  fontWeight: '700',
                  maxWidth: width - 60,
                }}>
                {'Medication Name'}
              </Text>
            </View>
            <CustomDropDown
              items={createSectionListData(
                medicationClassData?.lookup_data || [],
              )}
              // items = {medicationClassData?.lookup_data || []}
              value={medicationName}
              onChangeValue={(item) => {
                if (item.dispalyValue) {
                  setMedicationInputname('');
                  setShowMedicationInput(true);
                } else if (showmedicationInput) {
                  setShowMedicationInput(false);
                }
                setMedicationData(item);
                setMedicationName(item.label);
              }}
              containerStyle={{
                marginBottom: showmedicationInput ? 10 : 20,
                width: window.width * 0.8,
              }}
              heading={true}
              placeholder={'Choose a medication name'}
            />
            {showmedicationInput && (
              <CustomTextInput
                placeholder="Other Medication Name"
                value={medicationInputName}
                onChangeText={(value) => setMedicationInputname(value)}
                inputStyle={{
                  width: 200,
                  borderWidth: 0,
                  backgroundColor: 'transparent',
                }}
                containerStyle={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  backgroundColor: COLORS.WHITE,
                  height: 40,
                  width: 200,
                  marginBottom: 20,
                }}
                onBlur={() => {}}
              />
            )}

            <View
              style={{
                flexDirection: 'row',
                width: width - 60,
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 22,
                  color: COLORS.GRAY_90,
                  fontWeight: '700',
                  maxWidth: width - 60,
                }}>
                {'Dosage'}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
              }}>
              <CustomTextInput
                placeholder="Number"
                value={unitValue}
                onChangeText={(value) => setUnitValue(value)}
                inputStyle={{
                  width: 100,
                  borderWidth: 0,
                  backgroundColor: 'transparent',
                }}
                containerStyle={{
                  borderRadius: 5,
                  backgroundColor: COLORS.WHITE,
                  borderWidth: 1,
                  borderColor: COLORS.GRAY_80,
                  height: 55,
                  marginRight: 10,
                }}
                keyboardType="numeric"
              />

              <CustomDropDown
                items={dosage}
                onChangeValue={(item) => {
                  setUnit(item.value);
                }}
                value={unit}
                placeholder={'Unit'}
                containerStyle={{marginBottom: 20}}
              />
            </View>
            <View
              style={{
                width: width - 60,
                alignItems: 'flex-start',
                marginBottom: 16,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 22,
                  color: COLORS.GRAY_90,
                  fontWeight: '700',
                  maxWidth: width - 60,
                }}>
                {'Frequency And Time'}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  color: COLORS.GRAY_90,
                  fontWeight: '600',
                  maxWidth: width - 60,
                }}>
                {'Frequency'}
              </Text>
            </View>
            <CustomDropDown
              items={frequency_data}
              value={frequency}
              onChangeValue={(item) => {
                setFrequency(item.label);
                dispatch({
                  type: CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
                  frequency: item.label,
                });
              }}
              containerStyle={{marginBottom: 20, width: window.width * 0.8}}
            />
            {Boolean(medicationListData?.length) && (
              <View
                style={{
                  borderColor: COLORS.PRIMARY_DARKER,
                  paddingTop: 20,
                  borderTopWidth: 1,
                  width: width * 0.8,
                  zIndex: 10,
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: COLORS.PRIMARY_DARKER,
                  }}>
                  {'All Entries'}
                </Text>
                <View
                  style={{
                    width: width * 0.8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    {'Time'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                    }}>
                    {'Medication Name'}
                  </Text>
                </View>
                <View>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    data={
                      medicationListData?.sort((item1, item2) => {
                        return (
                          item2.modifiedAt - item1?.modifiedAt ||
                          item2.createdAt - item1?.createdAt
                        );
                      }) || []
                    }
                    keyExtractor={(item) => item?.id?.toString()}
                    nestedScrollEnabled
                    style={{
                      maxHeight: height * 0.4,
                    }}
                    renderItem={({item, index}) => {
                      return (
                        <CustomTouchableOpacity
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: width * 0.8,
                            borderBottomWidth:
                              index === medicationListData?.length - 1 ? 0 : 1,
                            paddingVertical: 10,
                            borderBottomColor: COLORS.PRIMARY_DARKER,
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                            }}>
                            {getDateAndTime(item?.createdAt)}
                          </Text>
                         
                          <View>
                          <Text
                            style={{
                              fontSize: 12,
                            }}>
                            {getMedicationName(item)}
                          </Text>
                          <Text style ={{
                            textAlign:'center'
                          }}>{item?.frequency}</Text>
                          </View>
                         
                        </CustomTouchableOpacity>
                      );
                    }}
                  />
                </View>
              </View>
            )}
          </ScrollView>
          <View
            style={{
              width: window.width - 60,
              alignItems: 'center',
            }}>
            <CustomButton
              onPress={() => handleMedication()}
              title="Submit"
              textStyle={{color: COLORS.GRAY_90, textAlign: 'center'}}
              disabled={validate()}
              style={{
                width: window.width * 0.6,
                backgroundColor: validate()
                  ? COLORS.SECONDARY_LIGHTER
                  : COLORS.SECONDARY_MAIN,
                borderColor: COLORS.PRIMARY_MAIN,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: window.height > 750 ? 30 : 20,
                marginTop: 10,
              }}
            />
          </View>
        </View>
        {/* ---  Body Ends--- */}
      </View>
    </SafeAreaView>
  );
};

export default NewMedication;
