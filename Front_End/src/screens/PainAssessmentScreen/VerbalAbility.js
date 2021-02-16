import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    Platform,
    ScrollView
} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants/colors';
import CustomRadioButton from '../../components/shared/CustomRadioButton';
import CustomButton from '../../components/shared/CustomButton';
import CustomTextInput from '../../components/shared/CustomTextInput';
import { VERBAL_ABILITY } from '../../constants/painAssessment';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const { width, height } = Dimensions.get("window");


const VerbalAbility = ({ gotoNext }) => {

    const [verbalAbility, setVerbalAbility] = useState(VERBAL_ABILITY.VERBAL);
    const [otherText, setOtherText] = useState("");

    const handleContinue = () => {
        gotoNext();
    }

    return (
        <>
            <ScrollView>
                <Text style={{ width: width, textAlign: 'left', paddingLeft: 30, fontSize: 12, lineHeight: 16, color: COLORS.GRAY_80, marginTop: 16, marginBottom: 20 }}>
                    {"Answer from last assessment is preselected"}
                </Text>

                <View style={{ width: width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.PRIMARY_MAIN, backgroundColor: COLORS.WHITE, paddingHorizontal: 30, paddingVertical: 20 }}>
                    <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 20 }}>
                        <Text style={{ fontSize: 16, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60 - 15 - 15) }}>{"Is this patient currently verbal or not ?"}</Text>
                        <CustomTouchableOpacity style={{ marginLeft: 15 }}>
                            <AntDesignIcon name={"questioncircle"} size={15} color={COLORS.PRIMARY_MAIN} />
                        </CustomTouchableOpacity>
                    </View>
                    <CustomRadioButton containerStyle={{ marginBottom: 15 }} label="Verbal" selected={verbalAbility === VERBAL_ABILITY.VERBAL} onPress={() => setVerbalAbility(VERBAL_ABILITY.VERBAL)} />
                    <CustomRadioButton containerStyle={{ marginBottom: 15 }} label="Non Verbal" selected={verbalAbility === VERBAL_ABILITY.NON_VERBAL} onPress={() => setVerbalAbility(VERBAL_ABILITY.NON_VERBAL)} />
                    <View style={{ flexDirection: "row", width: (width - 60) }}>
                        <CustomRadioButton label="Other" selected={verbalAbility === VERBAL_ABILITY.OTHER} onPress={() => setVerbalAbility(VERBAL_ABILITY.OTHER)} />
                        <CustomTextInput value={otherText} onChangeText={value => setOtherText(value)} containerStyle={{ paddingBottom: 0, marginLeft: 8 }} inputStyle={{ height: 24, borderRadius: 0, borderWidth: 0, borderBottomWidth: 1, paddingLeft: 0 }} />
                    </View>
                </View>
            </ScrollView>
            <View style={{ width: width, paddingHorizontal: 13, marginBottom: 15 + (Platform.OS === "ios" ? getStatusBarHeight() : 0), marginTop: 10, alignItems: "flex-end", justifyContent: 'flex-end' }}>
                <CustomButton
                    onPress={() => handleContinue()}
                    title="Continue"
                    textStyle={{ color: COLORS.GRAY_90 }}
                    style={{ width: ((width - 16 - 16 - 75) / 2), backgroundColor: COLORS.SECONDARY_MAIN, borderColor: COLORS.PRIMARY_MAIN, borderWidth: 1 }}
                    iconRight={<AntDesignIcon name={"arrowright"} size={16} color={COLORS.GRAY_90} />}
                />
            </View>
        </>
    );
};

export default VerbalAbility;