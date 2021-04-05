import { useRoute } from '@react-navigation/core';
import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Dimensions,
    Platform,
    StatusBar,
    ScrollView
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import CustomButton from '../../components/shared/CustomButton';
import { COLORS } from '../../constants/colors';
import { SCREEN_NAMES } from '../../constants/navigation';
import styles from './styles'
import Footer from '../../components/Footer';
import PatientDetailCard from './PatientDetailCard';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import NoEntryCard from './NoEntryCard';
import LatestEntryCard from './LatestEntryCard';
import SummaryChart from './SummaryChart';
import AllEntryCard from './AllEntryCard';

const { width, height } = Dimensions.get("window");


const PatientProfile = ({ navigation }) => {
    const params = useRoute()?.params
    const {
        item
    } = params
    const entry = false

    return (
        <View
            style={styles.body}
        >
            {Platform.OS === 'android' &&
                <StatusBar
                    backgroundColor={"transparent"}
                    barStyle="dark-content"
                    translucent
                />
            }
            <View
                style={styles.headingContainer}
            >
                <View
                    style={{
                        height: 50,
                        width: width,
                        marginHorizontal: 10,
                        justifyContent: 'center',
                        marginBottom: 10
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            top: 12,
                            zIndex: 1
                        }}
                    >
                        <CustomTouchableOpacity
                            onPress={() => {
                                navigation.goBack()
                            }}
                        >
                            <AntDesignIcon name={"arrowleft"} size={26} color={COLORS.GRAY_90} />
                        </CustomTouchableOpacity>
                    </View>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: COLORS.PRIMARY_MAIN,
                            fontSize: 24,
                            lineHeight: 30,
                            fontWeight: '400'
                        }}
                    >
                        Patient Profile
                    </Text>
                </View>
                <PatientDetailCard 
                    profile={item}
                />
            </View>

            <View
                style={{
                    flex: 1
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
                        onPress={() => { navigation.navigate(SCREEN_NAMES.PUPILLARY_DILATION) }}
                        title="New Assessment"
                        textStyle={{ color: COLORS.GRAY_90, textAlign: 'center', paddingHorizontal: 5 }}
                        iconRight={<MaterialCommunityIcons name={"clipboard-plus"} size={20} color={COLORS.GRAY_90} />}
                        style={styles.secondaryButton}
                    />
                    <CustomButton
                        onPress={() => { navigation.navigate(SCREEN_NAMES.NEW_MEDICATION) }}
                        title="Change Medication"
                        textStyle={{ color: COLORS.WHITE, textAlign: 'center', paddingHorizontal: 5 }}
                        iconRight={<FontAwesome5 name={"user-plus"} size={20} color={COLORS.WHITE} />}
                        style={styles.primaryButton}
                    />

                </View>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {Boolean(entry) ?
                        <NoEntryCard />:
                        <>
                            <LatestEntryCard />
                            <SummaryChart />
                            <AllEntryCard />
                        </>
                    }
                </ScrollView>
            </View>
            <Footer
            />
        </View>
    );
};

export default PatientProfile;
