import React from 'react';
import { Text } from 'react-native';
import CustomTouchableOpacity from '../CustomTouchableOpacity';
import styles from './styles';

const CustomButton = ({ title, style, textStyle, onPress, disabled = false, type = "primary", iconLeft = null, iconRight = null }) => {
    
    return (
        <CustomTouchableOpacity disabled={disabled} style={[styles.btnStyle, (type === "primary"? styles.primaryBtn : (type === 'tertiary'? styles.teritaryBtnView : styles.secondaryBtn)), (style || { paddingHorizontal: 10 })]} onPress={onPress}>
            {iconLeft}
            <Text style={[styles.btnTextStyle, (type === "primary"? styles.primaryBtnText : (type === 'tertiary'? styles.teritaryBtn : styles.secondaryBtnText)), (textStyle || {})]}>{title || ""}</Text>
            {iconRight}
        </CustomTouchableOpacity>
    )
};

export default CustomButton;