import React, {useEffect, useState} from 'react';
import {Dimensions, View, Image} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {COLORS} from '../../constants/colors';
import humanBodyFront from '../../assets/images/Front.png';
import BodyBackSide from '../../assets/images/Back.png';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import CustomButton from '../shared/CustomButton';
import {
  FRONT_SIDE_BODY_PART_DATA,
  BACK_SIDE_BODY_PARTS,
} from '../../constants/painLocationConstants';
import Locations from './Locations';
import painLocationStyles from './styles';
import {useDispatch,useSelector} from 'react-redux'
import { CREATE_ASSESSMENT_ACTION } from '../../constants/actions';

const {width, height} = Dimensions.get('window');

const PainLocationModal = ({
  open,
  showFrontButton,
  setShowFrontButton,
  painLocation,
  setPainLocation,
  showFrontImage,
  setShowFrontImage,
  onClose,

}) => {
  const [positionValue, setPositionValue] = useState(0);
  const selectedAssessmentData = useSelector((state) => state.createAsseement);
  
  const bodyPartsPositions = Boolean(showFrontImage)
    ? FRONT_SIDE_BODY_PART_DATA
    : BACK_SIDE_BODY_PARTS;

  const styles = painLocationStyles();
  const dispatch = useDispatch()
  useEffect(()=>{
    if(selectedAssessmentData?.painLocation_id){
      setPositionValue(selectedAssessmentData?.painLocation_id)
    }
  },[selectedAssessmentData?.painLocation_id])

  useEffect(() => {
    if (positionValue && bodyPartsPositions && bodyPartsPositions.length) {
      bodyPartsPositions.map((part, index) => {
        if (part.value === positionValue) {
          setPainLocation(part.part_name);
          dispatch({
            type:CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
            payload:{
              painLocation_id: positionValue,
            }
          })
          return;
        }
      });
    }
  }, [positionValue, bodyPartsPositions]);

  // const getPainLocation = (lx, ly) => {
  //   console.log('----x-----', lx);
  //   console.log('---y-----', ly);

  //   if (showFrontImage) {
  //     if (lx >= 115 && lx <= 144 && ly >= 7.5 && ly <= 90) {
  //       setPositionValue(1);
  //       Alert.alert('1');
  //     }
  //     if (
  //       lx >= width * 0.28 &&
  //       lx <= width * 0.35 &&
  //       ly >= height * 0.025 &&
  //       ly <= height * 0.12
  //     ) {
  //       setPositionValue(1);
  //     } else if (lx >= 153 && lx <= 190 && ly >= 4.5 && ly <= 105.5) {
  //       setPositionValue(2);
  //     } else if (lx >= 102 && lx <= 228 && ly >= 92 && ly <= 133) {
  //       setPositionValue(3);
  //     } else if (lx >= 44 && lx <= 141 && ly >= 152 && ly <= 191.5) {
  //       setPositionValue(4);
  //     } else if (lx >= 155 && lx <= 248 && ly >= 152 && ly <= 191.5) {
  //       setPositionValue(5);
  //     } else if (lx >= 40 && lx <= 72 && ly >= 203 && ly <= 276) {
  //       setPositionValue(6);
  //     } else if (lx >= 230 && lx <= 257 && ly >= 203 && ly <= 276) {
  //       setPositionValue(7);
  //     } else if (lx >= 34.5 && lx <= 61.5 && ly >= 293 && ly <= 391.5) {
  //       setPositionValue(8);
  //     } else if (lx >= 244 && lx <= 272 && ly >= 293 && ly <= 391.5) {
  //       setPositionValue(9);
  //     } else if (lx >= 5 && lx <= 47 && ly >= 403 && ly <= 463) {
  //       setPositionValue(10);
  //     } else if (lx >= 267 && lx <= 303 && ly >= 403 && ly <= 463) {
  //       setPositionValue(11);
  //     } else if (lx >= 79 && lx <= 125 && ly >= 202 && ly <= 250) {
  //       setPositionValue(12);
  //     } else if (lx >= 172.5 && lx <= 217 && ly >= 202 && ly <= 250) {
  //       setPositionValue(13);
  //     } else if (lx >= 83 && lx <= 145.5 && ly >= 294 && ly <= 345) {
  //       setPositionValue(14);
  //     }
  //     if (lx >= 157 && lx <= 221.5 && ly >= 294 && ly <= 345) {
  //       setPositionValue(15);
  //     } else if (lx >= 132 && lx <= 167 && ly >= 378 && ly <= 399) {
  //       setPositionValue(16);
  //     } else if (lx >= 80 && lx <= 138 && ly >= 409 && ly <= 555) {
  //       setPositionValue(17);
  //     } else if (lx >= 161 && lx <= 215 && ly >= 409 && ly <= 555) {
  //       setPositionValue(18);
  //     } else if (lx >= 100 && lx <= 136 && ly >= 572 && ly <= 732) {
  //       setPositionValue(19);
  //     } else if (lx >= 173 && lx <= 211 && ly >= 572 && ly <= 732) {
  //       setPositionValue(20);
  //     } else if (lx >= 79 && lx <= 134 && ly >= 747 && ly <= 785) {
  //       setPositionValue(21);
  //     } else if (lx >= 173 && lx <= 218 && ly >= 756 && ly <= 788) {
  //       setPositionValue(22);
  //     }
  //   } else {
  //     if (lx >= 138 && lx <= 169 && ly >= 26 && ly <= 90) {
  //       setPositionValue(23);
  //     } else if (lx >= 179 && lx <= 207 && ly >= 26 && ly <= 90) {
  //       setPositionValue(24);
  //     } else if (lx >= 136 && lx <= 211 && ly >= 103 && ly <= 136) {
  //       setPositionValue(25);
  //     } else if (lx >= 80 && lx <= 128 && ly >= 146 && ly <= 188) {
  //       setPositionValue(26);
  //     } else if (lx >= 222 && lx <= 277 && ly >= 146 && ly <= 188) {
  //       setPositionValue(27);
  //     } else if (lx >= 68 && lx <= 95 && ly >= 207 && ly <= 275) {
  //       setPositionValue(28);
  //     } else if (lx >= 256 && lx <= 284 && ly >= 207 && ly <= 275) {
  //       setPositionValue(29);
  //     } else if (lx >= 55 && lx <= 88.5 && ly >= 283 && ly <= 390) {
  //       setPositionValue(30);
  //     } else if (lx >= 261 && lx <= 314 && ly >= 283 && ly <= 390) {
  //       setPositionValue(31);
  //     } else if (lx >= 25 && lx <= 65 && ly >= 405 && ly <= 467) {
  //       setPositionValue(32);
  //     } else if (lx >= 282 && lx <= 315 && ly >= 405 && ly <= 467) {
  //       setPositionValue(33);
  //     } else if (lx >= 102 && lx <= 167 && ly >= 198 && ly <= 252) {
  //       setPositionValue(34);
  //     } else if (lx >= 180 && lx <= 240 && ly >= 198 && ly <= 252) {
  //       setPositionValue(35);
  //     } else if (lx >= 180 && lx <= 240 && ly >= 284 && ly <= 320) {
  //       setPositionValue(36);
  //     } else if (lx >= 180 && lx <= 240 && ly >= 284 && ly <= 320) {
  //       setPositionValue(37);
  //     } else if (lx >= 105 && lx <= 172 && ly >= 334 && ly <= 408) {
  //       setPositionValue(38);
  //     } else if (lx >= 183 && lx <= 252 && ly >= 334 && ly <= 408) {
  //       setPositionValue(39);
  //     } else if (lx >= 111 && lx <= 164 && ly >= 432 && ly <= 568) {
  //       setPositionValue(40);
  //     } else if (lx >= 191 && lx <= 242 && ly >= 432 && ly <= 568) {
  //       setPositionValue(41);
  //     } else if (lx >= 124 && lx <= 161 && ly >= 582 && ly <= 728) {
  //       setPositionValue(42);
  //     } else if (lx >= 200 && lx <= 242 && ly >= 582 && ly <= 728) {
  //       setPositionValue(43);
  //     } else if (lx >= 115 && lx <= 161 && ly >= 742 && ly <= 775) {
  //       setPositionValue(44);
  //     } else if (lx >= 200 && lx <= 248 && ly >= 742 && ly <= 775) {
  //       setPositionValue(44);
  //     }
  //   }
  // };
  return (
    <ReactNativeModal
      isVisible={open}
      deviceHeight={height}
      deviceWidth={width}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={1000}
      animationOutTiming={1000}
      backdropOpacity={0.6}
      coverScreen={true}
      style={{
        left: -30,
      }}>
      <View style={styles.mainView}>
        <View style={styles.secondMainView}>
          {Boolean(showFrontButton) ? (
            <CustomButton
              onPress={() => {
                setShowFrontImage(false);
                setShowFrontButton(false);
              }}
              title="Back"
              textStyle={styles.backButtonTextStyle}
              style={styles.backButtonStyle}
            />
          ) : (
            <CustomButton
              onPress={() => {
                setShowFrontImage(true);
                setShowFrontButton(true);
              }}
              title="Front"
              textStyle={styles.frontButtonTextStyle}
              style={styles.frontButtonStyle}
            />
          )}
          <AntDesignIcon
            name={'close'}
            onPress={() => {
              onClose();
            }}
            style={styles.closeIcon}
          />
        </View>
        <View
          onStartShouldSetResponder={(evt) => {
            // getPainLocation(
            //   evt.nativeEvent.locationX,
            //   evt.nativeEvent.locationY,
            // );
            return false;
          }}>
          {bodyPartsPositions.map((body, index) => {
            return (
              <Locations
                key={index}
                body={body}
                index={index}
                showFrontImage={showFrontImage}
                positionValue={positionValue}
                setPositionValue={setPositionValue}
                onClose={onClose}
              />
            );
          })}

          <Image
            source={Boolean(showFrontImage) ? humanBodyFront : BodyBackSide}
            style={styles.imageStyle}
          />
        </View>
      </View>
    </ReactNativeModal>
  );
};
export default PainLocationModal;
