import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    useWindowDimensions,
    View
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import CustomDropDown from '../../components/shared/CustomDropDown';
import { COLORS } from '../../constants/colors';
import { SCREEN_NAMES } from '../../constants/navigation';
import CustomButton from '../../components/shared/CustomButton';
import { MEDICATION_CLASS, MEDICATION_NAME, UNITS, FREQUENCY } from './constants';
import CustomTextInput from '../../components/shared/CustomTextInput';

const NewMedication = () => {
    const window = useWindowDimensions()
    const { width } = window
    const navigation = useNavigation()
    const [frequency, setFrequency] = useState(null)
    const [medicationClass, setMedicationClass] = useState(null)
    const [unit, setUnit] = useState(null)
    const [unitValue, setUnitValue] = useState('')
    const [medicationName, setMedicationName] = useState(null)
    const [showmedicationInput, setShowMedicationInput] = useState(false)
    const [medicationInputName, setMedicationInputname] = useState('')
    const [errosState, setErrorState] = useState([])


    const validate = useCallback(() => {
        if(errosState?.length){
            return true
        }
        if(
            !frequency ||
            !medicationClass ||
            !unit ||
            !unitValue ||
            (showmedicationInput && !medicationInputName) ||
            !medicationName
        ){
            return true
        }
        return false
    }, [
        errosState,
        frequency,
        medicationClass,
        unit,
        unitValue,
        medicationName,
        medicationInputName,
        showmedicationInput,
    ])

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: COLORS.PRIMARY_MAIN,
            }}
        >
            {Platform.OS === 'android' &&
                <StatusBar
                    backgroundColor={COLORS.PRIMARY_MAIN}
                />
            }
            <View
                style={{
                    flex: 1,
                    width: window.width
                }}
            >
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
                        paddingVertical: 8
                    }}
                >
                    <CustomTouchableOpacity onPress={() => { navigation.goBack() }}><AntDesignIcon name={"arrowleft"} color={COLORS.WHITE} size={22} /></CustomTouchableOpacity>
                    <Text
                        style={{
                            fontSize: 20,
                            lineHeight: 28,
                            textAlign: "center",
                            color: COLORS.WHITE
                        }}
                    >
                        {SCREEN_NAMES.NEW_MEDICATION}
                    </Text>
                    <View
                        style={{
                            width: 22
                        }}
                    >
                        {//right icons
                        }
                    </View>
                </View>
                {/* ---  Header Ends --- */}
                {/* ---  Body Starts--- */}
                <View
                    style={{
                        flex: 1,
                        width: window.width,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        backgroundColor: COLORS.WHITE,
                        paddingHorizontal: 30
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginVertical: 16 }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    lineHeight: 14,
                                    color: COLORS.GRAY_80,
                                    fontWeight: "600",
                                    maxWidth: (width - 60)
                                }}
                            >
                                {"Answer from last assessment is preselected."}
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    lineHeight: 22,
                                    color: COLORS.GRAY_90,
                                    fontWeight: "700",
                                    maxWidth: (width - 60)
                                }}
                            >
                                {"Medication Class"}
                            </Text>
                        </View>

                        <CustomDropDown
                            items={MEDICATION_CLASS}
                            value={medicationClass}
                            onChangeValue={item => {
                                setMedicationClass(item.value)
                                setMedicationName(null)
                                if(showmedicationInput){
                                    setShowMedicationInput(false)
                                }
                            }}
                            containerStyle={{ marginBottom: 20, width: window.width * 0.8 }}
                            placeholder={"Choose a medication class"}
                        />

                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    lineHeight: 22,
                                    color: COLORS.GRAY_90,
                                    fontWeight: "700",
                                    maxWidth: (width - 60)
                                }}
                            >
                                {"Medication Name"}
                            </Text>
                        </View>
                        <CustomDropDown
                            items={MEDICATION_NAME.filter(item => {
                                return item.class === (medicationClass || 'other')
                            })}
                            value={medicationName}
                            onChangeValue={item => {
                                if(item.input){
                                    setMedicationInputname('')
                                    setShowMedicationInput(true)
                                } else if(showmedicationInput){
                                    setShowMedicationInput(false)
                                }
                                setMedicationName(item.value)
                            }}
                            containerStyle={{ marginBottom: showmedicationInput ? 10 : 20, width: window.width * 0.8 }}
                            placeholder={"Choose a medication name"}
                        />
                         {showmedicationInput &&
                             <CustomTextInput 
                                placeholder="Other Medication Name" 
                                value={medicationInputName} 
                                onChangeText={value => setMedicationInputname(value)} 
                                inputStyle={{ 
                                    width: 200,
                                    borderWidth: 0,
                                    backgroundColor: 'transparent'
                                }}
                                containerStyle={{
                                    borderWidth: 0,
                                    borderBottomWidth: 1,
                                    backgroundColor: COLORS.WHITE,
                                    height: 40,
                                    width: 200,
                                    marginBottom: 20
                                }} 
                                onBlur={() => {

                                }}
                            />
                        }

                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    lineHeight: 22,
                                    color: COLORS.GRAY_90,
                                    fontWeight: "700",
                                    maxWidth: (width - 60)
                                }}
                            >
                                {"Dosage"}
                            </Text>
                        </View>

                        <View
                            style={
                                {
                                    flexDirection: 'row'
                                }
                            }
                        >

                            <CustomTextInput 
                                placeholder="Number" 
                                value={unitValue} 
                                onChangeText={value => setUnitValue(value)} 
                                inputStyle={{ 
                                    width: 100,
                                    borderWidth: 0,
                                    backgroundColor: 'transparent'
                                }}
                                containerStyle={{
                                    borderRadius: 5,
                                    backgroundColor: COLORS.WHITE,
                                    borderWidth: 1,
                                    borderColor: COLORS.GRAY_80,
                                    height: 55,
                                    marginRight: 10
                                }} 
                                keyboardType="numeric"
                            />

                            <CustomDropDown
                                items={UNITS}
                                onChangeValue={item => {
                                    setUnit(item.value)
                                 }}
                                 value={unit}
                                placeholder={"Unit"}
                                containerStyle={{ marginBottom: 20 }}
                            />
                        </View>
                        <View style={{ width: (width - 60), alignItems: "flex-start", marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    lineHeight: 22,
                                    color: COLORS.GRAY_90,
                                    fontWeight: "700",
                                    maxWidth: (width - 60)
                                }}
                            >
                                {"Frequency And Time"}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    lineHeight: 20,
                                    color: COLORS.GRAY_90,
                                    fontWeight: "600",
                                    maxWidth: (width - 60)
                                }}
                            >
                                {"Frequency"}
                            </Text>
                        </View>
                        <CustomDropDown
                            items={FREQUENCY}
                            value={frequency}
                            onChangeValue={item => {
                                setFrequency(item.value)
                            }}
                            containerStyle={{ marginBottom: 20, width: window.width * 0.8 }}
                        />
                    </ScrollView>
                    <View
                        style={{
                            width: window.width - 60,
                            alignItems: 'center'
                        }}
                    >
                        <CustomButton
                            onPress={() => { }}
                            title="Submit"
                            textStyle={{ color: COLORS.GRAY_90, textAlign: 'center' }}
                            disabled={validate()}
                            style={{
                                width: ((window.width) * 0.6),
                                backgroundColor: validate() ? COLORS.SECONDARY_LIGHTER : COLORS.SECONDARY_MAIN,
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
}

export default NewMedication;

