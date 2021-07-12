import React, { useState } from 'react'
import { View, Text, Dimensions } from 'react-native'
import Slider from '@react-native-community/slider';
import Entypo from 'react-native-vector-icons/Entypo'
import { COLORS } from '../../../constants/colors';

const { width } = Dimensions.get("window")

const ScoreSlider = ({ sliderWidth, minValue = 0, maxValue = 10, step = 1, value, onValueChange }) => {

    return (
        <View style={{ width: sliderWidth-10, alignItems: "center" }}>
            <View style={{
                width: 40,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                left: 5 + ((value * ((sliderWidth - 10) / (maxValue / step)))),
                alignSelf: "flex-start"
            }}>
                <Entypo name={"message"} size={40} color={COLORS.SECONDARY_MAIN} />
                <Text style={{
                    position: "absolute",
                    color: COLORS.PRIMARY_DARKER,
                    fontSize: 16,
                    lineHeight: 24
                }}>
                    {value}
                </Text>
            </View>
            <View style={{
                width: sliderWidth-14,
                height: 14,
                borderRadius: 14,
                backgroundColor: COLORS.GRAY_40,
                justifyContent: 'center',
                alignItems: "center"
            }}>
                <View style={{
                    // backgroundColor: COLORS.PRIMARY_MAIN,
                    height: 7,
                    borderRadius: 3.5,
                    width: sliderWidth - 10,
                    justifyContent: "center"
                }}>
                    <Slider
                        style={{ width: sliderWidth - 10 }}
                        thumbTintColor={COLORS.WHITE}
                        step={step}
                        minimumValue={minValue}
                        maximumValue={maxValue}
                        value={value}
                        onValueChange={(value) => onValueChange(value)}
                        minimumTrackTintColor={COLORS.PRIMARY_MAIN}
                        maximumTrackTintColor={COLORS.GRAY_40}
                    />
                </View>
            </View>
            <View style={{
                width: sliderWidth - 10,
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: 'space-between',
                paddingTop: 6,
                paddingHorizontal: 5
            }}>
                {
                    [...Array((maxValue / step) + 1)].map((elem, index) => (
                        <Text key={index} style={{ fontSize: 12, lineHeight: 16, color: COLORS.GRAY_60 }}>{index * step}</Text>
                    ))
                }
            </View>
        </View>
    )
}

export default ScoreSlider