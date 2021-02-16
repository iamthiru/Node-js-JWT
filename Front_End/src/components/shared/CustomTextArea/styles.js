import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/colors";

const styles = StyleSheet.create({
    container: { display: "flex", paddingBottom: 16 },
    label: { fontSize: 12, color: COLORS.GRAY_90, lineHeight: 16, marginBottom: 5 },
    required: { fontSize: 12, color: COLORS.STATE_ERROR, marginBottom: 5 },
    error: { fontSize: 10, color: COLORS.STATE_ERROR, lineHeight: 16, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1.5, minWidth: 100 },
    helper: { fontSize: 10, color: COLORS.GRAY_80, lineHeight: 16, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1.5, minWidth: 100 },
    txtInput: { height: 150, borderRadius: 5, backgroundColor: COLORS.WHITE, borderColor: COLORS.GRAY_80, borderWidth: 1, minWidth: 100, paddingHorizontal: 16, paddingTop: 16, color: COLORS.GRAY_90, fontSize: 16 }
});

export default styles;