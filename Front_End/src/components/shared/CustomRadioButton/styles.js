import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/colors";

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleSelected: {
        borderColor: COLORS.PRIMARY_MAIN,
    },
    circleUnSelected: {
        borderColor: COLORS.GRAY_80,
    },
    circleDisabled: {
        borderColor: COLORS.GRAY_60,
    },
    checkedCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        backgroundColor: COLORS.SECONDARY_MAIN,
        borderColor: COLORS.PRIMARY_MAIN
    },
    checkedCircleDisabled: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        backgroundColor: COLORS.GRAY_40,
        borderColor: COLORS.GRAY_60
    },
    label: {
        marginLeft: 12,
        fontSize: 16, 
        lineHeight: 24,
        color: COLORS.GRAY_90
    },
    labelDisabled: {
        marginLeft: 12,
        fontSize: 16, 
        lineHeight: 24,
        color: COLORS.GRAY_60
    }
});

export default styles;