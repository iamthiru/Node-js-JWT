import React from 'react';
import {View, Text} from 'react-native';
import {COLORS} from '../../constants/colors';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';
import styles from '../../screens/PatientProfile/styles';
import {formatAMPM} from '../../utils/date';

const SummaryChartReport = ({
  patientReport,
  all_assessment_data,
  scrollRef,
  impact_score,
  medication,
  nrs_score,
  date,
}) => {
  return (
    <View style={styles.summaryChatReportMainView}>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>Time:</Text>
        <Text style={styles.summaryReportDataText}>
          {(date &&
            new Date(date).toDateString() + ' ' + formatAMPM(new Date(date))) ||
            '-'}
        </Text>
      </View>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>IMPACT score:</Text>
        <Text style={styles.summaryReportDataText}>
          {/* {(impact_score) ?impact_score : '-'} */}
          {Boolean(impact_score === undefined)
            ? '-'
            : Boolean(impact_score === 99)
            ? 'N/A'
            : impact_score}
        </Text>
      </View>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>Medication:</Text>
        <View>
          <Text style={styles.summaryReportDataText}>
            {medication ? medication : '-'}
          </Text>
          {/* <Text
            style={[
              ,
              styles.summaryReportDataText,
              {
                paddingTop: 5,
              },
            ]}>
            {(all_assessment_data?.frequency === 0 &&
              'every ' + all_assessment_data?.frequency + ' ' + 'hours') ||
              '-'}
          </Text> */}
        </View>
      </View>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>NRS score:</Text>
        <Text style={styles.summaryReportDataText}>
          {/* {nrs_score ?nrs_score: '-'} */}
          {Boolean(nrs_score === undefined)
            ? '-'
            : Boolean(nrs_score === 0)
            ? 0
            : nrs_score}
        </Text>
      </View>
      <View style={styles.summaryChatreportNoteView}>
        <Text style={styles.summaryChatReportMainText}> Note:</Text>
        <Text
          style={{
            paddingTop: 5,
            color: COLORS.GRAY_90,
          }}>
          {(all_assessment_data && all_assessment_data?.note) || '-'}
        </Text>
      </View>
      <View style={styles.summaryChatReportButtonView}>
        <CustomTouchableOpacity
          onPress={() => {
            if (scrollRef?.current) {
              scrollRef?.current?.scrollToEnd({
                animated: true,
              });
            }
          }}
          style={{
            borderBottomWidth: 0.5,
            borderColor: COLORS.PRIMARY_MAIN,
          }}>
          <Text style={styles.summaryChatReportButtonText}>
            {patientReport.button}
          </Text>
        </CustomTouchableOpacity>
      </View>
    </View>
  );
};
export default SummaryChartReport;
