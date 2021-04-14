import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from './styles';
import { COLORS } from '../../../constants/colors';

const CustomTextInput = ({ 
    label, 
    containerStyle, 
    labelStyle, 
    inputStyle, 
    value, 
    onChangeText,
     placeholder, 
     isRequired, 
     keyboardType = "default", 
     maxLength, 
     onBlur, 
     error, 
     helperText = "",
      errorText = "", 
      secureTextEntry = false, 
      editable = true }) => {

    return (
        <View style={[styles.container, (containerStyle || {})]}>
            {label && <View style={{ flexDirection: "row" }}><Text style={[styles.label, (labelStyle || {})]}>{label}</Text>{isRequired && <Text style={[styles.required, (labelStyle || {})]}>*</Text>}</View>}
            <TextInput
                maxLength={maxLength}
                keyboardType={keyboardType}
                style={[styles.txtInput, (inputStyle || {})]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder || ''}
                placeholderTextColor={COLORS.GRAY_60}
                onBlur={onBlur}
                secureTextEntry={secureTextEntry}
                editable={editable}
                autoCapitalize={"none"}
            />
            {(!error && helperText !== "") && <Text style={[styles.helper, inputStyle && inputStyle.width ? { width: inputStyle.width } : {}]}>{helperText}</Text>}
            {(error && errorText !== "") && <Text style={[styles.error, inputStyle && inputStyle.width ? { width: inputStyle.width } : {}]}>{errorText}</Text>}
        </View>
    )
};

export default CustomTextInput;