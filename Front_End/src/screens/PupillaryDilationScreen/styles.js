import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import {COLORS} from '../../constants/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    height: height,
    backgroundColor: COLORS.GRAY_30,
  },
  frameTopLeft: {
    width: 44,
    height: 47,
    position: 'absolute',
    top: 20,
    left: 20,
    borderColor: COLORS.WHITE,
    borderLeftWidth: 5,
    borderTopWidth: 5,
    borderTopLeftRadius: 10,
  },
  frameTopRight: {
    width: 44,
    height: 47,
    position: 'absolute',
    top: 20,
    right: 20,
    borderColor: COLORS.WHITE,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderTopRightRadius: 10,
  },
  frameBottomLeft: {
    width: 44,
    height: 47,
    position: 'absolute',
    top: width - 20 - 50,
    left: 20,
    borderColor: COLORS.WHITE,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
    borderBottomLeftRadius: 10,
  },
  frameBottomRight: {
    width: 44,
    height: 47,
    position: 'absolute',
    top: width - 20 - 50,
    right: 20,
    borderColor: COLORS.WHITE,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderBottomRightRadius: 10,
  },
  eyeBorderOval: {
    width: (width + 60) / 2,
    height: (width + 60) / 2,
    borderRadius: (width + 60) / 4,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    position: 'absolute',
    top: (width - (width + 60) / 2) / 2,
    left: (width - (width + 60) / 2) / 2,
    transform: [{scaleX: 2}],
  },
  eyeBorderCircle: {
    width: (width + 60) / 2,
    height: (width + 60) / 2,
    borderRadius: (width + 60) / 4,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    position: 'absolute',
    top: (width - (width + 60) / 2) / 2,
    left: (width - (width + 60) / 2) / 2,
  },
  eyeBorderRect: {
    width: width - 40,
    height: (width - 40) / 2,
    borderWidth: 5,
    borderColor: COLORS.WHITE,
    position: 'absolute',
    top: (width - (width - 40) / 2) / 2,
    left: 20,
  },
  timerContainer: {
    width: (width - 40) * 0.5 - 40,
    height: (width - 40) * 0.5 - 40,
    borderRadius: 5,
    backgroundColor: 'rgba(40, 40, 40, 0.5)',
    top: (width - ((width - 40) * 0.5 - 40)) / 2,
    left: (width - ((width - 40) * 0.5 - 40)) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    color: COLORS.WHITE,
    fontSize: 72,
    fontWeight: '700',
  },
  scrollViewStyle: {
    width: width,
    height: height - width,
    paddingHorizontal: 20,
  },
  
});

export default styles;
