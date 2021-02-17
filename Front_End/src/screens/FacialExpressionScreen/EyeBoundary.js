import React from 'react'; 
import { StyleSheet, View, Image, Platform } from 'react-native';

const EyeBoundary = ({
    rightEyePosition,
    leftEyePosition,
    yawAngle,
    rollAngle }) => {
    return (
        <>
            <View style={styles.leftOval({
                rightEyePosition,
                leftEyePosition,
                yawAngle,
                rollAngle
            })} pointerEvents="none"></View>
            <View style={styles.rightOval({
                rightEyePosition,
                leftEyePosition,
                yawAngle,
                rollAngle
            })} pointerEvents="none"></View>
        </>
    );
};
export default EyeBoundary;

const styles = StyleSheet.create({
    leftOval: ({ rightEyePosition, leftEyePosition, yawAngle, rollAngle }) => {
        const eyePsDiff = Math.abs(leftEyePosition.x - rightEyePosition.x)
        const width = ((eyePsDiff * 0.75) / 2);
        return {
            position: 'absolute',
            top: leftEyePosition.y - (width / 2) - (Platform.OS === "android"? 25 : 5),
            left: leftEyePosition.x - (width / 2),
            width,
            height: width,
            borderRadius: (width / 2),
            borderWidth: width * 0.1,
            borderColor: "white",
            transform: [{ rotateX: `${Platform.OS === "android"? yawAngle : 0}deg` }, { rotateY: `${Platform.OS === "android"? -rollAngle : 0}deg` }, { scaleX: 2 }],
        };
    },
    rightOval: ({ rightEyePosition, leftEyePosition, yawAngle, rollAngle }) => {
        const eyePsDiff = Math.abs(leftEyePosition.x - rightEyePosition.x)
        const width = ((eyePsDiff * 0.75) / 2);
        return {
            position: 'absolute',
            top: rightEyePosition.y - (width / 2) - (Platform.OS === "android"? 25 : 5),
            left: rightEyePosition.x - (width / 2),
            width,
            height: width,
            borderRadius: (width / 2),
            borderWidth: width * 0.1,
            borderColor: "white",
            transform: [{ rotateX: `${Platform.OS === "android"? yawAngle : 0}deg` }, { rotateY: `${Platform.OS === "android"? -rollAngle : 0}deg` }, { scaleX: 2 }],
        };
    }
});