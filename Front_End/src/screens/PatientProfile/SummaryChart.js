import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, Text, Dimensions, Animated} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import SummaryChartReport from '../../components/SummaryChatReport';

import {COLORS} from '../../constants/colors';
import {formatAMPM, padNumber} from '../../utils/date';
import styles from './styles';
const {width, height} = Dimensions.get('window');
import {useDispatch, useSelector} from 'react-redux';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {PATIENT_PROFILE_UPDATE_ACTION} from '../../constants/actions';

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
  barRadius: 10,
};

const TIME_FILTER_OPTIONS = ['6 Hours', '12 Hours', '1 Day', '1 Week', 'All'];

const SummaryChart = ({
  patientData,
  patientReport,
  last_assessment,
  last_medication,
  lookup_data,
  handleSummaryChartData,
  summaryChartLabels,
  scrollRef,
  allAssessmentList,
}) => {
  const [showMarker, setShowMarker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(TIME_FILTER_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [xPoint, setXPoint] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [slideValue] = useState(new Animated.Value(0));
  const [barSlideValue] = useState(new Animated.Value(0));
  const [sliderXValue] = useState(new Animated.Value(0));
  const [summaryReportData, setSummaryReport] = useState({});
  const [chartDataPresent, setChartDataPresent] = useState(false);
  const [showNrsData, setShowNrsData] = useState(false);
  const [showAllChartData, setShowAllChartData] = useState(false);
  const all_assessment_data = Boolean(last_assessment)
    ? last_assessment?.assessment
    : null;
  const all_medication_data = Boolean(last_medication)
    ? last_assessment?.medication
    : null;
  const forceUpdate = useSelector((state) => state.patientProfileUpdate.update);
  
  const currentPageData = useMemo(() => {
      return patientData?.filter((_, index) => {
       
          return index >= 6 * currentPage - 6 &&  index < 6 * currentPage;
       
      });
  }, [patientData, currentPage]);


  useEffect(() => {
      if (patientData?.length) {
        let length = parseInt( patientData?.length/6)
        setCurrentPage(parseInt(length || 1));
      }   
  }, [patientData]);

  useEffect(() => {
    if (currentPageData?.length) {
      setCurrentIndex(currentPageData?.length-1);
    }
  }, [currentPageData]);



  let impact = [];
  let nrs = [];
  const data = {
    labels: (summaryChartLabels || []).filter(
      (_, index) => index >= 6 * currentPage - 6 && index < 6 * currentPage,
    ),
    datasets: [
      {
        data: currentPageData?.map((data) => {
          impact.push(data.value);
          if (data?.value === 99) {
            return 0;
          } else {
            return data?.value || 0;
          }
        }),
        color: (opacity = 1) => COLORS.SECONDARY_MAIN, // optional
        strokeWidth: 2, // optional,
      },
      {
        data: currentPageData?.map((score) => {
          nrs.push(score.score);
          return score?.score;
        }),
        color: (opacity = 1) => 'orange', // optional
        strokeWidth: 2, // optional,
      } || [],
    ],
    labelColor: () => COLORS.WHITE,
  };
  useEffect(() => {
    if (currentPageData?.length === 0) {
      setShowMarker(false);
    }
  }, [currentPageData]);

  useEffect(() => {
    Animated.timing(slideValue, {
      toValue: xPoint < 20 ? 20 : xPoint > width - 120 ? width - 140 : xPoint,
      useNativeDriver: false,
      duration: 500,
    }).start();
    Animated.timing(sliderXValue, {
      toValue: xPoint,
      useNativeDriver: false,
      duration: 500,
    }).start();
    Animated.timing(barSlideValue, {
      toValue: xPoint + 59,
      useNativeDriver: false,
      duration: 500,
    }).start();
  }, [xPoint, slideValue, barSlideValue, sliderXValue]);

  useEffect(() => {
    handleSummaryChartData(0);
  }, [allAssessmentList?.length, forceUpdate]);

  const impactScoreData = useMemo(() => {
    if (impact[currentIndex] === 99) {
      return `IMPACT N/A`;
    } else {
      return `IMPACT  ${impact[currentIndex]}`;
    }
  }, [currentIndex]);

  const handleOnDataPointClick = useCallback(
    (x, index, dataset, value) => {
      // if (
      //   (impact[index] === value && nrs[index] === value) ||
      //   (impact[index] === 99 && nrs[index] === 0)
      // ) {
      //   setShowAllChartData(true);
      // } else if (JSON.stringify(dataset.data) == JSON.stringify(nrs)) {
      //   setShowNrsData(true);
      //   setShowAllChartData(false);
      // } else {
      //   setShowNrsData(false);
      //   setShowAllChartData(false);
      // }
      setShowAllChartData(true);
      setXPoint(x - 45);
      setShowMarker(index !== currentIndex ? true : !showMarker);
      setCurrentIndex(index);
      // setSummaryReport({
      //   date: currentPageData?.[currentIndex]?.time,
      //   impact_score: currentPageData?.[currentIndex]?.value,
      //   medication: currentPageData?.[currentIndex]?.medicationData,
      //   nrs_score: currentPageData?.[currentIndex]?.score,
      // });
    },
    [showMarker, currentIndex],
  );
  return (
    <View
      style={[
        styles.patientCardContainer,
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 15,
        },
      ]}>
      <View
        style={{
          width: width - 30,
          zIndex: 1,
        }}>
        <Text style={styles.summaryChatText}>Summary Chart</Text>
      </View>
      <View style={styles.summaryChat_mainView}>
        {Boolean(TIME_FILTER_OPTIONS?.length) &&
          TIME_FILTER_OPTIONS.map((timeOption, index) => {
            const active = timeOption === selectedTime;
            return (
              <CustomTouchableOpacity
                key={timeOption + index}
                style={{
                  width: (width - 30) / TIME_FILTER_OPTIONS.length - 5,
                  height: 21,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                  backgroundColor: active ? COLORS.PRIMARY_MAIN : COLORS.WHITE,
                }}
                onPress={() => {
                  setSelectedTime(timeOption);
                  handleSummaryChartData(index);
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 16,
                    color: active ? COLORS.WHITE : COLORS.GRAY_90,
                    fontWeight: '400',
                  }}>
                  {timeOption}
                </Text>
              </CustomTouchableOpacity>
            );
          })}
      </View>
      {showMarker && (
        <>
          <Animated.View
            style={{
              position: 'absolute',
              top: 80,
              left: slideValue,
              width: width > 400 ? 170 : 150,
              // height:  height > 900 ? 100 :80,
              minHeight: 80,
              backgroundColor: COLORS.WHITE,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: COLORS.PRIMARY_MAIN,
              zIndex: 2,
              padding: 4,
            }}>
            <Text
              style={{
                textAlign: 'center',
              }}>
              {Boolean(currentPageData?.length)
                ? `${padNumber(
                    new Date(currentPageData?.[currentIndex]?.time).getMonth() +
                      1,
                  )}/${padNumber(
                    new Date(currentPageData?.[currentIndex]?.time).getDate(),
                  )}/${new Date(
                    currentPageData?.[currentIndex]?.time,
                  ).getFullYear()} ${formatAMPM(
                    new Date(currentPageData?.[currentIndex]?.time),
                  )}`
                : ''}
            </Text>
            {showAllChartData && (
              <>
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 22,
                    backgroundColor: 'pink',
                  }}>
                  {'NRS SCORE  ' + nrs?.[currentIndex]}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 22,
                    backgroundColor: COLORS.SECONDARY_MAIN,
                  }}>
                  {impactScoreData}
                </Text>
              </>
            )}
            {/* {showNrsData && !showAllChartData && (
              <Text
                style={{
                  textAlign: 'center',
                  lineHeight: 22,
                  backgroundColor: 'pink',
                }}>
                {'NRS SCORE  ' + nrs?.[currentIndex]}
              </Text>
            )} */}
            {/* {!showNrsData && !showAllChartData && (
              <Text
                style={{
                  textAlign: 'center',
                  lineHeight: 22,
                  backgroundColor: COLORS.SECONDARY_MAIN,
                }}>
                {impactScoreData}
              </Text>
            )} */}
            <Text
              style={{
                textAlign: 'center',
              }}>
              {Boolean(currentPageData?.length)
                ? currentPageData?.[currentIndex]?.medicationData
                : ''}
            </Text>
          </Animated.View>
          {[
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
          ].map((data, index) => {
            return (
              <Animated.View
                key={data.toString() + index}
                style={{
                  position: 'absolute',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderRadius: 1,
                  width: 2,
                  height: 4,
                  top: 80 + 66 + index * 4 * 2,
                  left: barSlideValue,
                  borderColor: COLORS.PRIMARY_MAIN,
                  zIndex: 2,
                }}></Animated.View>
            );
          })}
        </>
      )}

      <View
        style={{
          position: 'absolute',
          left: 30,
          top: 100,
          height: 200,
          width: width * 0.9,
          zIndex: 10,
        }}>
        <View
          style={{
            width: width * 0.85,
            flexDirection: 'row',
            justifyContent: Boolean(currentPage >= 2)
              ? 'space-between'
              : 'flex-end',
          }}>
          {Boolean(currentPage >= 2) && (
            <CustomTouchableOpacity
              onPress={() => {
                setCurrentPage(currentPage < 2 ? 1 : currentPage - 1);
              }}>
              <AntDesignIcon
                name={'arrowleft'}
                style={{
                  fontSize: 28,
                  color: COLORS.PRIMARY_MAIN,
                }}
              />
            </CustomTouchableOpacity>
          )}
          {Boolean(currentPage < parseInt(patientData?.length / 6)) && (
            <CustomTouchableOpacity
              onPress={() => {
                setCurrentPage(
                  currentPage >= parseInt(patientData?.length / 6)
                    ? 1
                    : currentPage + 1,
                );
              }}>
              <AntDesignIcon
                name={'arrowright'}
                style={{
                  fontSize: 28,
                  color: COLORS.PRIMARY_MAIN,
                }}
              />
            </CustomTouchableOpacity>
          )}
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          left: 80,
          top: 110,
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 1,
        }}>
        <View
          style={{
            marginRight: 10,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: Boolean(currentPageData?.length)
              ? COLORS.PRIMARY_MAIN
              : COLORS.WHITE,
          }}></View>
        <Text>{Boolean(currentPageData.length) ? 'IMPACT score' : ''}</Text>
      </View>
      <View
        style={{
          position: 'absolute',
          left: 80,
          top: 130,
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 1,
        }}>
        <View
          style={{
            marginRight: 10,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: Boolean(currentPageData?.length)
              ? 'orange'
              : COLORS.WHITE,
          }}></View>
        <Text>{Boolean(currentPageData.length) ? 'NRS score' : ''}</Text>
      </View>

      {Boolean(currentPageData?.length) ? (
        <LineChart
          data={data || []}
          width={width - 30}
          height={450}
          chartConfig={chartConfig}
          withHorizontalLines={false}
          withVerticalLines={false}
          verticalLabelRotation={-45}
          fromZero={true}
          getDotColor={(dataPoint, index) => {
            if (data.datasets[0].data[index] === dataPoint) {
              return COLORS.PRIMARY_MAIN;
            } else if (data.datasets[1].data[index] === dataPoint) {
              return 'orange';
            }
            return COLORS.PRIMARY_MAIN;
          }}
          style={{
            paddingRight: 40,
            backgroundColor: COLORS.WHITE,
            marginLeft: 40,
            paddingTop: 70,
            marginTop: -60,
          }}
          onDataPointClick={({x, index, dataset, value}) => {
            handleOnDataPointClick(x, index, dataset, value);
          }}
          xLabelsOffset={10}
        />
      ) : (
        <View
          style={{
            paddingVertical: 30,
          }}>
          <Text style={styles.summaryChatText}>
            {'No Summary Chart Data Found'}
          </Text>
        </View>
      )}
      {Boolean(currentPageData.length) && (
        <View
          style={{
            width: width - 60,
            marginLeft: 30,
            height: 10,
            backgroundColor: COLORS.GRAY_40,
            borderRadius: 5,
            marginTop: 5,
          }}>
          {showMarker && (
            <Animated.View
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
                alignItems: 'center',
              }}>
              <CustomTouchableOpacity
                style={{
                  width: 10,
                  height: 19,
                }}
                disabled>
                <Text
                  style={{
                    color: COLORS.BLACK,
                    fontWeight: '700',
                    transform: [
                      {
                        scaleY: 1.5,
                      },
                    ],
                  }}>
                  {'<'}
                </Text>
              </CustomTouchableOpacity>
              <CustomTouchableOpacity
                style={{
                  width: 10,
                  height: 19,
                  alignItems: 'flex-end',
                }}
                disabled>
                <Text
                  style={{
                    color: COLORS.BLACK,
                    fontWeight: '700',
                    transform: [
                      {
                        scaleY: 1.5,
                      },
                    ],
                  }}>
                  {'>'}
                </Text>
              </CustomTouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}
      <SummaryChartReport
        data={summaryReportData}
        patientReport={patientReport}
        all_assessment_data={all_assessment_data}
        all_medication_data={all_medication_data}
        lookup_data={lookup_data}
        patientData={currentPageData}
        chartDataPresent={chartDataPresent}
        scrollRef={scrollRef}
        date={currentPageData?.[currentIndex]?.time}
        impact_score={impact[currentIndex]}
        medication={currentPageData?.[currentIndex]?.medicationData}
        nrs_score={nrs[currentIndex]}
      />
    </View>
  );
};

export default SummaryChart;
