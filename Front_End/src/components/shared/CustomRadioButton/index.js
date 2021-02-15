import React from 'react'
import { View, Text } from 'react-native'
import CustomTouchableOpacity from '../CustomTouchableOpacity'
import styles from './styles'

const CustomRadioButton = ({ containerStyle = {}, selected, onPress, disabled = false, label = "", labelStyle = {} }) => {
    return (
        <View style={[styles.buttonContainer, containerStyle]}>
            <CustomTouchableOpacity
                style={[styles.circle, disabled ? styles.circleDisabled : (selected ? styles.circleSelected : styles.circleUnSelected)]}
                onPress={onPress}
                disabled={disabled}
            >
                {selected && <View style={disabled ? styles.checkedCircleDisabled : styles.checkedCircle} />}

            </CustomTouchableOpacity>
            {label !== "" && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        </View>
    );
}

export default CustomRadioButton;