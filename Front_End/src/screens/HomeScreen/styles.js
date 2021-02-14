import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';
import { COLORS } from "../../constants/colors";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: COLORS.GRAY_30,
        alignItems: "center",
        justifyContent: "center"
    },
});

export default styles;