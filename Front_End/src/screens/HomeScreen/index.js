import React from 'react';
import {
    View,
    Text,
    Dimensions
} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import { SCREEN_NAMES } from '../../constants/navigation';
import styles from './styles';

const { width, height } = Dimensions.get("window");


const HomeScreen = ({ navigation }) => {

    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
    };

    return (
        <View style={styles.body}>
            <CustomTouchableOpacity 
                style={{ backgroundColor: "#0E5F81", borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, width: width - 60, paddingHorizontal: 28, marginBottom: 30 }}
                onPress={() => navigateToScreen(SCREEN_NAMES.PUPILLARY_DILATION)}
            >
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF", textAlign: "center" }}>{"CAPTURE EYE"}</Text>
            </CustomTouchableOpacity>
            <CustomTouchableOpacity 
                style={{ backgroundColor: "#0E5F81", borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, width: width - 60, paddingHorizontal: 28, marginBottom: 30 }}
                onPress={() => navigateToScreen(SCREEN_NAMES.FACIAL_EXPRESSION)}
            >
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF", textAlign: "center" }}>{"CAPTURE FACE"}</Text>
            </CustomTouchableOpacity>
            <CustomTouchableOpacity 
                style={{ backgroundColor: "#0E5F81", borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, width: width - 60, paddingHorizontal: 28, marginBottom: 30 }}
                onPress={() => navigateToScreen(SCREEN_NAMES.PAIN_ASSESSMENT)}
            >
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF", textAlign: "center" }}>{"PAIN ASSESSMENT"}</Text>
            </CustomTouchableOpacity>
            <CustomTouchableOpacity 
                style={{ backgroundColor: "#0E5F81", borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, width: width - 60, paddingHorizontal: 28 }}
                onPress={() => navigateToScreen(SCREEN_NAMES.NEW_MEDICATION)}
            >
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF", textAlign: "center" }}>{"New Medication"}</Text>
            </CustomTouchableOpacity>
        </View>
    );
};

export default HomeScreen;
