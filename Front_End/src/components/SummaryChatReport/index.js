import React from 'react';
import {View, Text} from 'react-native';
import {COLORS} from '../../constants/colors';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';
import styles from '../../screens/PatientProfile/styles';

const SummaryChartReport = ({patientReport}) => {
  return (
    <View style={styles.summaryChatReportMainView}>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>Time:</Text>
        <Text style={styles.summaryReportDataText}>{patientReport.time}</Text>
      </View>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>IMPACT score:</Text>
        <Text style={styles.summaryReportDataText}>{patientReport.score}</Text>
      </View>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>Medication:</Text>
        <View>
          <Text style={styles.summaryReportDataText}>
            {patientReport.medication.medication_per}
          </Text>
          <Text
            style={[
              ,
              styles.summaryReportDataText,
              {
                paddingTop: 5,
              },
            ]}>
            {patientReport.medication.medication_times}
          </Text>
        </View>
      </View>
      <View style={styles.summaryChatreportNoteView}>
        <Text style={styles.summaryChatReportMainText}> Note:</Text>
        <Text
          style={{
            paddingTop: 5,
            color: COLORS.GRAY_90,
          }}>
          {patientReport.note}
        </Text>
      </View>
      <View style={styles.summaryChatReportButtonView}>
        <CustomTouchableOpacity
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
