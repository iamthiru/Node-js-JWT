import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';
import { COLORS } from "../../constants/colors";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.GRAY_30,
        alignItems: "center",
        justifyContent: "center"
    },
    scrollView: {
        flex: 1,
        width: width,
        backgroundColor: COLORS.GRAY_30
    },
});

export default styles;