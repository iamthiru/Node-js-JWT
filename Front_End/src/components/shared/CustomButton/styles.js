import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/colors";

const styles = StyleSheet.create({
    btnStyle: { 
        height: 48, 
        borderRadius: 10, 
        alignItems: "center", 
        justifyContent: "center", 
    },
    primaryBtn: {
        backgroundColor: COLORS.PRIMARY_MAIN,
        shadowColor: "#28293d", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.25, 
        shadowRadius: 4, 
        elevation: 5 
    },
    secondaryBtn: {
        borderWidth: 2,
        borderColor: COLORS.PRIMARY_MAIN
    },
    btnTextStyle: { 
        fontSize: 14, 
        fontWeight: "700", 
        textAlign: "center",
        textTransform: "uppercase"
    },
    primaryBtnText: {
        color: COLORS.WHITE, 
    },
    secondaryBtnText: {
        color: COLORS.GRAY_90
    }
});

export default styles;