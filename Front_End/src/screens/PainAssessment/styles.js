import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  addPatientButton: {
    width: width * 0.4,
    backgroundColor: COLORS.SECONDARY_MAIN,
    borderColor: COLORS.PRIMARY_MAIN,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    borderRadius: 5,
  },
  startButton: {
    width: width * 0.6,
    backgroundColor: COLORS.SECONDARY_MAIN,
    borderColor: COLORS.PRIMARY_MAIN,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 5,
  },
  secondMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 40,
    marginTop: 20,
    alignItems: 'center',
  },
  mainView: {
    width: width,
  },
  patientText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: COLORS.GRAY_90,
  },
  buttonTextStyle: {
    color: COLORS.GRAY_90,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  dataTextInput: {
    width: width * 0.4,
    height: 30,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.GRAY_80,
    backgroundColor: COLORS.WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dropDownTextStyle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  dropDownLabel: {
    fontSize: 14,
    lineHeight: 16,
    color: COLORS.GRAY_90,
    marginHorizontal: 5,
  },
  dropDownPlaceHolder: {
    fontSize: 12,
    color: COLORS.GRAY_90,
  },
  dropDownContainer: {
    borderRadius: 5,
    borderColor: COLORS.GRAY_60,
    minHeight: 10,
    width: width * 0.4,
  },
  datePickerView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  inputView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.GRAY_60,
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
  },
  headerStyle: {
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 2,
    backgroundColor: COLORS.PRIMARY_MAIN,
    borderBottomColor: COLORS.SECONDARY_MAIN,
    height: 50,
    zIndex: 10,
  },
  dropView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 40,
  },
  labelsView: {
    marginTop: 30,
    width: width * 0.8,
    paddingLeft: 40,
    justifyContent: 'flex-start',
  },
  labelStyle: {
    fontSize: 16,
    color: COLORS.GRAY_90,
    lineHeight: 24,
  },
  buttonView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  subLabel: {
    fontSize: 16,
    paddingLeft: 20,
    color: COLORS.GRAY_90,
    lineHeight: 24,
  },
  input: {
    width: width * 0.32,
    height: 30,
    borderWidth: 0,
  },
  container: {
    borderRadius: 5,
    width: width * 0.35,
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.GRAY_80,
    height: 30,
  },
  arrow: {
    fontSize: 20,
    right: 10,
    backgroundColor: COLORS.WHITE,
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 40,
    marginTop: 10,
  },
  dateLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.GRAY_90,
  },
  safeArea:{
    height: 90,
    backgroundColor: COLORS.PRIMARY_MAIN,
  },
  arrowLeft:{
    fontSize: 25,
    color: COLORS.WHITE,
  },
  heading:{
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '400',
    color: COLORS.WHITE,
    paddingLeft: 60,
  }
});
export default styles;
