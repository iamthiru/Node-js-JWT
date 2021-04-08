import React from 'react';
import {View, Text} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import styles from './styles';

// const { width, height } = Dimensions.get("window");

const LatestEntryCard = ({latestEntryData}) => {
  return (
    <View
      style={[
        styles.patientCardContainer,
        {
          height: 220,
        },
      ]}>
      <View style={styles.latestEntryView}>
        <Text style={styles.latestText}>Latest Entry</Text>
        <CustomTouchableOpacity style={styles.latestButtonView}>
          <Text
            style={{
              color: COLORS.PRIMARY_DARKER,
            }}>
            More Details
          </Text>
        </CustomTouchableOpacity>
      </View>
      <View style={styles.latestEntryView}>
        <Text style={styles.latestPainAssignText}>Pain assessment Time:</Text>

        <Text style={styles.latest_subTextData}>{latestEntryData.time}</Text>
      </View>

      <View style={[styles.latestEntryView]}>
        <Text style={styles.latestPainAssignText}>IMPACT Score:</Text>
        <CustomTouchableOpacity>
          <View style={styles.latestEntryButtonStyle}>
            <Text
              style={{
                color: COLORS.WHITE,
              }}>
              {latestEntryData.buttonText}
            </Text>
          </View>
        </CustomTouchableOpacity>
      </View>
      <View
        style={{
          paddingLeft: 20,
        }}>
        <Text style={styles.latestPainAssignText}>
            Pain Medication:
            </Text>
        <View
          style={{
            paddingLeft: 25,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.latestSubDataText}>
                Name:
                </Text>
            <Text style={styles.latest_subTextData}>
              {latestEntryData.pain_Medication.name}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.latestSubDataText}>
                Dosage:
                </Text>
            <Text style={styles.latest_subTextData}>
              {latestEntryData.pain_Medication.Dosage}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={styles.latestSubDataText}>
                Usage:
                </Text>
            <View>
              <Text style={styles.latest_subTextData}>
                  1 pill every 4 hour
                  </Text>
              <Text style={styles.latest_subTextData}>
                Starting Sep 10, 2020, 3:0 pm
              </Text>
              <Text style={styles.latest_subTextData}>
                  No end time
                  </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LatestEntryCard;
