import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/colors";

const styles = StyleSheet.create({
    btnStyle: { 
        height: 48, 
        borderRadius: 10, 
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "space-between", 
        paddingHorizontal: 16
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
    teritaryBtn:{
        color:COLORS.GRAY_90,
    },
    secondaryBtnText: {
        color: COLORS.GRAY_90
    },
    teritaryBtnView:{
        borderWidth: 2,
        borderColor: COLORS.PRIMARY_MAIN
    }
});

export default styles;