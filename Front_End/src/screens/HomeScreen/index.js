import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  Platform,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {COLORS} from '../../constants/colors';
import styles from './styles';
import ImageHeader from '../../assets/images/headerImage.png';
import CustomButton from '../../components/shared/CustomButton';
import {useSelector, useDispatch} from 'react-redux';
import Footer from '../../components/Footer';
import {FlatList} from 'react-native-gesture-handler';
import PatientListItem from './PatientListItem';
import NewPatientPopUp from './NewPatientPopUp';
import {SCREEN_NAMES} from '../../constants/navigation';
import {getPatientListAPI} from '../../api/patientsData';
import {
  ALL_PATIENTS_ACTIONS,
  LOOKUP_DATA_ACTION,
} from '../../constants/actions';
import {lookupDataAPI} from '../../api/lookupData';
import {lookupTypeAPI} from '../../api/lookupType';

const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  
  const recentPatients = useSelector((state) => state?.allPatients?.all_patients)?.filter((item,index)=>{
    return index<=4
  })
  const [openNewPatient, setOpenNewPatient] = useState(false);
  const [user, setUser] = useState('');
  const token = useSelector((state) => state.user.authToken);
  const userName = useSelector((state) => state.user.userName);
  const dispatch = useDispatch();




  useEffect(() => {
    if (userName) {
      setUser(userName);
    }
    if (token) {
      getPatientListAPI(token)
        .then((res) => {
          if (res.data.isError) {
            Alert.alert('all patinets  data error');
            return;
          }
          console.log('result', res);
          dispatch({
            type: ALL_PATIENTS_ACTIONS.ALL_PATIENTS,
            payload: res.data.result.sort((item1,item2)=> new Date(item2.createdAt) - new Date(item1.createdAt)),
          });
        })
        .catch((err) => {
          console.log('-----all patients error-----', err);
        });
    }
  }, [token, userName]);



  useEffect(() => {
    if (token) {
      lookupTypeAPI(token) 
        .then((result) => {
          console.log('-------lookup---type-- reult------', result);
          if (result.data.isError) {
            Alert.alert('-------invalid lookup type--------');'s'
            return;
          }

          lookupDataAPI(token)
            .then((res) => {
              console.log('-----lookup--data--res--', res);
              if (res.data.isError) {
                Alert.alert('-------invalid lookup data--------');
                return;
              }
              let lookupAllData = res.data.result;
              let lookup_data = result.data.result
                .filter((type) => !type.parentLookupTypeId)
                .map((lookup) => {
                  return {
                    id: lookup.id,
                    name: lookup.lookupType,
                    parentId: lookup.parentLookupTypeId,
                    lookup_data: lookupAllData
                      .filter((data) => data.lookupTypeId === lookup.id)
                      .map((data) => {
                        return {
                          id: data.id,
                          label: data.displayValue,
                          value: data.id,
                          key: data.id,
                        };
                      }),
                  };
                });
              result.data.result
                .filter((type) => Boolean(type.parentLookupTypeId))
                .forEach((lookup) => {
                  lookup_data
                    .filter(
                      (d) =>
                        d.id.toString() ===
                        lookup.parentLookupTypeId.toString(),
                    )?.[0]
                    .lookup_data.push({
                      id: lookup.id,
                      name: lookup.lookupType,
                      parentId: lookup.parentLookupTypeId,
                      lookup_data: lookupAllData
                        .filter((data) => data.lookupTypeId === lookup.id)
                        .map((data) => {
                          return {
                            id: data.id,
                            label: data.displayValue,
                            value: data.id,
                            key: data.id,
                          };
                        }),
                    });
                });
              dispatch({
                type: LOOKUP_DATA_ACTION.LOOKUP_DATA,
                payload: lookup_data,
              });
            })
            .catch((err) => {
              console.log('-----lookup data error----', );
            });
        })
        .catch((error) => {
          console.log('----lookup type error-----');
        });
    }
  });

  return (
    <View style={styles.body}>
      {Platform.OS === 'android' && (
        <StatusBar backgroundColor={'transparent'} translucent />
      )}
      <View style={styles.headingContainer}>
        <Image
          source={ImageHeader}
          style={{
            height: height * 0.23,
            width: width,
          }}
        />
        <View style={styles.headingLabelContainer}>
          <Text style={styles.h1Label}>Good Morning,</Text>
          <Text style={styles.hLabel}>{user ? user : 'Susan'}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          width: width,
        }}>
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
            title="New Pain Assessment"
            textStyle={{
              flex: 1,
              color: COLORS.GRAY_90,
              textAlign: 'center',
              paddingHorizontal: 5,
            }}
            iconLeft={
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
              setOpenNewPatient(true);
            }}
            title="New Patient"
            textStyle={{
              flex: 1,
              color: COLORS.WHITE,
              textAlign: 'center',
              paddingHorizontal: 5,
            }}
            iconLeft={
              <FontAwesome5 name={'user-plus'} size={20} color={COLORS.WHITE} />
            }
            style={styles.primaryButton}
          />
        </View>
        {Boolean(recentPatients?.length) ? (
          <View
            style={{
              flex: 1,
              width: width,
            }}>
            <View
              style={{
                width: width - 60,
                marginHorizontal: 30,
                marginVertical: 10,
              }}>
              <Text
                style={[
                  styles.h1Label,
                  {
                    color: COLORS.GRAY_90,
                  },
                ]}>
                Your Recent Patients
              </Text>
            </View>
            <FlatList
             
              data = {recentPatients}
              keyExtractor ={(item)=>item.id.toString()}
              renderItem={({item, index}) => {
                return <PatientListItem  
                item={item} />;
              }}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              width: width,
              paddingHorizontal: 30,
              paddingVertical: 20,
            }}>
            <Text style={styles.h2Label}>
              You don’t have any entry yet. Start by adding a patient or new
              pain assessment.
            </Text>
          </View>
        )}
      </View>
      {/* Add Footer Here */}
      <Footer />
      <NewPatientPopUp
        open={openNewPatient}
        onClose={() => {
          setOpenNewPatient(false);
        }}
      />
    </View>
  );
};

export default HomeScreen;
