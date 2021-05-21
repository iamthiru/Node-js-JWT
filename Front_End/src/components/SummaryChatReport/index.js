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
}) => {
  const last_assessment = useSelector(
    (state) => state.getLastAssesmentAndMedication.assessment,
  );
  const last_medication = useSelector(
    (state) => state.getLastAssesmentAndMedication.medication,
  );
  const all_assessment_list = useSelector((state) => state.allAssessmentList);

  const medicationList = useMemo(() => {
    return lookup_data
      .find((item) => {
        return item.name === 'MedicationClass';
      })
      ?.lookup_data?.find((item) => {
        return item.id === all_medication_data?.medication_class_id;
      })
      ?.lookup_data?.find((item) => {
        return item.id === all_medication_data?.medication_id;
      });
  }, [lookup_data, all_medication_data]);

  const dosage = useMemo(() => {
    if (lookup_data) {
      return lookup_data
        ?.find((item) => {
          return item.name === 'Dose';
        })
        ?.lookup_data?.find((item) => {
          return item.id === all_medication_data?.dosage_unit_id;
        });
    }
  }, [lookup_data, all_medication_data]);

  const dose_number = last_medication?.dosage_number;

  const date = all_assessment_data?.assessment_datetime;
  const dateFormat = new Date(date);
  return (
    <View style={styles.summaryChatReportMainView}>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>Time:</Text>
        <Text style={styles.summaryReportDataText}>
          {(date && dateFormat.toDateString() + formatAMPM(dateFormat)) || '-'}
        </Text>
      </View>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>IMPACT score:</Text>
        <Text style={styles.summaryReportDataText}>
          {all_assessment_data?.total_score
            ? all_assessment_data?.total_score
            : '-'}
        </Text>
      </View>
      <View style={styles.summaryChatReportView}>
        <Text style={styles.summaryChatReportMainText}>Medication:</Text>
        <View>
          <Text style={styles.summaryReportDataText}>
            {`${(medicationList && medicationList.label) || '-'} ${
              (all_medication_data?.dosage_number &&
                all_medication_data?.dosage_number) ||
              '-'
            } ${dosage ? dosage?.label : '-'}`}
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
