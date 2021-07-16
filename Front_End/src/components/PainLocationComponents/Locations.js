import React, {useState} from 'react';
import {View, Text, Platform} from 'react-native';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import {TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {PAIN_LOCATIONS_ACTION} from '../../constants/actions';

const Locations = ({body, showFrontImage, selectedPainLocations}) => {
  const select = selectedPainLocations.find((item) => {
    return item.painLocationId === body.value;
  });

  const dispatch = useDispatch();

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
            backgroundColor: Boolean(select)
              ? COLORS.SECONDARY_MAIN
              : COLORS.WHITE,
          }}>
          {Boolean(Platform.OS !== 'ios') ? (
            <CustomTouchableOpacity
              onPress={() => {
                if (select) {
                  const filterData = selectedPainLocations.filter((item) => {
                    return item.painLocationId !== body.value;
                  });
                  dispatch({
                    type: PAIN_LOCATIONS_ACTION.PAIN_LOCATION,
                    payload: filterData,
                  });
                } else {
                  selectedPainLocations.push({
                    painLocationId: body.value,
                    painData: body,
                  });
                  dispatch({
                    type: PAIN_LOCATIONS_ACTION.PAIN_LOCATION,
                    payload: selectedPainLocations,
                  });
                }
              }}>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                {body.key}
              </Text>
            </CustomTouchableOpacity>
          ) : (
            <CustomTouchableOpacity
              onPress={() => {
                if (select) {
                  const filterData = selectedPainLocations.filter((item) => {
                    return item.painLocationId !== body.value;
                  });
                  dispatch({
                    type: PAIN_LOCATIONS_ACTION.PAIN_LOCATION,
                    payload: filterData,
                  });
                } else {
                  selectedPainLocations.push({
                    painLocationId: body.value,
                    painData: body,
                  });
                  dispatch({
                    type: PAIN_LOCATIONS_ACTION.PAIN_LOCATION,
                    payload: selectedPainLocations,
                  });
                }
              }}>
              <Text
                style={{
                  textAlign: 'center',
                }}>
                {body.key}
              </Text>
            </CustomTouchableOpacity>
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
            backgroundColor: Boolean(select)
              ? COLORS.SECONDARY_MAIN
              : COLORS.WHITE,
          }}>
          {Boolean(Platform.OS === 'ios') ? (
            <CustomTouchableOpacity
              onPress={() => {
                if (select) {
                  const filterData = selectedPainLocations.filter((item) => {
                    return item.painLocationId !== body.value;
                  });
                  dispatch({
                    type: PAIN_LOCATIONS_ACTION.PAIN_LOCATION,
                    payload: filterData,
                  });
                } else {
                  selectedPainLocations.push({
                    painLocationId: body.value,
                    painData: body,
                  });
                  dispatch({
                    type: PAIN_LOCATIONS_ACTION.PAIN_LOCATION,
                    payload: selectedPainLocations,
                  });
                }
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
                if (select) {
                  const filterData = selectedPainLocations.filter((item) => {
                    return item.painLocationId !== body.value;
                  });
                  dispatch({
                    type: PAIN_LOCATIONS_ACTION.PAIN_LOCATION,
                    payload: filterData,
                  });
                } else {
                  selectedPainLocations.push({
                    painLocationId: body.value,
                    painData: body,
                  });
                  dispatch({
                    type: PAIN_LOCATIONS_ACTION.PAIN_LOCATION,
                    payload: selectedPainLocations,
                  });
                }
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
