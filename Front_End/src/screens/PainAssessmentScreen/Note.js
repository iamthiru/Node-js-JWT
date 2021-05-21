import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, ScrollView, Platform} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../constants/colors';
import CustomButton from '../../components/shared/CustomButton';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import CustomTextArea from '../../components/shared/CustomTextArea';
import SpeechToText from '../../components/shared/SpeechToText';
import {useDispatch, useSelector} from 'react-redux';
import {CREATE_ASSESSMENT_ACTION, PAIN_ASSESSMENT_DATA_ACTION} from '../../constants/actions';

const {width, height} = Dimensions.get('window');

const Note = ({gotoNext, gotoPrevious,allData,setAllData}) => {
  const [notes, setNotes] = useState('');
  const dispatch = useDispatch();
  const notesSpeech = useSelector((state) => state.painAssessmentData.notes);

  const selectedAssessmentData = useSelector((state) => state.createAsseement);
  


  const setTextFromVoicePartialResults = (partialResults) => {
    setNotes((partialResults || []).join(' '));
  };
  useEffect(()=>{
    if(selectedAssessmentData?.notes){
      setNotes(selectedAssessmentData?.notes)
    }
  },[selectedAssessmentData?.notes])

  const handlePrevious = () => {
    gotoPrevious();
  };

  const handleContinue = () => {
    gotoNext();
    if (notesSpeech) {
      setNotes(notesSpeech);
    }
    dispatch({
      type:CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
      payload:{
        notes:notes
      }
    })
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
            paddingTop: 27,
            paddingBottom: 200,
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: width - 60,
              alignItems: 'center',
              marginBottom: 15,
            }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 22,
                color: COLORS.GRAY_90,
                fontWeight: '700',
                width: width - 60 - 15 - 15,
              }}>
              {'Any additional note to add?'}
            </Text>
            <CustomTouchableOpacity style={{marginLeft: 15}}>
              <AntDesignIcon
                name={'questioncircle'}
                size={15}
                color={COLORS.PRIMARY_MAIN}
              />
            </CustomTouchableOpacity>
          </View>
          <CustomTextArea
            placeholder="Enter Notes"
            value={notes}
            onChangeText={(value) => setNotes(value)}
            inputStyle={{width: width - 60, height: 169}}
          />
          <SpeechToText setPartialResults={setTextFromVoicePartialResults} />
        </View>
      </ScrollView>

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

export default Note;
