import { Platform, StyleSheet } from "react-native";
import { Dimensions } from 'react-native';
import { COLORS } from "../../constants/colors";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        width: width,
        backgroundColor: COLORS.GRAY_10,
        alignItems: "center",
        justifyContent: "center"
    },
    headingContainer: {
        height: height * 0.22,
        justifyContent: 'flex-end',
        minHeight: 140,
        maxHeight: 150,
        width: width,
        marginTop: Platform.OS === 'android' ? -20 : 0,
        backgroundColor: COLORS.WHITE,
        borderBottomColor: COLORS.BLACK,
        borderBottomWidth: 1,
        marginBottom: 10
    },
    secondaryButton: {
        width: (width) * 0.6,
        backgroundColor: COLORS.SECONDARY_MAIN,
        borderColor: COLORS.PRIMARY_MAIN,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        height: 48
    },
    primaryButton: {
        width: (width) * 0.6,
        backgroundColor: COLORS.PRIMARY_MAIN,
        borderColor: COLORS.PRIMARY_MAIN,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48
    },
    patientCardContainer: {
        backgroundColor: COLORS.WHITE,
        width: width,
        borderColor: COLORS.PRIMARY_MAIN,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        marginVertical: 10
    }
});

export default styles;