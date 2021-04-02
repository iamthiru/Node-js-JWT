
import React from 'react'
import { View, Dimensions, Text, StyleSheet, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info'
import CustomTouchableOpacity from './shared/CustomTouchableOpacity';
import { COLORS } from '../constants/colors';
import { SCREEN_NAMES } from '../constants/navigation';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({

})


const Footer = () => {
    const route = useRoute()
    const navigation = useNavigation()

    return (
        <View
            style={{
                marginHorizontal: 10,
                width: width - 20,
                borderWidth: 1,
                borderRadius: 10,
                height: height * 0.08,
                minHeight: 60,
                maxHeight: 70,
                marginTop: 5,
                marginBottom: DeviceInfo.hasNotch() ? 30 : 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: COLORS.WHITE,
                shadowColor: COLORS.GRAY_60,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
            }}
        >
            <View
                style={{
                    height: '100%',
                    flexDirection: 'row',
                    width: (width - 20) * 0.4,
                    justifyContent: 'space-evenly',
                    alignItems: 'center'
                }}
            >
                <CustomTouchableOpacity
                    onPress={() => {
                        navigation.navigate(SCREEN_NAMES.HOME)
                    }}
                    style={{
                        flex: 1,
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: Platform.OS === 'android' ? 0 : 4,
                        borderBottomColor: COLORS.PRIMARY_MAIN,
                        borderBottomWidth: route?.name === SCREEN_NAMES.HOME ? 3 : 0,
                        marginLeft: Platform.OS === 'android' ? 4 : 0
                    }}
                >
                    <FontAwesome5
                        name={"home"} size={30} color={route?.name === SCREEN_NAMES.HOME ? COLORS.PRIMARY_MAIN : COLORS.GRAY_90}
                    />
                    <Text
                        style={[
                            {
                                lineHeight: 17
                            },
                            {
                                color: route?.name === SCREEN_NAMES.HOME ? COLORS.PRIMARY_MAIN : COLORS.GRAY_90
                            }
                        ]}
                    >
                        Home
                    </Text>
                </CustomTouchableOpacity>
                <CustomTouchableOpacity
                    onPress={() => {
                        navigation.navigate(SCREEN_NAMES.PATIENT_LIST)
                    }}
                    style={{
                        flex: 1,
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 4,
                        borderBottomColor: COLORS.PRIMARY_MAIN,
                        borderBottomWidth: route?.name.includes('Patient') ? 3 : 0
                    }}
                >
                    <AntDesignIcon
                        name={"contacts"} size={30} color={route?.name.includes('Patient') ? COLORS.PRIMARY_MAIN : COLORS.GRAY_90}
                    />
                    <Text
                        style={[
                            {

                            },
                            {
                                color: route?.name.includes('Patient') ? COLORS.PRIMARY_MAIN : COLORS.GRAY_90
                            }
                        ]}
                    >
                        Patients
                    </Text>
                </CustomTouchableOpacity>
            </View>
            <View
                style={{
                    height: '100%',
                    flexDirection: 'row',
                    width: (width - 20) * 0.4,
                    justifyContent: 'space-evenly',
                    alignItems: 'center'
                }}
            >
                <CustomTouchableOpacity
                    onPress={() => {
                        navigation.navigate(SCREEN_NAMES.SCHEDULE)
                    }}
                    style={{
                        flex: 1,
                        height: '100%',
                        paddingHorizontal: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomColor: COLORS.PRIMARY_MAIN,
                        borderBottomWidth: route?.name === SCREEN_NAMES.SCHEDULE ? 3 : 0
                    }}
                >
                    <FontAwesome5
                        name={"calendar"} size={30} color={route?.name === SCREEN_NAMES.SCHEDULE ? COLORS.PRIMARY_MAIN : COLORS.GRAY_90}
                    />
                    <Text
                        style={[
                            {

                            },
                            {
                                color: route?.name === SCREEN_NAMES.SCHEDULE ? COLORS.PRIMARY_MAIN : COLORS.GRAY_90
                            }
                        ]}
                    >
                        Schedule
                    </Text>
                </CustomTouchableOpacity>
                <CustomTouchableOpacity
                    onPress={() => {
                        navigation.navigate(SCREEN_NAMES.SETTINGS)
                    }}
                    style={{
                        flex: 1,
                        height: '100%',
                        paddingHorizontal: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomColor: COLORS.PRIMARY_MAIN,
                        borderBottomWidth: route?.name === SCREEN_NAMES.SETTINGS ? 3 : 0,
                        marginRight: Platform.OS === 'android' ? 4 : 0
                    }}
                >
                    <AntDesignIcon
                        name={"setting"} size={30} color={route?.name === SCREEN_NAMES.SETTINGS ? COLORS.PRIMARY_MAIN : COLORS.GRAY_90}
                    />
                    <Text
                        style={[
                            {

                            },
                            {
                                color: route?.name === SCREEN_NAMES.SETTINGS ? COLORS.PRIMARY_MAIN : COLORS.GRAY_90
                            }
                        ]}
                    >
                        Settings
                    </Text>
                </CustomTouchableOpacity>
            </View>
            <View
                style={{
                    position: 'absolute',
                    top: -30,
                    left: (width - 20) / 2 - 30,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: COLORS.SECONDARY_MAIN,
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: COLORS.GRAY_60,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                }}
            >
                <CustomTouchableOpacity
                    style={{
                        width: 60,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <AntDesignIcon
                        name={"plus"} size={30} color={COLORS.GRAY_90}
                    />
                </CustomTouchableOpacity>
            </View>
        </View>
    )
}

export default Footer;
