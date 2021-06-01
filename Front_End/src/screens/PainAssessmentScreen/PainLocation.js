import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, Platform, ScrollView} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../constants/colors';
import CustomButton from '../../components/shared/CustomButton';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';
import PainLocationModal from '../../components/PainLocationComponents/PainLocationModal';
import CustomTextInput from '../../components/shared/CustomTextInput';
import Analytics from '../../utils/Analytics';
import {SCREEN_NAMES} from '../../constants/navigation';
import {
  CREATE_ASSESSMENT_ACTION,
  PAIN_LOCATIONS_ACTION,
} from '../../constants/actions';

const {width, height} = Dimensions.get('window');
let startTime = 0;
let endTime = 0;

const PainLocation = ({gotoNext, gotoPrevious}) => {
  const [showFrontButton, setShowFrontButton] = useState(true);
  const [showFrontImage, setShowFrontImage] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  var selectedPainLocations =
    useSelector((state) => state.painLocations?.painLocations) || [];
  const prevData = useSelector(
    (state) => state.createAsseement?.painLocationId,
  );

  useEffect(() => {
    if (prevData?.length) {
      selectedPainLocations = prevData;
    }
  }, [prevData]);

  useEffect(() => {
    startTime = new Date().getTime();
  }, []);

  const handlePrevious = () => {
    gotoPrevious();
    endTime = new Date().getTime()
    Analytics.setCurrentScreen(
      SCREEN_NAMES.PAINASSESSMENT,
        (endTime-startTime)/1000,
        startTime,
        endTime
    )
  };

  const handleContinue = () => {
    dispatch({
      type: CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
      payload: {painLocationId: selectedPainLocations},
    });
    gotoNext();
    endTime = new Date().getTime();
    Analytics.setCurrentScreen(
      SCREEN_NAMES.PAINASSESSMENT,
      (endTime - startTime) / 1000,
      startTime,
      endTime,
    );
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
          {Boolean(selectedPainLocations?.length) ? (
            selectedPainLocations.map((pain, index) => {
              return (
                <Text
                  style={{
                    fontSize: 20,
                    paddingVertical: 10,
                  }}>
                  {pain.painData.part_name}
                </Text>
              );
            })
          ) : (
            <Text
              style={{
                fontSize: 20,
                paddingVertical: 20,
                color: COLORS.PRIMARY_MAIN,
              }}>
              {'No Pain Locations Selected'}
            </Text>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
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
            {
              Boolean(selectedPainLocations?.length) &&
          
            <CustomButton
              onPress={() => {
                dispatch({
                  type: PAIN_LOCATIONS_ACTION.PAIN_LOCATION,
                  payload: [],
                });
              }}
              title="Clear"
              type="secondary"
              textStyle={{color: COLORS.GRAY_90, paddingLeft: 20}}
              style={{
                width: width * 0.3,
                borderColor: COLORS.PRIMARY_MAIN,
                borderWidth: 1,
              }}
            />
}
          </View>
        </View>
      </ScrollView>
      <PainLocationModal
        open={openModal}
        showFrontButton={showFrontButton}
        setShowFrontButton={setShowFrontButton}
        showFrontImage={showFrontImage}
        setShowFrontImage={setShowFrontImage}
        selectedPainLocations={selectedPainLocations}
        onClose={() => {
          setOpenModal(false);
        }}
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
