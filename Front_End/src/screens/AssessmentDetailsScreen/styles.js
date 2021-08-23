import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  safaAreaBody: {
    width: width,
    height: 80,
    backgroundColor: COLORS.PRIMARY_MAIN,
  },
  mainBody: {
    width: width,
    height: height,
    justifyContent: 'center',
    backgroundColor: 'green',
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
  arrowStyle: {
    fontSize: 25,
    color: COLORS.WHITE,
  },
  headerText: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '400',
    color: COLORS.WHITE,
    paddingLeft: 60,
  },
  subHeadingText:{
      fontSize:16,
      fontWeight:"700",
      lineHeight:18
  },
  dataText:{
      fontSize:16,
      fontWeight:'400',
      lineHeight:18
  },
  dataFieldView:{
    paddingHorizontal:30,
    paddingVertical: height <700 ? 5 :10,
    flexDirection:'row'
  }
});
export default styles;
