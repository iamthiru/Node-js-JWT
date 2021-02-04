import React from 'react';
import { Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import styles from './styles';
import { COLORS } from '../../../constants/colors';

const CustomCheckBox = ({ label = "", value, onValueChange, containerStyle, checkBoxstyle, labelStyle, disabled = false }) => {

    return (
        <View style={{ flexDirection: "row", ...(containerStyle || {}) }}>
            <CheckBox
                boxType={'square'}
                disabled={disabled}
                value={value}
                onValueChange={onValueChange}
                tintColors={{ true: disabled ? COLORS.GRAY_60: COLORS.PRIMARY_MAIN }}
                tintColor={disabled? COLORS.GRAY_60 : COLORS.GRAY_80}
                onCheckColor={COLORS.WHITE}
                onFillColor={disabled ? COLORS.GRAY_60: COLORS.PRIMARY_MAIN}
                onTintColor={disabled ? COLORS.GRAY_60 : COLORS.PRIMARY_MAIN}
                style={[styles.checkBoxStyle, (checkBoxstyle || {})]} />
                {label !== "" && <Text style={[(disabled? styles.disabledLabelStyle : styles.labelStyle), ( labelStyle || {} )]}>{label}</Text>}
        </View>
    )
};

export default CustomCheckBox;