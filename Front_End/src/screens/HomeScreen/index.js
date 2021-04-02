import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    Platform,
    StatusBar,
    Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { COLORS } from '../../constants/colors';
import styles from './styles';
import ImageHeader from '../../assets/images/headerImage.png'
import CustomButton from '../../components/shared/CustomButton';
import { useSelector } from 'react-redux';
import Footer from '../../components/Footer';
import { FlatList } from 'react-native-gesture-handler';
import PatientListItem from './PatientListItem';
import NewPatientPopUp from './NewPatientPopUp';
import { SCREEN_NAMES } from '../../constants/navigation';

const { width, height } = Dimensions.get("window");


const HomeScreen = ({ navigation }) => {
    const allPatients = useSelector(state => state?.patient?.all)
    const [openNewPatient, setOpenNewPatient] = useState(false)

    return (
        <View style={styles.body}
        >
            {Platform.OS === 'android' &&
                <StatusBar
                    backgroundColor={"transparent"}
                    translucent
                />
            }
            <View
                style={styles.headingContainer}
            >
                <Image
                    source={ImageHeader}
                    style={{
                        height: height * 0.23,
                        width: width
                    }}
                />
                <View
                    style={styles.headingLabelContainer}
                >
                    <Text
                        style={styles.h1Label}
                    >
                        Good Morning,
                    </Text>
                    <Text
                        style={styles.hLabel}
                    >
                        Susan
                    </Text>
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    width: width
                }}
            >
                <View
                    style={{
                        paddingVertical: 20,
                        width: width,
                        alignItems: 'center'
                    }}
                >
                    <CustomButton
                        onPress={() => { navigation.navigate(SCREEN_NAMES.PAIN_ASSESSMENT) }}
                        title="New Pain Assessment"
                        textStyle={{ flex: 1, color: COLORS.GRAY_90, textAlign: 'center', paddingHorizontal: 5 }}
                        iconLeft={<MaterialCommunityIcons name={"clipboard-plus"} size={20} color={COLORS.GRAY_90} />}
                        style={styles.secondaryButton}
                    />
                    <CustomButton
                        onPress={() => { setOpenNewPatient(true) }}
                        title="New Patient"
                        textStyle={{ flex: 1, color: COLORS.WHITE, textAlign: 'center', paddingHorizontal: 5 }}
                        iconLeft={<FontAwesome5 name={"user-plus"} size={20} color={COLORS.WHITE} />}
                        style={styles.primaryButton}
                    />

                </View>
                {Boolean(allPatients?.length) ?
                    <View
                        style={{
                            flex: 1,
                            width: width
                        }}
                    >
                        <View
                            style={{
                                width: width - 60,
                                marginHorizontal: 30,
                                marginVertical: 10
                            }}
                        >
                            <Text
                                 style={[
                                     styles.h1Label,
                                     {
                                         color: COLORS.GRAY_90
                                     }
                                 ]}
                            >
                                Your Recent Patients
                            </Text>
                        </View>
                        <FlatList
                            data={allPatients}
                            renderItem={({ item }) => {
                                return (
                                    <PatientListItem
                                        item={item}
                                    />
                                )
                            }}
                        />
                    </View> :
                    <View
                        style={{
                            flex: 1,
                            width: width,
                            paddingHorizontal: 30,
                            paddingVertical: 20,
                        }}
                    >
                        <Text
                            style={styles.h2Label}
                        >
                            You don’t have any entry yet.
                            Start by adding a patient or new pain assessment.
                         </Text>
                    </View>
                }
            </View>
            {/* Add Footer Here */}
           <Footer />
           <NewPatientPopUp
                open={openNewPatient}
                onClose={() => {
                    setOpenNewPatient(false)
                }}
           />
        </View>
    );
};

export default HomeScreen;
