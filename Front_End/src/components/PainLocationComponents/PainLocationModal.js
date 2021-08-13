import React, {useEffect, useState} from 'react';
import {Dimensions, View, Text, Image, Platform} from 'react-native';
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
import {useDispatch, useSelector} from 'react-redux';


const {width, height} = Dimensions.get('window');

const PainLocationModal = ({
  open,
  showFrontButton,
  setShowFrontButton,
  showFrontImage,
  setShowFrontImage,
  selectedPainLocations,
  onClose,
}) => {
  const selectedAssessmentData = useSelector(
    (state) => state.createAsseement.painLocation_id,
  );
  const [painLocations, setPainLocations] = useState([]);
  const bodyPartsPositions = Boolean(showFrontImage)
    ? FRONT_SIDE_BODY_PART_DATA
    : BACK_SIDE_BODY_PARTS;

  const styles = painLocationStyles();
  const dispatch = useDispatch();

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
          {Boolean(showFrontImage) ? (
            <CustomButton
              onPress={() => {
                setShowFrontImage(false);
                setShowFrontButton(!showFrontButton);
              }}
              title="Back"
              textStyle={styles.backButtonTextStyle}
              style={styles.backButtonStyle}
            />
          ) : (
            <CustomButton
              onPress={() => {
                setShowFrontImage(true);
                setShowFrontButton(!showFrontButton);
              }}
              title="Front"
              textStyle={styles.frontButtonTextStyle}
              style={styles.frontButtonStyle}
            />
          )}

          <AntDesignIcon
            name={'close'}
            onPress={() => {
             onClose()
            }}
            style={[
              styles.closeIcon,
              {
                paddingRight: Boolean(Platform.OS === 'ios') ? 0 : 10,
              },
            ]}
          />
        </View>
        <View
          onStartShouldSetResponder={(evt) => {
            // getPainLocation(
            //   evt.nativeEvent.locationX,
            //   evt.nativeEvent.locationY,
            // );
            return false;
          }}
         
          >
          {bodyPartsPositions.map((body, index) => {
            return (
              <Locations
                key={index}
                body={body}
                index={index}
                showFrontImage={showFrontImage}
                onClose={onClose}
                selectedPainLocations={selectedPainLocations}
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
