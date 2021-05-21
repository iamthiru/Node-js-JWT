import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, Platform, ScrollView} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../constants/colors';
import CustomButton from '../../components/shared/CustomButton';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {PAIN_LOCATIONS} from '../../constants/painAssessment';
import CustomDropDown from '../../components/shared/CustomDropDown';
import {useDispatch, useSelector} from 'react-redux';
import {PAIN_ASSESSMENT_DATA_ACTION} from '../../constants/actions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PainLocationModal from '../../components/PainLocationComponents/PainLocationModal';
import CustomTextInput from '../../components/shared/CustomTextInput';

const {width, height} = Dimensions.get('window');

const PainLocation = ({
  gotoNext,
   gotoPrevious,
  }) => {
  const [painLocation, setPainLocation] = useState(''); 
  const [painLocationId,setPainLocationId]= useState(0)
  const [showFrontButton, setShowFrontButton] = useState(true);
  const [showFrontImage, setShowFrontImage] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const painPosition = useSelector(
    (state) => state.painAssessmentData.painLocation,
  );


  

  

  const handlePrevious = () => {
    gotoPrevious();
  };

  const handleContinue = () => {
    gotoNext();

  };
  

  return (
    <>
      <ScrollView>
        <View
          style={{
            width: width,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: COLORS.PRIMARY_MAIN,
            backgroundColor: COLORS.WHITE,
            paddingHorizontal: 30,
            paddingVertical: 20,
            marginBottom: 12,
            ...(Platform.OS !== 'android' && {zIndex: 10}),
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: width - 60,
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 22,
                color: COLORS.GRAY_90,
                fontWeight: '700',
                maxWidth: width - 60,
              }}>
              {'What is the location of the pain?'}
            </Text>
          </View>
          {/* <CustomDropDown
            items={PAIN_LOCATIONS}
            value={painLocation}
            onChangeValue={(item) =>
              setPainLocation(
                item && item.value ? item.value : PAIN_LOCATIONS[0].value,
              )
            }
            containerStyle={{marginBottom: 44}}
          /> */}
          <CustomTextInput placeholder="Pain Location" value={painLocation} />

          <CustomButton
            onPress={() => {
              setShowFrontButton(true);
              setOpenModal(true);
            }}
            title="Select Pain Location"
            textStyle={{color: COLORS.GRAY_90}}
            style={{
              width: width * 0.5,
              backgroundColor: COLORS.SECONDARY_MAIN,
              borderColor: COLORS.PRIMARY_MAIN,
              borderWidth: 1,
            }}
          />
        </View>
      </ScrollView>
      <PainLocationModal
        open={openModal}
        showFrontButton={showFrontButton}
        setShowFrontButton={setShowFrontButton}
        painLocation={painLocation}
        setPainLocation={setPainLocation}
        showFrontImage={showFrontImage}
        setShowFrontImage={setShowFrontImage}
        onClose={() => {
          setOpenModal(false);
        }}
        setPainLocationId ={setPainLocationId}
      />

      <View
        style={{
          flexDirection: 'row',
          width: width,
          paddingHorizontal: 13,
          marginBottom: 15 + (Platform.OS === 'ios' ? getStatusBarHeight() : 0),
          marginTop: 10,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
        <CustomButton
          onPress={() => handlePrevious()}
          title="Previous"
          textStyle={{color: COLORS.GRAY_90}}
          type="secondary"
          style={{
            width: (width - 16 - 16 - 75) / 2,
            backgroundColor: COLORS.WHITE,
          }}
          iconLeft={
            <AntDesignIcon
              name={'arrowleft'}
              size={16}
              color={COLORS.GRAY_90}
            />
          }
        />
        <CustomButton
          onPress={() => handleContinue()}
          title="Continue"
          textStyle={{color: COLORS.GRAY_90}}
          style={{
            width: (width - 16 - 16 - 75) / 2,
            backgroundColor: COLORS.SECONDARY_MAIN,
            borderColor: COLORS.PRIMARY_MAIN,
            borderWidth: 1,
          }}
          iconRight={
            <AntDesignIcon
              name={'arrowright'}
              size={16}
              color={COLORS.GRAY_90}
            />
          }
        />
      </View>
    </>
  );
};

export default PainLocation;
