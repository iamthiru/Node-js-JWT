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
    marginTop: 30,
    width: width,
    backgroundColor: COLORS.GRAY_10,
    marginBottom: 20,
  },
  summaryChatReportView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 15,
  },
  summaryChatreportNoteView: {
    marginHorizontal: 20,
    paddingVertical: 10,
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
    marginHorizontal: 20,
    paddingBottom: 10,
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
    marginTop: 15,
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
    lineHeight: 23,
    fontWeight: '400',
    paddingLeft: 10,
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
  allEntriesMainView: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  allEntryText: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 30,
    color: COLORS.PRIMARY_DARKER,
  },
  allEntryTimeText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  allEntriesContainer: {
    width: width * 0.9,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.PRIMARY_MAIN,
  },
  allEntriesButtonStyle: {
    width: 55,
    height: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY_MAIN,
  },
  textStyle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  containerStyle: {
    borderRadius: 20,
    borderColor: COLORS.PRIMARY_MAIN,
    minHeight: 40,
    width: 180,
    marginRight: 15,
  },
  noEntrySubLabel: {
    paddingTop: 10,
    width: width * 0.55,
    color: COLORS.GRAY_90,
  },
  noEntryMainLabel: {
    color: COLORS.PRIMARY_DARKER,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  dropDownLabel: {
    fontSize: 12,
    lineHeight: 24,
    color: COLORS.GRAY_90,
    marginHorizontal: 5,
  },
  patient_main_view: {
    height: 50,
    width: width,
    marginHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  main_view_position: {
    position: 'absolute',
    top: 12,
    zIndex: 1,
  },
  patientProfileText: {
    textAlign: 'center',
    color: COLORS.PRIMARY_MAIN,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '400',
  },
  profileButtonsView: {
    paddingVertical: 20,
    width: width,
    alignItems: 'center',
  },
  noDataFound: {
    fontSize: 25,
    textAlign: 'center',
    paddingVertical: 20,
    fontWeight: '600',
    color: COLORS.PRIMARY_MAIN,
  },
  patientDetailCardMainView: {
    width: width,
    paddingHorizontal: 30,
    paddingBottom: 20,
    backgroundColor: COLORS.WHITE,
    borderBottomColor: COLORS.BLACK,
    borderBottomWidth: 1,
  },
  patientName: {
    color: COLORS.PRIMARY_DARKER,
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '700',
  },
  patientAge: {
    color: COLORS.PRIMARY_DARKER,
    fontSize: 16,
    lineHeight: 32,
    fontWeight: '400',
  },
  medicalNumber: {
    color: COLORS.PRIMARY_DARKER,
    fontSize: 16,
    lineHeight: 32,
    fontWeight: '400',
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 30,
  },
  editButtonTouch: {
    borderBottomColor: COLORS.PRIMARY_MAIN,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  summaryChatText: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: COLORS.PRIMARY_MAIN,
  },
  summaryChat_mainView: {
    width: width - 30,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
    marginTop: 10,
  },
  noEntryText: {
    fontSize: 20,
    textAlign: 'center',
    color: COLORS.PRIMARY_MAIN,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default styles;
