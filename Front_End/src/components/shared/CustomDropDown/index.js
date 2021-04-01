import React, { useRef, useState } from 'react'
import { ScrollView, Text, useWindowDimensions, View } from 'react-native'
// import DropDownPicker from 'react-native-dropdown-picker'
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import ReactNativeModal from 'react-native-modal'
import { COLORS } from '../../../constants/colors'
import CustomTouchableOpacity from '../CustomTouchableOpacity'
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
    error,
    dropDownMaxHeight = 165 }) => {
    const window = useWindowDimensions()
    const [topLeft, setTopLeft] = useState({
        top: 0,
        left: 0,
        width: 0,
        height: 0
    })
    const [showPopUp, setShowPopUp] = useState(false)
    const dropDownRef = useRef(null)
    const label = items.find(item => item.value === value)?.label || value || ''

    return (
        // <DropDownPicker
        //     items={items}
        //     defaultValue={value}
        //     onChangeItem={onChangeValue}
        //     placeholder={placeholder}
        //     containerStyle={{ ...styles.container, ...containerStyle }}
        //     style={{ ...styles.style, ...style }}
        //     dropDownStyle={{ ...styles.dropdownStyle, ...dropDownStyle }}
        //     labelStyle={{ ...styles.labelStyle, ...labelStyle }}
        //     placeholderStyle={{ ...styles.placeholderStyle, ...placeholderStyle }}
        //     activeItemStyle={{ ...styles.activeItemStyle, ...activeItemStyle }}
        //     activeLabelStyle={{ ...styles.activeLabelStyle, ...activeLabelStyle }}
        //     itemStyle={{ ...styles.itemStyle, ...itemStyle }}
        //     arrowSize={arrowSize}
        //     dropDownMaxHeight={dropDownMaxHeight}
        // />
        <>
            <CustomTouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    dropDownRef?.current?.measure((fx, fy, width, height, px, py) => {
                        console.log(px, py, fx, fy, width, height)
                        setTopLeft({
                            top: py + height - 20,
                            left: px - 20,
                            width: width,
                            height: dropDownStyle?.height || 100
                        })
                    })
                    setShowPopUp(true)
                }}
            >
                <View
                    ref={dropDownRef}
                    style={{
                        ...styles.container,
                        ...containerStyle,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        ...(error ? {
                            borderColor: COLORS.STATE_ERROR,
                            borderWidth: 1
                        } : {})
                    }}
                    renderToHardwareTextureAndroid
                >
                    <Text
                        numberOfLines={1}
                        style={
                            value ?
                                styles.labelStyle :
                                styles.placeholderStyle
                        }
                    >
                        {label || placeholder}
                    </Text>
                    <AntDesignIcon name={showPopUp ? "up" : "down"} color={COLORS.GRAY_60} size={22} style={{
                        fontWeight: 'bold',
                        transform: [{
                            translateX: 2
                        }],
                        marginHorizontal: 6
                    }} />
                </View>

            </CustomTouchableOpacity>
            <ReactNativeModal
                isVisible={showPopUp}
                animationIn="fadeIn"
                animationOut="fadeOut"
                animationInTiming={1}
                animationOutTiming={1}
                backdropOpacity={0}
                onBackdropPress={() => {
                    setShowPopUp(false)
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        left: topLeft.left,
                        minHeight: topLeft.height,
                        width: topLeft.width,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: COLORS.WHITE,
                        shadowColor: COLORS.GRAY_80,
                        shadowOffset: { height: 4, width: 0 },
                        shadowRadius: 10,
                        shadowOpacity: 0.6,
                        borderRadius: 4,
                        elevation: 10,
                        padding: 5,
                        maxHeight: (window.height - topLeft.top - 40) <= topLeft.height ? 160 :
                        (window.height - topLeft.top - 40)
                        ,
                        ...((window.height - topLeft.top - 40) <= topLeft.height ? 
                        { bottom: window.height - topLeft.top + 20 } :
                        { top: topLeft.top }
                        )
                    }}
                >
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{
                            width: topLeft.width
                        }}
                    >
                        {Boolean(items?.length) &&
                            items.map(item => {
                                const active = item.value === value

                                return (
                                    <CustomTouchableOpacity
                                        key={item.value}
                                        style={{
                                            width: topLeft.width,
                                            paddingHorizontal: topLeft.width * 0.07,
                                            backgroundColor: active ? COLORS.PRIMARY_MAIN : COLORS.WHITE,
                                            paddingVertical: 5
                                        }}
                                        onPress={() => {
                                            if (onChangeValue) {
                                                onChangeValue(item)
                                            }
                                            setShowPopUp(false)
                                        }}
                                    >
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                ...styles.labelStyle,
                                                ...(active ? styles.activeLabelStyle : {})
                                            }}
                                        >
                                            {item?.label}
                                        </Text>
                                    </CustomTouchableOpacity>
                                )
                            })

                        }
                    </ScrollView>
                </View>

            </ReactNativeModal>
        </>
    )
}

export default CustomDropDown;