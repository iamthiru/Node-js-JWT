import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const ProgressBar = ({ currentStep, totalSteps, width, containerStyle = {}, indicatorStyle = {} }) => (
    <View style={[styles.containerStyle, containerStyle, { width: width }]}>
        <View style={[styles.indicatorStyle, indicatorStyle, { width: (width * (currentStep / totalSteps)) }]}></View>
    </View>
);

export default ProgressBar;