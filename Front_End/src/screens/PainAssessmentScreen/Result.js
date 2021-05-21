import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants/colors';
import { formatAMPM } from '../../utils/date';

import {useSelector} from 'react-redux'

const { width, height } = Dimensions.get("window");


const Result = (props) => {

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date()); 


    const hideDateTimePickers = () => {
        setShowDatePicker(false); 
        setShowTimePicker(false);
    }

    return (
        <>
            <ScrollView style={{ backgroundColor: COLORS.WHITE}}>
                <View style={{ width: width, paddingHorizontal: 30, paddingVertical: 13 }}>
                    <View style={{ flexDirection: 'row', width: width - 60, alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <Text style={{ color: COLORS.GRAY_90, fontSize: 16, lineHeight: 22, fontWeight: "700" }}>Patient:</Text>
                        <CustomTouchableOpacity onPressIn={() => { }}>
                            <View style={{ flexDirection: "row", width: ((width / 2) - 60), height: 36, borderRadius: 5, backgroundColor: COLORS.WHITE, borderColor: COLORS.GRAY_80, borderWidth: 1, minWidth: 100, paddingVertical: 6, paddingLeft: 16, paddingRight: 7.5, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16, lineHeight: 24, color: COLORS.GRAY_90 }}>{"John Doe"}</Text>
                                <AntDesignIcon name={"arrowright"} size={15} color={COLORS.GRAY_90} />
                            </View>
                        </CustomTouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', width: width - 60, alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <Text style={{ color: COLORS.GRAY_90, fontSize: 16, lineHeight: 22, fontWeight: "700" }}>Assessment Date:</Text>
                        <CustomTouchableOpacity onPressIn={() => { setShowDatePicker(true) }}>
                            <View style={{ flexDirection: "row", width: ((width / 2) - 60), height: 36, borderRadius: 5, backgroundColor: COLORS.WHITE, borderColor: COLORS.GRAY_80, borderWidth: 1, minWidth: 100, paddingVertical: 6, paddingLeft: 16, paddingRight: 7.5, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16, lineHeight: 24, color: COLORS.GRAY_90 }}>{selectedDate ? `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}` : ""}</Text>
                                <AntDesignIcon name={"calendar"} size={15} color={COLORS.GRAY_90} />
                            </View>
                        </CustomTouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', width: width - 60, alignItems: "center", justifyContent: "space-between", marginBottom: 44 }}>
                        <Text style={{ color: COLORS.GRAY_90, fontSize: 16, lineHeight: 22, fontWeight: "700" }}>Assessment Time:</Text>
                        <CustomTouchableOpacity onPressIn={() => { setShowTimePicker(true) }}>
                            <View style={{ flexDirection: "row", width: ((width / 2) - 60), height: 36, borderRadius: 5, backgroundColor: COLORS.WHITE, borderColor: COLORS.GRAY_80, borderWidth: 1, minWidth: 100, paddingVertical: 6, paddingLeft: 16, paddingRight: 7.5, alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 16, lineHeight: 24, color: COLORS.GRAY_90 }}>{selectedTime ? `${formatAMPM(selectedTime)}` : ""}</Text>
                                <AntDesignIcon name={"caretdown"} size={15} color={COLORS.GRAY_90} />
                            </View>
                        </CustomTouchableOpacity>
                    </View>

                    <Text style={{ width: width - 60, fontSize: 16, lineHeight: 22, fontWeight: "700" }}>Result</Text>
                    <View style={{ width: width - 90, height: 1, backgroundColor: COLORS.PRIMARY_MAIN, marginBottom: 23 }}></View>

                    <Text style={{ fontSize: 14, lineHeight: 22, fontWeight: "700" }}>Impact Score:</Text>

                </View>
            </ScrollView>

            {Platform.OS === "ios" && (showDatePicker || showTimePicker) &&
                <Modal isVisible={(showDatePicker || showTimePicker)} onDismiss={() => hideDateTimePickers()} onBackdropPress={() => hideDateTimePickers()}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <DateTimePicker
                            style={{ width: '100%', backgroundColor: 'white' }}
                            value={showDatePicker ? selectedDate : selectedTime}
                            mode={showDatePicker ? "date" : "time"}
                            display="default"
                            onChange={(event, value) => {
                                if (showDatePicker) {
                                    setSelectedDate(value)
                                }
                                else {
                                    setSelectedTime(value)
                                }
                            }}
                        />
                    </View>
                </Modal>
            }

            {Platform.OS === "android" && (showDatePicker || showTimePicker) && <DateTimePicker
                value={showDatePicker ? selectedDate : selectedTime}
                mode={showDatePicker ? "date" : "time"}
                display="default"
                onChange={(event, value) => {
                    if (showDatePicker) {
                        setShowDatePicker(false);
                        if (value) {
                            setSelectedDate(value)
                        }
                    }
                    else {
                        setShowTimePicker(false);
                        if (value) {
                            setSelectedTime(value)
                        }
                    }
                }}
            />}
        </>
    );
};

export default Result;
