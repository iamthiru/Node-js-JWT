import React, { useCallback, useState } from 'react'
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    Platform,
    Keyboard
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DeviceInfo from 'react-native-device-info';
import ReactNativeModal from 'react-native-modal';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import CustomTextInput from '../../components/shared/CustomTextInput';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';

import { COLORS } from '../../constants/colors';
import styles from './styles'
import { GENDER_OPTIONS, EYE_COLOR_OPTIONS } from '../../constants/patient';
import CustomDropDown from '../../components/shared/CustomDropDown';
import CustomButton from '../../components/shared/CustomButton';
import { useNavigation } from '@react-navigation/core';
import { SCREEN_NAMES } from '../../constants/navigation';
import { useDispatch } from 'react-redux';
import { PATIENT_ACTIONS } from '../../constants/actions';

const { width, height } = Dimensions.get("window");

const NewPatientPopUp = ({
    open,
    onClose
}) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [gender, setGender] = useState(null)
    const [eyeColor, setEyeColor] = useState(null)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [medicalRecord, setMedicalRecord] = useState('')
    const [errorState, setErrorState] = useState([])

    const validate = useCallback(() => {
        if(errorState?.length){
            return true
        }
        if(
            !lastName ||
            !firstName ||
            !gender ||
            !eyeColor ||
            !selectedDate 
        ){
            return true
        }
        return false
    }, [
        errorState,
        firstName,
        lastName,
        gender,
        eyeColor,
        selectedDate,
    ])

    const handleSubmit = useCallback(() => {
        dispatch({
            type: PATIENT_ACTIONS.ADD_PATIENT,
            payload: {
                id: parseInt(Math.random(10)*1000).toString(),
                firstName: firstName,
                time: `3:00 pm`,
                lastName: lastName,
                name: firstName + ' ' + lastName,
                gender: gender,
                dob: `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`,
                medicalRecord: medicalRecord,
                eyeColor: eyeColor
            }
        })
        if(onClose){
            onClose()
        }
    },[
        dispatch,
        firstName,
        lastName,
        gender,
        eyeColor,
        selectedDate,
        medicalRecord,
    ])

    return (
        <ReactNativeModal
            isVisible={open}
            deviceHeight={height}
            deviceWidth={width}
            animationIn='slideInUp'
            animationOut="slideOutDown"
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropOpacity={0.6}
            coverScreen={true}
            onStartShouldSetResponder={Keyboard.dismiss}
        >
            <View
                style={styles.popUpModal}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 15,
                        paddingVertical: 10
                    }}
                >
                    <CustomTouchableOpacity
                        onPress={() => {
                            if (onClose) {
                                onClose()
                            }
                            setGender(null)
                            setSelectedDate(null)
                        }}
                        style={{
                            borderBottomColor: COLORS.PRIMARY_MAIN,
                            borderBottomWidth: 1,
                            alignItems: 'center'
                        }}
                    >
                        <Text
                            style={[styles.h3Label,
                            {
                                color: COLORS.PRIMARY_MAIN,
                                marginRight: 0
                            }
                            ]}
                        >
                            Cancel
                   </Text>
                    </CustomTouchableOpacity>
                    <Text
                        style={[
                            styles.h12Label, {
                                color: COLORS.PRIMARY_MAIN,
                                fontWeight: '400'
                            }
                        ]}
                    >
                        New Patient
               </Text>
                    <CustomTouchableOpacity
                        style={{
                            borderBottomColor: COLORS.PRIMARY_MAIN,
                            borderBottomWidth: 1,
                            alignItems: 'center'
                        }}
                        disabled={validate()}
                        onPress={handleSubmit}
                    >
                        <Text
                            style={[styles.h3Label,
                            {
                                color: COLORS.PRIMARY_MAIN,
                                marginRight: 0,
                                fontWeight: '700'
                            }
                            ]}
                        >
                            Done
                   </Text>
                    </CustomTouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        width: width - 60,
                        marginHorizontal: 30
                    }}
                >
                    <ScrollView
                        style={{
                            marginTop: 20
                        }}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    lineHeight: 28,
                                    color: COLORS.GRAY_90,
                                    fontWeight: "400",
                                    maxWidth: (width - 60)
                                }}
                            >
                                {"Name*"}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                width: width - 60,
                                justifyContent: 'space-between'
                            }}
                        >
                            <CustomTextInput
                                placeholder="First"
                                onChangeText={value => { setFirstName(value) }}
                                value={firstName}
                                inputStyle={{
                                    width: (width - 60) / 2 - 20,
                                    borderWidth: 0,
                                    backgroundColor: 'transparent'
                                }}
                                containerStyle={{
                                    borderRadius: 5,
                                    backgroundColor: COLORS.WHITE,
                                    borderWidth: 1,
                                    borderColor: COLORS.GRAY_80,
                                    height: 55,
                                }}
                                onBlur={() => {

                                }}
                            />
                            <CustomTextInput
                                placeholder="Last"
                                onChangeText={value => { setLastName(value) }}
                                value={lastName}
                                inputStyle={{
                                    width: (width - 60) / 2 - 20,
                                    borderWidth: 0,
                                    backgroundColor: 'transparent'
                                }}
                                containerStyle={{
                                    borderRadius: 5,
                                    backgroundColor: COLORS.WHITE,
                                    borderWidth: 1,
                                    borderColor: COLORS.GRAY_80,
                                    height: 55,
                                }}
                                onBlur={() => {

                                }}
                            />
                        </View>

                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginTop: 10 }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    lineHeight: 28,
                                    color: COLORS.GRAY_90,
                                    fontWeight: "400",
                                    maxWidth: (width - 60)
                                }}
                            >
                                {"Date of Birth*"}
                            </Text>
                        </View>


                        <CustomTouchableOpacity
                            onPress={() => { setShowDatePicker(true) }}
                            style={{
                                width: width - 60,
                                height: 55,
                                borderWidth: 1,
                                borderRadius: 5,
                                borderColor: COLORS.GRAY_80,
                                backgroundColor: COLORS.WHITE,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: 10
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    lineHeight: 24,
                                    color: selectedDate ? COLORS.GRAY_90 : COLORS.GRAY_60
                                }}
                            >
                                {selectedDate ? `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}` : "Select a Date"}
                            </Text>
                            <AntDesignIcon name={"calendar"} size={15} color={COLORS.GRAY_90} />
                        </CustomTouchableOpacity>

                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginTop: 10 }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    lineHeight: 28,
                                    color: COLORS.GRAY_90,
                                    fontWeight: "400",
                                    maxWidth: (width - 60)
                                }}
                            >
                                {"Gender*"}
                            </Text>
                        </View>

                        <CustomDropDown
                            items={GENDER_OPTIONS}
                            value={gender}
                            onChangeValue={item => {
                                setGender(item.value)
                            }}
                            containerStyle={{ marginBottom: 10, width: width - 60 }}
                            placeholder={"Select One"}
                        />

                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginTop: 10 }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    lineHeight: 28,
                                    color: COLORS.GRAY_90,
                                    fontWeight: "400",
                                    maxWidth: (width - 60)
                                }}
                            >
                                {"Eye Color*"}
                            </Text>
                        </View>

                        <CustomDropDown
                            items={EYE_COLOR_OPTIONS}
                            value={eyeColor}
                            onChangeValue={item => {
                                setEyeColor(item.value)
                            }}
                            containerStyle={{ marginBottom: 10, width: width - 60 }}
                            placeholder={"Select One"}
                        />

                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center" }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    lineHeight: 28,
                                    color: COLORS.GRAY_90,
                                    fontWeight: "400",
                                    maxWidth: (width - 60)
                                }}
                            >
                                {"Medical Record"}
                            </Text>
                        </View>

                        <CustomTextInput
                            placeholder="Enter Number"
                            onChangeText={value => { setMedicalRecord(value) }}
                            value={medicalRecord}
                            inputStyle={{
                                width: (width - 60),
                                borderWidth: 0,
                                backgroundColor: 'transparent'
                            }}
                            containerStyle={{
                                borderRadius: 5,
                                backgroundColor: COLORS.WHITE,
                                borderWidth: 1,
                                borderColor: COLORS.GRAY_80,
                                height: 55,
                            }}
                            keyboardType="numeric"
                            onBlur={() => {

                            }}
                        />
                    </ScrollView>
                    <View
                        style={{
                            marginBottom: DeviceInfo.hasNotch() ? 60 : 40,
                            height: 100,
                            width: width - 60,
                            alignItems: 'center'
                        }}
                    >
                        <CustomButton
                            onPress={handleSubmit}
                            title="Confirm"
                            textStyle={{ color: COLORS.GRAY_90, textAlign: 'center' }}
                            disabled={validate()}
                            style={{
                                width: ((width) * 0.6),
                                backgroundColor: validate() ? COLORS.SECONDARY_LIGHTER : COLORS.PRIMARY_MAIN,
                                borderColor: COLORS.PRIMARY_MAIN,
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 10,
                            }}
                        />
                        <CustomTouchableOpacity
                            style={{
                                borderBottomColor: COLORS.PRIMARY_MAIN,
                                borderBottomWidth: 1,
                                alignItems: 'center',
                                marginTop: 10
                            }}
                            onPress={() => {
                                if(onClose){
                                    onClose()
                                }
                                navigation.navigate(SCREEN_NAMES.PATIENT_LIST)
                            }}
                        >
                            <Text
                                style={[styles.h3Label,
                                {
                                    color: COLORS.PRIMARY_MAIN,
                                    marginRight: 0,
                                    fontWeight: '700',
                                }
                                ]}
                            >
                                View Exisiting Patient Instead
                            </Text>
                        </CustomTouchableOpacity>
                    </View>
                </View>
            </View>

            <ReactNativeModal
                isVisible={showDatePicker && Platform.OS === 'ios'}
                onDismiss={() => setShowDatePicker(false)}
                onBackdropPress={() => setShowDatePicker(false)}
                animationIn="zoomIn"
                animationOut="zoomOut"
            >
                <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
                    <DateTimePicker
                        style={{ width: '100%' }}
                        value={selectedDate || new Date()}
                        mode={"date"}
                        maximumDate={new Date()}
                        display="inline"
                        onChange={(event, value) => {
                            if (showDatePicker) {
                                setSelectedDate(value)
                            }
                        }}
                    />
                </View>
            </ReactNativeModal>


            {Boolean(showDatePicker && Platform.OS === 'android') &&
                <DateTimePicker
                    value={selectedDate || new Date()}
                    mode={"date"}
                    maximumDate={new Date()}
                    display="default"
                    onChange={(event, value) => {
                        if (showDatePicker) {
                            setShowDatePicker(false)
                            setSelectedDate(value)
                        }
                    }}
                />}
        </ReactNativeModal>
    )
}

export default NewPatientPopUp;