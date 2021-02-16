import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    Image,
    ScrollView,
    Platform
} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants/colors';
import CustomButton from '../../components/shared/CustomButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ScoreSlider from '../../components/shared/ScoreSlider';
import { VERBAL_ABILITY } from '../../constants/painAssessment';
import { getPainScoreImage, getPainScoreDescription } from '../../helpers/painAssessment';

const { width, height } = Dimensions.get("window");


const NRSScore = ({ gotoNext, gotoPrevious, verbalAbility }) => {

    const [currentPain, setCurrentPain] = useState(0);
    const [mostPain, setMostPain] = useState(0);
    const [leastPain, setLeastPain] = useState(0);
    const [nonVerbalPainScore, setNonVerbalPainScore] = useState(0);

    const handlePrevious = () => {
        gotoPrevious();
    }

    const handleContinue = () => {
        gotoNext();
    }

    return (
        <>
            <ScrollView>
                {verbalAbility !== VERBAL_ABILITY.NON_VERBAL.value && <View style={{ height: 24, width: width, paddingHorizontal: 30, backgroundColor: COLORS.SECONDARY_LIGHTER, justifyContent: "center", marginTop: 5 }}>
                    <Text style={{ textAlign: "left", fontSize: 12, lineHeight: 16, color: COLORS.GRAY_90 }}>{"* 0 is no pain. 10 is the most pain"}</Text>
                </View>}

                {verbalAbility === VERBAL_ABILITY.NON_VERBAL.value && <View style={{ width: width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.PRIMARY_MAIN, backgroundColor: COLORS.WHITE, paddingHorizontal: 30, paddingVertical: 20 }}>
                    <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 20 }}>
                        <Text style={{ fontSize: 16, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60 - 15 - 15) }}>{"What is the patient’s current pain score?"}</Text>
                        <CustomTouchableOpacity style={{ marginLeft: 15 }}>
                            <AntDesignIcon name={"questioncircle"} size={15} color={COLORS.PRIMARY_MAIN} />
                        </CustomTouchableOpacity>
                    </View>

                    {[0, 2, 4, 6, 8, 10].map((score, index) => (
                        <CustomTouchableOpacity onPress={() => setNonVerbalPainScore(score)}>
                            <View style={{ width: width - 60, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: "center", backgroundColor: (score === nonVerbalPainScore? COLORS.GRAY_10 : "transparent"), borderWidth: (score === nonVerbalPainScore? 1 : 0), borderColor: COLORS.PRIMARY_DARKER, borderRadius: 5 }}>
                                <Image style={{ width: 45, height: 45, marginRight: 16 }} source={getPainScoreImage(score)} />
                                <Text style={{ fontSize: 24, lineHeight: 29, color: COLORS.GRAY_90, marginRight: 12 }}>{score}</Text>
                                <Text style={{ fontSize: 14, lineHeight: 20, color: COLORS.GRAY_90 }}>{getPainScoreDescription(score)}</Text>
                            </View>
                        </CustomTouchableOpacity>
                    ))}
                </View>}

                {verbalAbility !== VERBAL_ABILITY.NON_VERBAL.value && <>
                    <View style={{ width: width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.PRIMARY_MAIN, backgroundColor: COLORS.WHITE, paddingHorizontal: 30, paddingVertical: 20, marginBottom: 12 }}>
                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 16 }}>
                            <Text style={{ fontSize: 16, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60 - 15 - 15) }}>{"What is the patient’s current pain score?"}</Text>
                            <CustomTouchableOpacity style={{ marginLeft: 15 }}>
                                <AntDesignIcon name={"questioncircle"} size={15} color={COLORS.PRIMARY_MAIN} />
                            </CustomTouchableOpacity>
                        </View>
                        <ScoreSlider sliderWidth={width - 90} value={currentPain} onValueChange={value => setCurrentPain(value)} />
                    </View>

                    <View style={{ width: width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.PRIMARY_MAIN, backgroundColor: COLORS.WHITE, paddingHorizontal: 30, paddingVertical: 20, marginBottom: 12 }}>
                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 16 }}>
                            <Text style={{ fontSize: 16, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60 - 15 - 15) }}>{"What’s the LEAST Pain in the past 24 h?"}</Text>
                            <CustomTouchableOpacity style={{ marginLeft: 15 }}>
                                <AntDesignIcon name={"questioncircle"} size={15} color={COLORS.PRIMARY_MAIN} />
                            </CustomTouchableOpacity>
                        </View>
                        <ScoreSlider sliderWidth={width - 90} value={leastPain} onValueChange={value => setLeastPain(value)} />
                    </View>

                    <View style={{ width: width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.PRIMARY_MAIN, backgroundColor: COLORS.WHITE, paddingHorizontal: 30, paddingVertical: 20, marginBottom: 12 }}>
                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 16 }}>
                            <Text style={{ fontSize: 16, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60 - 15 - 15) }}>{"What’s the MOST Pain in the past 24 h?"}</Text>
                            <CustomTouchableOpacity style={{ marginLeft: 15 }}>
                                <AntDesignIcon name={"questioncircle"} size={15} color={COLORS.PRIMARY_MAIN} />
                            </CustomTouchableOpacity>
                        </View>
                        <ScoreSlider sliderWidth={width - 90} value={mostPain} onValueChange={value => setMostPain(value)} />
                    </View>
                </>}
            </ScrollView>

            <View style={{ flexDirection: "row", width: width, paddingHorizontal: 13, marginBottom: 15 + (Platform.OS === "ios" ? getStatusBarHeight() : 0), marginTop: 10, alignItems: "flex-end", justifyContent: "space-between" }}>
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

export default NRSScore;
