import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    Platform
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants/colors';
import CustomButton from '../../components/shared/CustomButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { PAIN_LOCATIONS } from '../../constants/painAssessment';
import CustomDropDown from '../../components/shared/CustomDropDown';

const { width, height } = Dimensions.get("window");


const StepThree = ({ gotoNext, gotoPrevious }) => {

    const [painLocation, setPainLocation] = useState(PAIN_LOCATIONS[0].value);

    const handlePrevious = () => {
        gotoPrevious();
    }

    const handleContinue = () => {
        gotoNext();
    }

    return (
        <>
            <Text style={{ width: width, textAlign: 'left', paddingLeft: 30, fontSize: 12, lineHeight: 16, color: COLORS.GRAY_80, marginTop: 11, marginBottom: 5 }}>
                {"Answer from last assessment is preselected"}
            </Text>

            <View style={{ width: width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.PRIMARY_MAIN, backgroundColor: COLORS.WHITE, paddingHorizontal: 30, paddingVertical: 20, marginBottom: 12, ...(Platform.OS !== 'android' && { zIndex: 10}) }}>
                <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 16 }}>
                    <Text style={{ fontSize: 16, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60) }}>{"What is the location of the pain?"}</Text>
                </View>
                <CustomDropDown
                    items={PAIN_LOCATIONS}
                    value={painLocation}
                    onChangeValue={item => setPainLocation((item && item.value) ? item.value : PAIN_LOCATIONS[0].value)}
                    containerStyle={{ marginBottom: 44 }}
                />
            </View>

            <View style={{ flex: 1, flexDirection: "row", width: width, paddingHorizontal: 13, marginBottom: 15 + (Platform.OS === "ios" ? getStatusBarHeight() : 0), alignItems: "flex-end", justifyContent: "space-between" }}>
                <CustomButton
                    onPress={() => handlePrevious()}
                    title="Previous"
                    textStyle={{ color: COLORS.GRAY_90 }}
                    type="secondary"
                    style={{ width: ((width - 16 - 16 - 75) / 2), backgroundColor: COLORS.WHITE }}
                    iconLeft={<AntDesignIcon name={"arrowleft"} size={16} color={COLORS.GRAY_90} />}
                />
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

export default StepThree;
