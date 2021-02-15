import React from 'react'
import { View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { COLORS } from '../../../constants/colors'
import styles from './styles'

const CustomDropDown = ({ items,
    value,
    onChangeValue,
    placeholder = "Select",
    containerStyle = {},
    style = {},
    dropDownStyle = {},
    labelStyle = {},
    placeholderStyle = {},
    activeItemStyle = {},
    activeLabelStyle = {},
    itemStyle = {},
    arrowSize = 25,
    dropDownMaxHeight = 165 }) => {

    return (
        <DropDownPicker
            items={items}
            defaultValue={value}
            onChangeItem={onChangeValue}
            placeholder={placeholder}
            containerStyle={{ ...styles.container, ...containerStyle }}
            style={{ ...styles.style, ...style }}
            dropDownStyle={{ ...styles.dropdownStyle, ...dropDownStyle }}
            labelStyle={{ ...styles.labelStyle, ...labelStyle }}
            placeholderStyle={{ ...styles.placeholderStyle, ...placeholderStyle }}
            activeItemStyle={{ ...styles.activeItemStyle, ...activeItemStyle }}
            activeLabelStyle={{ ...styles.activeLabelStyle, ...activeLabelStyle }}
            itemStyle={{ ...styles.itemStyle, ...itemStyle }}
            arrowSize={arrowSize}
            dropDownMaxHeight={dropDownMaxHeight}
        />
    )
}

export default CustomDropDown;