import React, {useMemo} from 'react';
import {View, Text} from 'react-native';
import {COLORS} from '../../constants/colors';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';
import styles from '../../screens/PatientProfile/styles';
import {useSelector} from 'react-redux';
import {formatAMPM} from '../../utils/date';

const SummaryChartReport = ({
  patientReport,
  all_assessment_data,
  all_medication_data,
  lookup_data,
  data
}) => {
  const last_assessment = useSelector(
    (state) => state.getLastAssesmentAndMedication.assessment,
  );
  const last_medication = useSelector(
    (state) => state.getLastAssesmentAndMedication.medication,
  );
  const all_assessment_list = useSelector((state) => state.allAssessmentList);



 
  return (
    <View style={styles.summaryChatReportMainView}>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>Time:</Text>
        <Text style={styles.summaryReportDataText}>
          {data?.date && new Date(data.date).toDateString()+" "+formatAMPM(new Date(data.date)) || '-'}
        </Text>
      </View>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>IMPACT score:</Text>
        <Text style={styles.summaryReportDataText}>
          {data?.impact_score ? data?.impact_score : '-'}
        </Text>
      </View>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>Medication:</Text>
        <View>
          <Text style={styles.summaryReportDataText}>
            {data?.medication ? data.medication : '-'}
          </Text>
          <Text
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
          {(all_assessment_data && all_assessment_data?.note) || '-'}
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
