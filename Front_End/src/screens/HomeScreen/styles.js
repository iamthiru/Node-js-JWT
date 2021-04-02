import { Platform, StyleSheet } from "react-native";
import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info'
import { COLORS } from "../../constants/colors";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "flex-start"
    },
    headingContainer: {
        height: height * 0.23,
        width: width,
        marginTop: Platform.OS === 'android' ? -20 : 0,
        backgroundColor: COLORS.PRIMARY_MAIN,
        borderBottomColor: COLORS.STATE_SUCCESS,
        borderBottomWidth: 3,
        marginBottom: 10
    },
    headingLabelContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        width: width,
        paddingHorizontal: 30
    },
    h1Label: {
        fontWeight: '700',
        fontSize: 20,
        lineHeight: 28,
        color: COLORS.WHITE
    },
    h12Label: {
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 30,
        color: COLORS.WHITE
    },
    hLabel: {
        fontWeight: '300',
        fontSize: 34,
        lineHeight: 41,
        color: COLORS.WHITE
    },
    h2Label: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        width: 281,
        color: COLORS.GRAY_90
    },
    h3Label: {
        fontSize: 12,
        lineHeight: 20,
        fontWeight: '400',
        color: COLORS.GRAY_90,
        marginRight: 10
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
    patientItemContainer: {
        backgroundColor: COLORS.WHITE,
        height: 55,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.PRIMARY_MAIN,
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 15,
        shadowColor: COLORS.GRAY_60,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginVertical: 10
    },
    popUpModal: {
        width: width,
        height: height * 0.94,
        marginBottom: DeviceInfo.hasNotch() ? -55 : -45,
        marginLeft: -20,
        backgroundColor: COLORS.GRAY_10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderTopWidth: 3,
        borderTopColor: COLORS.PRIMARY_MAIN
    }
});

export default styles;