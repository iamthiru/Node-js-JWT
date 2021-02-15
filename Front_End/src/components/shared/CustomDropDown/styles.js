import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants/colors";

const styles = StyleSheet.create({
    container: { 
        height: 55 
    },
    style: { 
        height: 55, 
        backgroundColor: COLORS.WHITE, 
        borderWidth: 1, 
        borderColor: COLORS.GRAY_80, 
        borderRadius: 5
    },
    dropdownStyle: { 
        backgroundColor: COLORS.WHITE, 
        borderColor: COLORS.GRAY_80, 
        borderWidth: 1, 
        borderRadius: 4, 
        marginTop: 5
    },
    labelStyle: { 
        fontSize: 16, 
        lineHeight: 24, 
        color: COLORS.GRAY_90, 
        marginHorizontal: 0, 
        paddingHorizontal: 5 
    },
    placeholderStyle: { 
        fontSize: 16, 
        lineHeight: 24, 
        color: COLORS.GRAY_60, 
        marginHorizontal: 0, 
        paddingHorizontal: 5 
    },
    activeItemStyle: { 
        backgroundColor: COLORS.PRIMARY_MAIN 
    },
    activeLabelStyle: { 
        color: COLORS.WHITE 
    },
    itemStyle: { 
        justifyContent: 'flex-start' 
    }
});

export default styles;