import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

const {width, height} = Dimensions.get('window');

const painLocationStyles = () => {
  return StyleSheet.create({
    mainView: {
      width: width + 20,
      height: height,
      backgroundColor: COLORS.WHITE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    secondMainView: {
      width: width * 0.9,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 20,
    },
    backButtonTextStyle: {
      color: COLORS.GRAY_90,
      textAlign: 'center',
      paddingHorizontal: 5,
    },
    backButtonStyle: {
      width: width * 0.3,
      backgroundColor: COLORS.SECONDARY_MAIN,
      borderColor: COLORS.PRIMARY_MAIN,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 30,
      borderRadius: 5,
    },
    frontButtonTextStyle: {
      color: COLORS.GRAY_90,
      textAlign: 'center',
      paddingHorizontal: 5,
    },
    frontButtonStyle: {
      width: width * 0.3,
      backgroundColor: COLORS.SECONDARY_MAIN,
      borderColor: COLORS.PRIMARY_MAIN,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 30,
      borderRadius: 5,
    },
    closeIcon: {
      fontSize: 25,
    },
    imageStyle: {
      width: width * 0.9,
      height: height * 0.9,
      aspectRatio: Boolean(height > 740)
        ? ((width + 330) / height) * 0.5
        : (width * 0.8 + 20) / (height + 100),
    },
  });
};

export default painLocationStyles;
