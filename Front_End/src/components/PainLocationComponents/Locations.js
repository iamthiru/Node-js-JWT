import React, {useEffect, useState} from 'react';
import {View, Text, Platform} from 'react-native';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import painLocationStyles from './styles';

const Locations = ({
  body,
  showFrontImage,
  positionValue,
  setPositionValue,
  index,
  onClose,
}) => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (positionValue) {
      setPosition(positionValue);
    }
  }, [positionValue]);

  return (
    <>
      {showFrontImage ? (
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            padding: 5,
            borderWidth: 1,
            borderRadius: 15,
            top: body.top,
            left: body.left,
            backgroundColor: Boolean(position === body.value)
              ? COLORS.SECONDARY_MAIN
              : COLORS.WHITE,
          }}>
          {Boolean(Platform.OS === 'ios') ? (
            <CustomTouchableOpacity
              onPress={() => {
                setPositionValue(body.value);
                setTimeout(() => {
                  onClose();
                }, 300);
              }}>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                {body.key}
              </Text>
            </CustomTouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setPositionValue(body.value);
                setTimeout(() => {
                  onClose();
                }, 300);
              }}>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                {body.key}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            padding: 5,
            borderWidth: 1,
            borderRadius: 15,
            top: body.top,
            left: body.left,
            backgroundColor: Boolean(position === body.value)
              ? COLORS.SECONDARY_MAIN
              : COLORS.WHITE,
          }}>
          {Boolean(Platform.OS === 'ios') ? (
            <CustomTouchableOpacity
              onPress={() => {
                setPositionValue(body.value);
                setTimeout(() => {
                  onClose();
                }, 300);
              }}>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                {body.key}
              </Text>
            </CustomTouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setPositionValue(body.value);
                setTimeout(() => {
                  onClose();
                }, 300);
              }}>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                {body.key}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};
export default Locations;
