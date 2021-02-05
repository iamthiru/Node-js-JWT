import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

const styles = StyleSheet.create({
    slide: {
        backgroundColor: COLORS.GRAY_30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        color: COLORS.PRIMARY_MAIN,
        fontSize: 48,
        fontWeight: '700',
        textAlign: "center"
    }
});

export default styles;