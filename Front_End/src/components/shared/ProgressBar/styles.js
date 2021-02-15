import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';

const styles = StyleSheet.create({
    containerStyle: {
        height: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.WHITE,
        backgroundColor: COLORS.GRAY_40,
        justifyContent: "center"
    },
    indicatorStyle: {
        height: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.WHITE,
        backgroundColor: COLORS.SECONDARY_DARKER
    }
});

export default styles;