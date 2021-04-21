import React, { Dimensions } from 'react-native'
import ReactNativeModal from 'react-native-modal';
import {View,Text} from 'react-native'
import DeviceInfo from 'react-native-device-info';
import { COLORS } from '../../constants/colors';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';


const { width, height } = Dimensions.get('window')

const FocusDepthSliderModal = ({
    open,
    onClose,
    focusDepthMode,
    focusDepthModeData,
    setFocusDepthOn,
    setFocusDepthMode
}) => {

    const deviceModel = DeviceInfo.getModel();

    <ReactNativeModal
      isVisible={open}
      deviceHeight={height}
      deviceWidth={width}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={500}
      animationOutTiming={500}
      onBackdropPress={() => {
        onClose();
      }}
      backdropOpacity={0.6}
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}  
    >
        <View style ={{
            width:width,
            height: height*0.4,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:COLORS.WHITE
        }}>
             <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: `${COLORS.PRIMARY_MAIN}50`,
                    height: deviceModel === 'iPhone 7 Plus' ? 20 : 30,
                    alignItems: 'center',
                    borderRadius: 10,
                    justifyContent:'center',
                  }}>
                
                  <CustomTouchableOpacity
                    style={{
                      backgroundColor:
                      Boolean(focusDepthMode === focusDepthModeData.AUTOFOCUS_DEPTH_MODE)
                          ? COLORS.SECONDARY_MAIN
                          : `${COLORS.GRAY_40}`,
                      width: 80,
                      height: deviceModel === 'iPhone 7 Plus' ? 20 : 30,
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: Boolean(focusDepthMode === focusDepthModeData.AUTOFOCUS_DEPTH_MODE)? 1 : 0,
                    }}
                    onPress={() => 
                      {
                    setFocusDepthOn(false)
                    setFocusDepthMode(focusDepthModeData.AUTOFOCUS_DEPTH_MODE)
                    
                      }
                    }>
                    <Text
                      style={{
                        color: Boolean(focusDepthMode === focusDepthModeData.AUTOFOCUS_DEPTH_MODE) ? COLORS.GRAY_90: COLORS.WHITE,
                        fontWeight: '700',
                        fontSize: deviceModel === 'iPhone 7 Plus' ? 9 : 14,
                        lineHeight: deviceModel === 'iPhone 7 Plus ' ? 12 : 17,
                        textTransform: 'uppercase',
                      }}>
                      {'Auto Focus'}
                    </Text>
                  </CustomTouchableOpacity>
                  <CustomTouchableOpacity
                    style={{
                      backgroundColor:
                      Boolean(focusDepthMode === focusDepthModeData.MANUAL_FOCUSDEPTH_MODE)
                          ? COLORS.SECONDARY_MAIN
                          : `${COLORS.GRAY_40}`,
                          width: 80,
                      height: deviceModel === 'iPhone 7 Plus' ? 20 : 30,
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: Boolean(focusDepthMode === focusDepthModeData.MANUAL_FOCUSDEPTH_MODE )? 1 : 0,
                    }}
                    onPress={() =>{
                      setFocusDepthOn(true)
                      setFocusDepthMode(focusDepthModeData.MANUAL_FOCUSDEPTH_MODE)
                    }
                      } >

                    <Text
                      style={{
                        color:
                        Boolean(focusDepthMode === focusDepthModeData.MANUAL_FOCUSDEPTH_MODE)
                            ? COLORS.GRAY_90
                            : COLORS.WHITE,
                        fontWeight: '700',
                        fontSize: deviceModel === 'iPhone 7 Plus' ? 9 : 14,
                        lineHeight: deviceModel === 'iPhone 7 Plus ' ? 12 : 17,
                        textTransform: 'uppercase',
                      }}>
                      {'Manual Focus'}
                    </Text>
                  </CustomTouchableOpacity>
                </View>


        </View>

    </ReactNativeModal>

}

export default FocusDepthSliderModal