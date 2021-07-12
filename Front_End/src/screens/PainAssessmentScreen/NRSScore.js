import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    Image,
    ScrollView,
    Platform
} from 'react-native';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants/colors';
import CustomButton from '../../components/shared/CustomButton';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ScoreSlider from '../../components/shared/ScoreSlider';
import { VERBAL_ABILITY } from '../../constants/painAssessment';
import { getPainScoreImage, getPainScoreDescription } from '../../helpers/painAssessment';
import {useDispatch,useSelector} from 'react-redux'
import { CREATE_ASSESSMENT_ACTION} from '../../constants/actions';
import Analytics from '../../utils/Analytics';
import { SCREEN_NAMES } from '../../constants/navigation';

const { width, height } = Dimensions.get("window");
let startTime = 0;
let endTime = 0;



const NRSScore = ({ 
    gotoNext,
     gotoPrevious, 
     verbalAbility ,
    }) => {

    const [currentPain, setCurrentPain] = useState(0);
    const [mostPain, setMostPain] = useState(0);
    const [leastPain, setLeastPain] = useState(0);
    const [nonVerbalPainScore, setNonVerbalPainScore] = useState(0);
    const [ nrsScore , setNrsScore] = useState(null)
    const dispatch =useDispatch()
  const selectedAssessmentData = useSelector((state) => state.createAsseement);

  useEffect(()=>{
      startTime = new Date().getTime()
  },[])


  useEffect(()=>{
      if(selectedAssessmentData.non_verbal_painScore){
        if(selectedAssessmentData?.current_pain){
            setNonVerbalPainScore(selectedAssessmentData?.non_verbal_painScore)
        }
    }
    else{
      if(selectedAssessmentData?.current_pain)
      {
          setCurrentPain(selectedAssessmentData?.current_pain)
      }
      if(selectedAssessmentData?.most_pain){
          setMostPain(selectedAssessmentData?.most_pain)
      }
      if(selectedAssessmentData?.least_pain){
          setLeastPain(selectedAssessmentData?.least_pain)
      }
    }
  },[
      selectedAssessmentData?.current_pain,
      selectedAssessmentData?.most_pain,
      selectedAssessmentData?.least_pain,
      selectedAssessmentData?.non_verbal_painScore
  ])

    const handlePrevious = () => {
        gotoPrevious();
        endTime = new Date().getTime()
        /* Analytics.setCurrentScreen(
            SCREEN_NAMES.PAINASSESSMENT,
            (endTime-startTime)/1000,
            startTime,
            endTime
        ) */
    }

    const handleContinue = () => {
        endTime = new Date().getTime()
        /* Analytics.setCurrentScreen(
            SCREEN_NAMES.PAINASSESSMENT,
            (endTime-startTime)/1000,
            startTime,
            endTime
        ) */
        gotoNext();
        if(selectedAssessmentData.type !==VERBAL_ABILITY.NON_VERBAL.value)
        {
        dispatch({
            type:CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
            payload:{
                current_pain:currentPain,
                most_pain:mostPain,
                least_pain:leastPain,
                non_verbal_painScore : 0
            }
        })
    }
    else{
        dispatch({
            type:CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
            payload:{
                current_pain:nonVerbalPainScore,
                most_pain:0,
                least_pain:0,
                non_verbal_painScore : nonVerbalPainScore
            }
        })
    }
       
    }


    return (
        <>
            <ScrollView>
                {verbalAbility !== VERBAL_ABILITY.NON_VERBAL.value && <View style={{ height: 24, width: width, paddingHorizontal: 30, backgroundColor: COLORS.SECONDARY_LIGHTER, justifyContent: "center", marginTop: 5 }}>
                    <Text style={{ textAlign: "left", fontSize: 12, lineHeight: 16, color: COLORS.GRAY_90 }}>{"* 0 is no pain. 10 is the most pain"}</Text>
                </View>}

                {verbalAbility === VERBAL_ABILITY.NON_VERBAL.value && <View style={{ width: width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.PRIMARY_MAIN, backgroundColor: COLORS.WHITE, paddingHorizontal: 30, paddingVertical: 20 }}>
                    <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 20 }}>
                        <Text style={{ fontSize: 16, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60 - 15 - 15) }}>{"What is the patient’s current pain score?"}</Text>
                        <CustomTouchableOpacity style={{ marginLeft: 15 }}>
                            <AntDesignIcon name={"questioncircle"} size={15} color={COLORS.PRIMARY_MAIN} />
                        </CustomTouchableOpacity>
                    </View>

                    {[0, 2, 4, 6, 8, 10].map((score, index) => (
                        <CustomTouchableOpacity onPress={() => {
                            setNonVerbalPainScore(score)
                            }}>
                            <View style={{ width: width - 60, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: "center", backgroundColor: (score === nonVerbalPainScore? COLORS.GRAY_10 : "transparent"), borderWidth: (score === nonVerbalPainScore? 1 : 0), borderColor: COLORS.PRIMARY_DARKER, borderRadius: 5 }}>
                                <Image style={{ width: 45, height: 45, marginRight: 16 }} source={getPainScoreImage(score)} />
                                <Text style={{ fontSize: 24, lineHeight: 29, color: COLORS.GRAY_90, marginRight: 12 }}>{score}</Text>
                                <Text style={{ fontSize: 14, lineHeight: 20, color: COLORS.GRAY_90 }}>{getPainScoreDescription(score)}</Text>
                            </View>
                        </CustomTouchableOpacity>
                    ))}
                </View>}

                {verbalAbility !== VERBAL_ABILITY.NON_VERBAL.value && <>
                    <View style={{ width: width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.PRIMARY_MAIN, backgroundColor: COLORS.WHITE, paddingHorizontal: 30, paddingVertical: 20, marginBottom: 12 }}>
                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 16, }}>
                            <Text style={{ fontSize: 16, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60 - 15 - 15) }}>{"What is the patient’s current pain score?"}</Text>
                            <CustomTouchableOpacity style={{ marginLeft: 15 }}>
                                <AntDesignIcon name={"questioncircle"} size={15} color={COLORS.PRIMARY_MAIN} />
                            </CustomTouchableOpacity>
                        </View>
                        <ScoreSlider 
                        sliderWidth={width - 90} 
                        value={currentPain} 
                        onValueChange={(value) =>{
                                setCurrentPain(value) 
                                setNrsScore({
                                    ...nrsScore,
                                    current_pain:currentPain
                                })           
                            } 
                                }/>
                    </View>

                    <View style={{ width: width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.PRIMARY_MAIN, backgroundColor: COLORS.WHITE, paddingHorizontal: 30, paddingVertical: 20, marginBottom: 12 }}>
                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 16 }}>
                            <Text style={{ fontSize: 16, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60 - 15 - 15) }}>{"What’s the LEAST Pain in the past 24 h?"}</Text>
                            <CustomTouchableOpacity style={{ marginLeft: 15 }}>
                                <AntDesignIcon name={"questioncircle"} size={15} color={COLORS.PRIMARY_MAIN} />
                            </CustomTouchableOpacity>
                        </View>
                        <ScoreSlider 
                        sliderWidth={width - 90} 
                        value={leastPain} 
                        onValueChange={(value) => {
                            setLeastPain(value)
                            setNrsScore({
                                ...nrsScore,
                                least_pain:leastPain
                            })
                            }} />
                    </View>

                    <View style={{ width: width, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.PRIMARY_MAIN, backgroundColor: COLORS.WHITE, paddingHorizontal: 30, paddingVertical: 20, marginBottom: 12 }}>
                        <View style={{ flexDirection: "row", width: (width - 60), alignItems: "center", marginBottom: 16 }}>
                            <Text style={{ fontSize: 16, lineHeight: 22, color: COLORS.GRAY_90, fontWeight: "700", maxWidth: (width - 60 - 15 - 15) }}>{"What’s the MOST Pain in the past 24 h?"}</Text>
                            <CustomTouchableOpacity style={{ marginLeft: 15 }}>
                                <AntDesignIcon name={"questioncircle"} size={15} color={COLORS.PRIMARY_MAIN} />
                            </CustomTouchableOpacity>
                        </View>
                        <ScoreSlider 
                        sliderWidth={width - 90} 
                        value={mostPain} 
                        onValueChange={(value)=> {
                            setMostPain(value)
                            setNrsScore({
                                ...nrsScore,
                                most_pain:mostPain
                            })
                            }} />
                    </View>
                </>}
            </ScrollView>

            <View style={{ flexDirection: "row", width: width, paddingHorizontal: 13, marginBottom: 15 + (Platform.OS === "ios" ? getStatusBarHeight() : 0), marginTop: 10, alignItems: "flex-end", justifyContent: "space-between" }}>
                <CustomButton
                    onPress={() => handlePrevious()}
                    title="Previous"
                    textStyle={{ color: COLORS.GRAY_90 }}
                    type="secondary"
                    style={{ width: ((width - 16 - 16 - 75) / 2), backgroundColor: COLORS.WHITE }}
                    iconLeft={<AntDesignIcon name={"arrowleft"} size={16} color={COLORS.GRAY_90} />}
                />
                <CustomButton
                    onPress={() => handleContinue()}
                    title="Continue"
                    textStyle={{ color: COLORS.GRAY_90 }}
                    style={{ width: ((width - 16 - 16 - 75) / 2), backgroundColor: COLORS.SECONDARY_MAIN, borderColor: COLORS.PRIMARY_MAIN, borderWidth: 1 }}
                    iconRight={<AntDesignIcon name={"arrowright"} size={16} color={COLORS.GRAY_90} />}
                />
            </View>
        </>
    );
};

export default NRSScore;
