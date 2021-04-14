import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import {COLORS} from '../../constants/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: COLORS.GRAY_30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsView: {
    height: 50,
    flexDirection: 'row',
    borderColor: COLORS.GRAY_90,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTextStyle: {
    paddingLeft: 15,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: COLORS.GRAY_90,
  },
  itemIcon: {
    fontSize: 20,
    paddingRight: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.PRIMARY_DARKER,
    fontWeight: '700',
    paddingLeft: 10,
  },
  componentView: {
    width: width * 0.9,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    marginTop: 10,
    borderColor: COLORS.GRAY_90,
  },
  settinsView: {
    width: width,
    marginTop:20
  },
  item: {
    flexDirection: 'row',
    paddingLeft: 20,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.GRAY_10,
  },
  mainView: {
    flex: 1,
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: COLORS.GRAY_10,
  },
  labelStyle: {
    paddingLeft: 20,
    marginTop: 20,
    fontSize: 34,
    fontWeight: '300',
    color: COLORS.PRIMARY_MAIN,
  },
  btnView: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:40,
    marginTop:20
   
  },
 textStyle:{
    color: COLORS.red,
    textAlign: 'center',
    paddingLeft: 25,
  }
});

export default styles;
