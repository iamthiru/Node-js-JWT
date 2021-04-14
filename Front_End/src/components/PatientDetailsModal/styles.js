import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  mainView: {
    width: width*0.7,
    height: height * 0.3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_MAIN,
    backgroundColor: COLORS.WHITE,
  },
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    marginHorizontal: 20,
  },
  nameText: {
    fontSize: 20,
    lineHeight: 28,
    color: COLORS.PRIMARY_DARKER,
    fontWeight: '700',
  },
  closeIcon: {
    fontSize: 20,
    color: COLORS.GRAY_90,
  },
  genderText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: COLORS.PRIMARY_DARKER,
  },
  medicalNumberView: {
    flexDirection: 'row',
    paddingLeft: 20,
    marginVertical: 5,
  },
  medicalText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: COLORS.PRIMARY_DARKER,
  },
  medicalRecord: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: COLORS.PRIMARY_DARKER,
  },
  buttonView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  textStyle: {
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  styles: {
    width: width * 0.4,
    backgroundColor: COLORS.PRIMARY_MAIN,
    borderColor: COLORS.PRIMARY_MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelView: {
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.PRIMARY_MAIN,
  },
  cancelButton: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.PRIMARY_MAIN,
  },
});

export default styles;
