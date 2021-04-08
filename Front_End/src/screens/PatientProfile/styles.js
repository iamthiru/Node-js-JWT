import {Platform, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {COLORS} from '../../constants/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: width,
    backgroundColor: COLORS.GRAY_10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingContainer: {
    justifyContent: 'flex-start',
    width: width,
    marginTop: Platform.OS === 'android' ? -20 : 0,
    backgroundColor: COLORS.WHITE,
    paddingTop: DeviceInfo.hasNotch() ? 45 : 20,
  },
  secondaryButton: {
    width: width * 0.6,
    backgroundColor: COLORS.SECONDARY_MAIN,
    borderColor: COLORS.PRIMARY_MAIN,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    height: 48,
  },
  primaryButton: {
    width: width * 0.6,
    backgroundColor: COLORS.PRIMARY_MAIN,
    borderColor: COLORS.PRIMARY_MAIN,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  patientCardContainer: {
    backgroundColor: COLORS.WHITE,
    width: width,
    borderColor: COLORS.PRIMARY_MAIN,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginVertical: 10,
  },
  summaryChatReportMainView: {
    marginTop:10,
    width: width,
    backgroundColor: COLORS.GRAY_10,
  },
  summaryChatReportView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingLeft: 30,
    marginTop: 15,
  },
  summaryChatreportNoteView: {
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingLeft: 30,
  },
  summaryReportDataText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.GRAY_90,
  },
  summaryChatReportMainText: {
    fontSize: 14,
    fontWeight: '700',
  },
  summaryChatReportButtonView: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 10,
  },
  summaryChatReportButtonText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: COLORS.PRIMARY_MAIN,
  },
  latestEntryView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 3,
  },
  latestEntryButtonStyle: {
    width: 55,
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_MAIN,
  },
  latest_subTextData: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    paddingLeft:10,
    color: COLORS.GRAY_90,
  },
  latestText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: COLORS.PRIMARY_DARKER,
  },
  latestButtonView: {
    borderBottomWidth: 1,
    borderColor: COLORS.PRIMARY_DARKER,
  },
  latestPainAssignText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    color: COLORS.PRIMARY_DARKER,
  },
  latestSubDataText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: COLORS.PRIMARY_DARKER,
  },
});

export default styles;
