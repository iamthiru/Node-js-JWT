import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    Animated
} from 'react-native';
import {
    LineChart
  } from "react-native-chart-kit";
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import SummaryChartReport from '../../components/SummaryChatReport';

import { COLORS } from '../../constants/colors';
import styles from './styles'
import {useSelector} from 'react-redux'
const { width, height } = Dimensions.get("window");

const chartConfig = {
    backgroundGradientFrom: COLORS.GRAY_10,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: COLORS.GRAY_10,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => COLORS.PRIMARY_MAIN,
    strokeWidth: 1, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional,
    fillShadowGradient: COLORS.PRIMARY_LIGHTER,
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
    propsForDots: {
        fill: COLORS.PRIMARY_MAIN
    },
    barRadius: 10
  };

const TIME_FILTER_OPTIONS = [
    '6 Hours',
    '12 Hours',
    '1 Day',
    '1 Week',
    'All'
]

const SummaryChart = ({ 
    patientData,
    patientReport,
    last_assessment,
    last_medication,
    lookup_data
 }) => {
    const [selectedTime, setSelectedTime] = useState(TIME_FILTER_OPTIONS[0])
    const [xPoint, setXPoint] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showMarker, setShowMarker] = useState(false)
    const [slideValue] = useState(new Animated.Value(0))
    const [barSlideValue] = useState(new Animated.Value(0))
    const [sliderXValue] = useState(new Animated.Value(0))

    const all_assessment_data =last_assessment?.assessment
    const all_medication_data = last_assessment?.medication
  const all_assessment_list = useSelector((state)=>state.allAssessmentList)




      const data = {
        labels: [],
        datasets: [
          {
            data:patientData?.map(data => {
                return data.value
            }),
            color: (opacity = 1) => COLORS.SECONDARY_MAIN, // optional
            strokeWidth: 2 // optional,
          }
        ],
        labelColor: () => COLORS.WHITE
      };

    useEffect(() => {
        Animated.timing(slideValue, {
            toValue: xPoint < 20 ? 20 : xPoint > width - 120 ? width - 140 : xPoint,
            useNativeDriver: false,
            duration: 500
        }).start()
        Animated.timing(sliderXValue, {
            toValue: xPoint,
            useNativeDriver: false,
            duration: 500
        }).start()
        Animated.timing(barSlideValue, {
            toValue: xPoint+59,
            useNativeDriver: false,
            duration: 500
        }).start()
    }, [
        xPoint,
        slideValue,
        barSlideValue,
        sliderXValue
    ])
    

    return (
        <View
           style={[
               styles.patientCardContainer,
               {
                   alignItems: 'center',
                   justifyContent: 'center',
                   paddingVertical: 15
               }
           ]}
        >
            <View
                style={{
                    width: width - 30,
                    zIndex: 1
                }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        lineHeight: 28,
                        fontWeight: '700',
                        color: COLORS.PRIMARY_MAIN
                    }}
                >
                    Summary Chart
                </Text>
            </View>
            <View
                style={{
                    width: width - 30,
                    marginHorizontal: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    zIndex: 1,
                    marginTop: 10
                }}
            >
                {Boolean(TIME_FILTER_OPTIONS?.length) &&
                    TIME_FILTER_OPTIONS.map((timeOption, index) => {
                        const active = timeOption === selectedTime
                        return (
                            <CustomTouchableOpacity
                                key={timeOption+index}
                                style={{
                                    width: (width - 30)/TIME_FILTER_OPTIONS.length - 5,
                                    height: 21,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5,
                                    backgroundColor: active ? COLORS.PRIMARY_MAIN : COLORS.WHITE
                                }}
                                onPress={() => {
                                    setSelectedTime(timeOption)
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 12,
                                        lineHeight: 16,
                                        color: active ? COLORS.WHITE : COLORS.GRAY_90,
                                        fontWeight: '400'
                                    }}
                                >
                                    {timeOption}
                                </Text>
                            </CustomTouchableOpacity>
                        )
                    } )
                }
            </View>
            {showMarker &&
            <>
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 80,
                        left: slideValue,
                        width: 120,
                        height: 66,
                        backgroundColor: COLORS.WHITE,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: COLORS.PRIMARY_MAIN,
                        zIndex: 2,
                        padding: 4
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        {patientData?.[currentIndex]?.time}
                    </Text>
                    <Text
                         style={{
                            textAlign: 'center',
                            lineHeight: 22,
                            backgroundColor: COLORS.SECONDARY_MAIN
                        }}
                    >
                    {"IMPACT "+patientData?.[currentIndex]?.value}


                    </Text>
                    <Text
                         style={{
                            textAlign: 'center'
                        }}
                    >
                    {/* {"xxmed "+patientData?.[currentIndex]?.xxmed+"mg"} */}
                    {patientData?.[currentIndex]?.medicationData}
                    </Text>
                </Animated.View>
                {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29 ].map((data, index) => {

                        return (
                            <Animated.View
                            key={data.toString()+index}
                            style={{
                                position: 'absolute',
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderRadius: 1,
                                width: 2,
                                height: 4,
                                top: 80+66 + (index*4*2),
                                left: barSlideValue,
                                borderColor: COLORS.PRIMARY_MAIN,
                                zIndex: 2,
                            }}
                        >
        
                        </Animated.View>
                        )
                    })
                }
                </>
            }
            <View
                style={{
                    position: 'absolute',
                    left: 80,
                    top: 110,
                    flexDirection: 'row',
                    alignItems: 'center',
                    zIndex: 1
                }}
            >
                <View
                    style={{
                        marginRight: 10,
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: COLORS.PRIMARY_MAIN
                    }}
                >

                </View>
                <Text>
                    IMPACT score
                </Text>
            </View>
            <LineChart
                data={data}
                width={width - 30}
                height={300}
                chartConfig={chartConfig}
                withHorizontalLines={false}
                withVerticalLines={false}
                fromZero={true}
                style={{
                    paddingRight: 40,
                    backgroundColor: COLORS.WHITE,
                    marginLeft: 40,
                    paddingTop: 70,
                    marginTop: -60
                }}
                onDataPointClick={({ x, index }) => {
                    setXPoint(x - 45)
                    setCurrentIndex(index)
                    setShowMarker((index !== currentIndex) || !showMarker)
                }}
                xLabelsOffset={10}
            />
            <View
                style={{
                    width: width - 60,
                    marginLeft: 30,
                    height: 10,
                    backgroundColor: COLORS.GRAY_40,
                    borderRadius: 5,
                    marginTop: 5
                }}
            >
                {showMarker && <Animated.View
                    style={{
                        position: 'absolute',
                        top: -5,
                        left: sliderXValue,
                        height: 20,
                        borderRadius: 10,
                        width: 30,
                        borderWidth: 2,
                        borderColor: COLORS.PRIMARY_MAIN,
                        backgroundColor: COLORS.SECONDARY_MAIN,
                        padding: 2,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <CustomTouchableOpacity
                        style={{
                            width: 10,
                            height: 19
                        }}
                        disabled
                    >
                        <Text
                            style={{
                                color: COLORS.BLACK,
                                fontWeight: '700',
                                transform: [{
                                    scaleY: 1.5
                                }]
                            }}
                        >
                            {'<'}
                        </Text>
                    </CustomTouchableOpacity>
                    <CustomTouchableOpacity
                        style={{
                            width: 10,
                            height: 19,
                            alignItems: 'flex-end'
                        }}
                        disabled
                    >
                        <Text
                            style={{
                                color: COLORS.BLACK,
                                fontWeight: '700',
                                transform: [{
                                    scaleY: 1.5
                                }]
                            }}
                        >
                            {'>'}
                        </Text>
                    </CustomTouchableOpacity>
                </Animated.View>}
            </View>
            <SummaryChartReport 
            patientReport ={patientReport}
            all_assessment_data={all_assessment_data}
            all_medication_data ={all_medication_data}
            lookup_data={lookup_data}



             />
        </View>
    );
};

export default SummaryChart;
