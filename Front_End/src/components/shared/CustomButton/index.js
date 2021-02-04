import React from 'react';
import { Text } from 'react-native';
import CustomTouchableOpacity from '../CustomTouchableOpacity';
import styles from './styles';

const CustomButton = ({ title, style, textStyle, onPress, disabled = false, type = "primary" }) => {
    
    return (
        <CustomTouchableOpacity disabled={disabled} style={[styles.btnStyle, (type === "primary"? styles.primaryBtn : styles.secondaryBtn), (style || { paddingHorizontal: 10 })]} onPress={onPress}>
            <Text style={[styles.btnTextStyle, (type === "primary"? styles.primaryBtnText : styles.secondaryBtnText), (textStyle || {})]}>{title || ""}</Text>
        </CustomTouchableOpacity>
    )
};

export default CustomButton;