import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/colors";

const styles = StyleSheet.create({
    checkBoxStyle: { 
        width: 24,
        height: 24
    },
    labelStyle: {
        fontSize: 16, 
        color: COLORS.GRAY_90, 
        lineHeight: 24,
        marginLeft: 12
    },
    disabledLabelStyle: {
        fontSize: 16, 
        color: COLORS.GRAY_60, 
        lineHeight: 24,
        marginLeft: 12
    }
});

export default styles;