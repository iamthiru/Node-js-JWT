import React, {useMemo} from 'react';
import {View, Text, useWindowDimensions} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import {COLORS} from '../../constants/colors';
import styles from './styles';
import {useSelector} from 'react-redux';
import {formatAMPM} from '../../utils/date';

const LatestEntryCard = ({last_assessment, last_medication, scrollRef}) => {
  const {width, height} = useWindowDimensions();

  const all_assessment_data = last_assessment?.assessment;
  const all_medication_data = last_assessment?.medication;

  const lookup_data = useSelector((state) => state.lookupData.lookup_data);
  const latestData = useSelector((state) => state.latestEntry);
  const date = latestData?.assessmentDateAndTime;
  const dateFormat = new Date(date);
  const createdDate =
    latestData && latestData.createdAt ? new Date(latestData.createdAt) : null;

  const medicationList = useMemo(() => {
    return lookup_data
      .find((item) => {
        return item.name === 'MedicationClass';
      })
      ?.lookup_data?.find((item) => {
        return item.id === latestData?.medication_name_id;
      })
      ?.lookup_data?.find((item) => {
        return item.id === latestData?.medication_id;
      });
  }, [lookup_data, latestData.medication_id, latestData.medication_name_id]);

  const dosage = useMemo(() => {
    if (lookup_data) {
      return lookup_data
        ?.find((item) => {
          return item.name === 'Dose';
        })
        ?.lookup_data?.find((item) => {
          return item.id === latestData?.dosage_unit_id;
        });
    }
  }, [lookup_data, latestData?.dosage_unit_id]);
  const impactScoreData = useMemo(() => {
    if (latestData?.impactScore === 99) {
      return 'N/A';
    } else if (latestData?.impactScore === undefined) {
      return '-';
    } else if (latestData?.impactScore === 0) {
      return '' + 0;
    } else {
      return '' + latestData?.impactScore;
    }
  }, [latestData?.impactScore]);

  return (
    <View
      style={[
        styles.patientCardContainer,
        {
          height: height > 800 ? height * 0.37 : height * 0.45,
        },
      ]}>
      <View style={styles.latestEntryView}>
        <Text style={styles.latestText}>Latest Entry</Text>
        <CustomTouchableOpacity
          onPress={() => {
            if (scrollRef?.current) {
              scrollRef?.current?.scrollTo({
                x: 0,
                y: height > 850? height * 0.65 : height * 0.85,
              });
            }
          }}
          style={styles.latestButtonView}>
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

        <Text style={styles.latest_subTextData}>
          {`${
            (date &&
              dateFormat.toDateString() + ' ' + formatAMPM(dateFormat)) ||
            '-'
          }`}
        </Text>
      </View>

      <View style={[styles.latestEntryView]}>
        <Text style={styles.latestPainAssignText}>IMPACT Score:</Text>
        <CustomTouchableOpacity disabled={true}>
          <View style={styles.latestEntryButtonStyle}>
            <Text
              style={{
                color: COLORS.WHITE,
              }}>
              {impactScoreData}
            </Text>
          </View>
        </CustomTouchableOpacity>
      </View>
      <View
        style={{
          paddingLeft: 20,
          paddingTop: 10,
        }}>
        <Text style={styles.latestPainAssignText}>Pain Medication:</Text>
        <View
          style={{
            paddingLeft: 25,
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 10,
            }}>
            <Text style={styles.latestSubDataText}>Name:</Text>
            <Text style={styles.latest_subTextData}>
              {medicationList ? medicationList?.label : '-'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingVertical: 10}}>
            <Text style={styles.latestSubDataText}>Dosage:</Text>
            <Text style={styles.latest_subTextData}>
              {(dosage &&
                dosage.label &&
                `${latestData.dosage_number || 0} ${dosage.label}`) ||
                '-'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={styles.latestSubDataText}>Usage:</Text>
            <View>
              <Text style={styles.latest_subTextData}>
                {(Boolean(latestData?.frequency) &&
                  'every ' + latestData?.frequency) ||
                  '-'}
              </Text>
              <Text style={styles.latest_subTextData}>
                {Boolean(createdDate)
                  ? 'Starting ' +
                    createdDate.toDateString() +
                    ' ' +
                    formatAMPM(createdDate)
                  : '-'}
              </Text>
              {/* <Text style={styles.latest_subTextData}>No end time</Text> */}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LatestEntryCard;
