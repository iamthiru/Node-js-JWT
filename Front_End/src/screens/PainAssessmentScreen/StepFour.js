import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    Platform
} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants/colors';
import CustomButton from '../../components/shared/CustomButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { PAIN_LOCATIONS, PAIN_QUALITIES } from '../../constants/painAssessment';
import CustomCheckBox from '../../components/shared/CustomCheckBox';

const { width, height } = Dimensions.get("window");


const StepFour = ({ gotoNext, gotoPrevious }) => {

    const [selectedPainQualities, setSelectedPainQualities] = useState([]);

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

            <View style={{ width: width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.PRIMARY_MAIN, backgroundColor: COLORS.WHITE, paddingHorizontal: 30, paddingVertical: 20, marginBottom: 12 }}>
                <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 5 }}>
                    <Text style={{ fontSize: 16, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60 - 15 - 15) }}>{"What is the quality of the pain?"}</Text>
                    <CustomTouchableOpacity style={{ marginLeft: 15 }}>
                        <AntDesignIcon name={"questioncircle"} size={15} color={COLORS.PRIMARY_MAIN} />
                    </CustomTouchableOpacity>
                </View>
                <Text style={{ fontSize: 14, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60), marginBottom: 12 }}>{"Choose all that applies"}</Text>

                {PAIN_QUALITIES.map((item, index) => {
                    return (
                        <CustomCheckBox
                            key={index}
                            label={item.label}
                            value={selectedPainQualities.includes(item.value)}
                            onValueChange={value => {
                                if (value) {
                                    setSelectedPainQualities([...selectedPainQualities, item.value])
                                }
                                else {
                                    let qualities = [...selectedPainQualities]
                                    qualities.splice(qualities.indexOf(item.value), 1);
                                    setSelectedPainQualities(qualities);
                                }
                            }}
                            containerStyle={{ flexDirection: "row", width: width - 60, marginBottom: 16 }} />
                    )
                })
                }

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

export default StepFour;
