import {StyleSheet} from 'react-native';

const assignPatientStyles = ({width, height, COLORS, Platform}) => {
  return StyleSheet.create({
    assignPatientMainView: {
      flex: 1,
      width: width,
      backgroundColor: COLORS.WHITE,
    },
    assignPatientContainerView: {
      justifyContent: 'flex-start',
      width: width,
      backgroundColor: COLORS.WHITE,
    },
    assignPatientSecondView: {
      height: 50,
      width: width,
      marginHorizontal: 10,
      justifyContent: 'center',
      marginBottom: 10,
    },
    assignPatientBackButtonView: {
      position: 'absolute',
      top: 12,
      zIndex: 1,
    },
    assignPatientMainText: {
      textAlign: 'center',
      color: COLORS.PRIMARY_MAIN,
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '400',
    },
    inputStyles: {
      width: width * 0.9,
      marginLeft: 20,
    },
    assignPatientButton: {
      width: width,
      justifyContent: 'center',
      alignItems: 'center',
    },
    assignButtonStyles: {
      width: width * 0.6,
      backgroundColor: COLORS.PRIMARY_MAIN,
      borderColor: COLORS.PRIMARY_MAIN,
      borderWidth: 1,
      alignItems: 'center',
    },
    assignDropDownView: {
      width: width,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      marginTop: 20,
      bottom: height > 800 ? 0 : 10,
      marginBottom: 15,
    },
    dropDownTextStyles: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
    dropDownContainerStyle: {
      borderRadius: 20,
      borderColor: COLORS.PRIMARY_MAIN,
      minHeight: 30,
      width: 180,
      marginRight: 15,
    },
    dropDownPlaceHolder: {
      fontSize: 12,
      color: COLORS.GRAY_90,
    },
    titleText: {
      width: width,
      height: 30,
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: COLORS.PRIMARY_LIGHTER,
      paddingLeft: 10,
    },
    title: {
      fontSize: 20,
      color: COLORS.GRAY_90,
      paddingLeft: 10,
      fontWeight: '700',
    },
    sectionMainView: {
      width: width * 0.95,
      marginHorizontal: 10,
      height: 65,
      top: 5,
      backgroundColor: COLORS.WHITE,
      flexDirection: 'row',
      borderBottomWidth: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: COLORS.PRIMARY_MAIN,
    },
    name: {
      paddingLeft: 20,
      fontSize: 16,
      color: COLORS.GRAY_90,
    },
    iconStyle: {
      paddingRight: 20,
      fontSize: 25,
    },
    dropDownLabelStyle: {
      fontSize: 12,
      lineHeight: 24,
      color: COLORS.GRAY_90,
      marginHorizontal: 5,
    },
  });
};
export default assignPatientStyles;
