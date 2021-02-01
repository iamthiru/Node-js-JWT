import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#E5E5E5",
        alignItems: "center",
        justifyContent: "center"
    },
});

export default styles;