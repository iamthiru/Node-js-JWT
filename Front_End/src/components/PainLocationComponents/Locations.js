import React, {useState} from 'react';
import {View, Text, Platform, Dimensions} from 'react-native';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import {TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {PAIN_LOCATIONS_ACTION} from '../../constants/actions';
const {width,height} = Dimensions.get('window')

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
            justifyContent: "center",
            alignItems: "center",
            width:height <600 ? 20 : height > 800 ? 40 : 30,
            height:height <600 ? 20 : height > 800 ? 40 : 30,
            zIndex: 10,
            borderWidth: 1,
            borderRadius: height <600 ? 10 : height > 800 ? 20 : 15,
            top: body.top,
            left: body.left,
            backgroundColor: Boolean(select)
              ? COLORS.SECONDARY_MAIN
              : COLORS.WHITE,
          }}>
          {Boolean(Platform.OS !== 'ios') ? (
            <CustomTouchableOpacity
            style={{
              justifyContent:'center',
              alignItems:'center',
              width:height <600 ? 20 : height > 800 ? 40 : 30,
            height:height <600 ? 20 : height > 800 ? 40 : 30,
            borderRadius: height <600 ? 10 : height > 800 ? 20 : 15,
            }}
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
                  fontSize : height > 600 ? 16:10
                }}>
                {body.key}
              </Text>
            </CustomTouchableOpacity>
          ) : (
            <CustomTouchableOpacity
            style ={{
              justifyContent:'center',
              alignItems:'center',
              width:height <600 ? 20 : height > 800 ? 40 : 30,
            height:height <600 ? 20 : height > 800 ? 40 : 30,
            borderRadius: height <600 ? 10 : height > 800 ? 20 : 15,
            }}
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
                  fontSize : height > 600 ? 16:10
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
            justifyContent: "center",
            alignItems: "center",
            width:height <600 ? 20 : height > 800 ? 40 : 30,
            height:height <600 ? 20 : height > 800 ? 40 : 30,
            borderRadius: height <600 ? 10 : height > 800 ? 20 : 15,
            zIndex: 10,
            borderWidth: 1,
            top: body.top,
            left: body.left,
            backgroundColor: Boolean(select)
              ? COLORS.SECONDARY_MAIN
              : COLORS.WHITE,
          }}>
          {Boolean(Platform.OS === 'ios') ? (
            <CustomTouchableOpacity
            style={{
              justifyContent:'center',
              alignItems:'center',
              width:height <600 ? 20 : 40,
              height:height <600 ? 20 : 40,
              borderRadius: height <600 ? 10 : 20,
            }}
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
                  fontSize: height > 600 ? 16 : 10
                }}>
                {body.key}
              </Text>
            </CustomTouchableOpacity>
          ) : (
            <TouchableOpacity
            style={{
              justifyContent:'center',
              alignItems:'center',
              width:height <600 ? 20 : 40,
              height:height <600 ? 20 : 40,
              borderRadius: height <600 ? 10 : 20,
            }}
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
                 fontSize : height > 600 ? 16:10
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
