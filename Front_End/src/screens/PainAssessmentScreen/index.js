import React, { useState } from 'react';
import {
    View,
    Text,
    Dimensions
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import GeneralStatusBar from '../../components/shared/GeneralStatusBar';
import ProgressBar from '../../components/shared/ProgressBar';
import { COLORS } from '../../constants/colors';
import { SCREEN_NAMES } from '../../constants/navigation';
import PainQuality from './PainQuality';
import VerbalAbility from './VerbalAbility';
import PainLocation from './PainLocation';
import NRSScore from './NRSScore';
import styles from './styles';
import PainTiming from './PainTiming';
import { VERBAL_ABILITY } from '../../constants/painAssessment';

const { width, height } = Dimensions.get("window");


const PainAssessmentScreen = ({ navigation }) => {

    const [currentStep, setCurrentStep] = useState(1);

    const [verbalAbility, setVerbalAbility] = useState(VERBAL_ABILITY.VERBAL.value);

    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
    };

    const gotoNext = () => {
        setCurrentStep(currentStep === 5 ? 1 : (currentStep + 1))
    }

    const gotoPrevious = () => {
        setCurrentStep(currentStep - 1)
    }

    const closeScreen = () => {
        navigation.goBack()
    }

    const getHeading = () => {
        switch (currentStep) {
            case 1:
                return "Verbal or Not";
            case 2:
                return "NRS Score";
            case 3:
                return "Location";
            case 4:
                return "Pain Quality";
            case 5:
                return "Time";
            default:
                return "-"
        }
    }

    return (
        <View style={styles.body}>
            <GeneralStatusBar backgroundColor={COLORS.PRIMARY_MAIN} barStyle="light-content" />
            <View style={{ width: width, paddingVertical: 12, backgroundColor: COLORS.PRIMARY_MAIN, borderBottomWidth: 2, borderBottomColor: COLORS.SECONDARY_DARKER }}>
                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', marginBottom: 12, width: width, paddingHorizontal: 16 }}>
                    <CustomTouchableOpacity onPress={closeScreen}><AntDesignIcon name={"arrowleft"} color={COLORS.WHITE} size={22} /></CustomTouchableOpacity>
                    <Text style={{ fontSize: 20, lineHeight: 28, textAlign: "center", color: COLORS.WHITE }}>{getHeading()}</Text>
                    <CustomTouchableOpacity onPress={closeScreen}><AntDesignIcon name={"close"} color={COLORS.WHITE} size={22} /></CustomTouchableOpacity>
                </View>

                <View style={{ width: width - 32, height: 10, marginBottom: 6, marginHorizontal: 16 }}>
                    <ProgressBar currentStep={currentStep} totalSteps={10} width={width - 32} containerStyle={{ width: width - 32 }} indicatorStyle={{ width: width - 32 }} />
                </View>

                <Text style={{ marginLeft: 25, fontSize: 12, lineHeight: 16, fontWeight: "700", color: COLORS.WHITE }}>{`Step ${currentStep} of 10`}</Text>
            </View>
            {currentStep === 1 && <VerbalAbility gotoNext={gotoNext} verbalAbility={verbalAbility} setVerbalAbility={setVerbalAbility} />}
            {currentStep === 2 && <NRSScore gotoNext={gotoNext} gotoPrevious={gotoPrevious} verbalAbility={verbalAbility} />}
            {currentStep === 3 && <PainLocation gotoNext={gotoNext} gotoPrevious={gotoPrevious} />}
            {currentStep === 4 && <PainQuality gotoNext={gotoNext} gotoPrevious={gotoPrevious} />}
            {currentStep === 5 && <PainTiming gotoNext={gotoNext} gotoPrevious={gotoPrevious} />}
        </View>
    );
};

export default PainAssessmentScreen;
