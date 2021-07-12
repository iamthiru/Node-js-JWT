import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  Dimensions,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Image,
  PixelRatio,
  NativeModules,
  TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {RNCamera} from 'react-native-camera';
import Slider from '@react-native-community/slider';
import {RNFFmpeg} from 'react-native-ffmpeg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import CameraRoll from '@react-native-community/cameraroll';
import MovToMp4 from 'react-native-mov-to-mp4';
import Video from 'react-native-video';
import DeviceInfo from 'react-native-device-info';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import styles from './styles';
import {secondsToMinsAndSecs} from '../../utils/date';
import {COLORS} from '../../constants/colors';

import S3 from 'aws-sdk/clients/s3';
import fs from 'react-native-fs';
import {decode, encode} from 'base64-arraybuffer';

import {
  ACCESS_ID,
  ACCESS_KEY,
  BUCKET_FOLDER_FOR_PUPIL,
  BUCKET_FOLDER_FOR_PUPIL_RESULT,
  BUCKET_NAME,
} from '../../constants/aws';
import {initiatePupilVideoProcessingAPI} from '../../api/painAssessment';
import {SCREEN_NAMES} from '../../constants/navigation';
import DummyImageChart from '../../assets/images/dummyChartImage.png';
import CustomButton from '../../components/shared/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
// import FocusDepthSliderModal from '../../components/FocusDepthSlider';
import {CREATE_ASSESSMENT_ACTION} from '../../constants/actions';
import Analytics from '../../utils/Analytics';

const {width, height} = Dimensions.get('window');
const {VideoCropper} = NativeModules;

let camera = null;
let intervalId = null;
let processingIntervalId = null;

const EYE_BORDER_TYPE = {
  OVAL: 'oval',
  RECTANGLE: 'rectangle',
};

const CAPTURE_MODE = {
  AUTO: 'auto',
  MANUAL: 'manual',
};
// const FOCUS_DEPTH_MODE = {
// AUTOFOCUS_DEPTH_MODE:'auto focusDepth',
// MANUAL_FOCUSDEPTH_MODE :' manual focusDepth'
// }

const SETTINGS = {
  ZOOM: 'zoom',
  EXPOSURE: 'exposure',
  FOCUS_DEPTH: 'focusDepth',
};

const DEFAULT_DARK_BROWN_EXPOSURE = 0.8;
const DEFAULT_OTHER_EXPOSURE = 0.6; //0.0; //0.2

const MIN_HEIGHT = Dimensions.get('window').height;

const PupillaryDilationScreen = ({navigation}) => {
  const deviceModel = DeviceInfo.getModel();
  const [eyeBorderType, setEyeBorderType] = useState(EYE_BORDER_TYPE.OVAL);
  const [showSpinner, setShowSpinner] = useState(false);
  const [spinnerMessage, setSpinnerMessage] = useState('');
  const [selectedSetting, setSelectedSetting] = useState('');
  const [exposure, setExposure] = useState(DEFAULT_OTHER_EXPOSURE);
  const [autoAdjust, setAutoAdjust] = useState(0.0);
  const [zoom, setZoom] = useState(Platform.OS === "ios" ? 0.002 : 0.1)
  // const [zoom, setZoom] = useState(0.01);
  // const [focusDepth, setFocusDepth] = useState(0.3)
  const [focusDepth, setFocusDepth] = useState(0.0);
  const [timer, setTimer] = useState('0');
  const [duration, setDuration] = useState('00:00');
  const [processing, setProcessing] = useState(false);
  const [captureMode, setCaptureMode] = useState(CAPTURE_MODE.AUTO);
  // const [focusDepthMode,setFocusDepthMode] = useState(FOCUS_DEPTH_MODE.AUTOFOCUS_DEPTH_MODE)
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState('');
  const [resultReady, setResultReady] = useState(false);
  const [showProcessedResult, setShowProcessedResult] = useState(false);
  const [downloadFileName, setDownloadFileName] = useState('');
  const [resultValue, setResultValue] = useState('');
  const [resultImageURI, setResultImageURI] = useState('');
  const [fps, setFps] = useState(60);
  const [flashOn, setFlashOn] = useState(false);
  const [isDarkBrownEyes, setIsDarkBrownEyes] = useState(false);
  const [processingTimer, setProcessingTimer] = useState('0');
  // const [showBrightnessSlider, setShowBrightnessSlider] = useState(false);
  // const [focusDepthOn,setFocusDepthOn] = useState(false)
  const [foucsPoints, setFocusPoints] = useState({
    x: 0.5,
    y: 0.5,
    autoExposure: true,
  });

  const patientData = useSelector((state) => state.patientData.patient);

  const dispatch = useDispatch();
  // const [showFocusDepthSliderModal , setShowFocusDepthSliderModal ] = useState(false)

  // var pressOut;
  useEffect(() => {
    setTimeout(() => checkStoragePermission(), 3000);
  }, []);

  useEffect(() => {
    let startTime = 0;
    let endTime = 0;
    const unsubscribeFocus = navigation.addListener('focus', () => {
      startTime = new Date().getTime();
    });

    const unsubscribeBlur = navigation.addListener('blur', (e) => {
      endTime = new Date().getTime();
      let screenName =
        e && e.target && e.target.substring(0, e.target.indexOf('-'));
      Analytics.setCurrentScreen(
        screenName,
        (endTime - startTime) / 1000,
        startTime,
        endTime,
      );
    });

    const unsubscribeBeforeRemove = navigation.addListener(
      'beforeRemove',
      (e) => {
        endTime = new Date().getTime();
        let screenName =
          e && e.target && e.target.substring(0, e.target.indexOf('-'));
        Analytics.setCurrentScreen(
          screenName,
          (endTime - startTime) / 1000,
          startTime,
          endTime,
        );
      },
    );

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      unsubscribeBeforeRemove();
    };
  }, [navigation]);

  const checkStoragePermission = async () => {
    if (Platform.OS !== 'android') {
      return;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to store files',
        },
      );
    } catch (err) {
      console.warn(err);
    }
  };

  const toggleSettings = (setting) => {
    setSelectedSetting(setting === selectedSetting ? '' : setting);
  };

  const switchCamera = () => {
    setCameraType(
      cameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back,
    );
  };

  const switchEyeBorderType = () => {
    setEyeBorderType(
      eyeBorderType === EYE_BORDER_TYPE.OVAL
        ? EYE_BORDER_TYPE.RECTANGLE
        : EYE_BORDER_TYPE.OVAL,
    );
  };

  const startProcessingTimer = () => {
    let timerValue = 0;
    processingIntervalId = setInterval(() => {
      timerValue += 1;
      setProcessingTimer(timerValue.toString());
    }, 1000);
  };

  const clearProcessingTimer = () => {
    setProcessingTimer('0');
    clearInterval(processingIntervalId);
  };

  const onStartRecordingPress = () => {
    setProcessing(true);
    let timerValue = 3;
    setTimer(timerValue.toString());

    intervalId = setInterval(() => {
      timerValue -= 1;
      timerValue >= 1 && setTimer(timerValue.toString());
    }, 1000);
    setTimeout(() => {
      setProcessing(false);
      setTimer('0');
      clearInterval(intervalId);
      recordVideo();
    }, 3000);
  };

  const recordVideo = () => {
    if (!isCameraReady) {
      return;
    }

    const recordOptions = {
      mute: true,
      quality: RNCamera.Constants.VideoQuality['1080p'],
    };

    camera
      .recordAsync(recordOptions)
      .then(async (data) => {
        console.log('videoData: ', data);

        setShowSpinner(true);
        setSpinnerMessage('Cropping...');
        startProcessingTimer();

        cropVideo(
          data.uri,
          (croppedVideoPath) => {
            setSpinnerMessage('Converting FrameRate...');
            let resultPath = `${croppedVideoPath.substring(
              0,
              croppedVideoPath.lastIndexOf('.'),
            )}_2.mp4`;
            RNFFmpeg.execute(
              `-i ${croppedVideoPath} -filter:v fps=${fps} -preset ultrafast ${resultPath}`,
            )
              .then(async (res) => {
                console.log('RRFFMPEG - FPS Conversion Success', resultPath);
                if (Platform.OS === 'ios') {
                  setShowSpinner(false);
                  setSpinnerMessage('');
                  clearProcessingTimer();
                  setIsRecording(false);
                  setVideoURL(resultPath);
                } else {
                  setShowSpinner(false);
                  setSpinnerMessage('');
                  clearProcessingTimer();
                  setIsRecording(false);
                  setVideoURL(resultPath);
                }
              })
              .catch((err) => {
                console.log('RRFFMPEG - FPS Conversion Error', err);
                setShowSpinner(false);
                setSpinnerMessage('');
                clearProcessingTimer();
                setIsRecording(false);
                setVideoURL(croppedVideoPath);
              });
          },
          (error) => {
            setShowSpinner(false);
            setSpinnerMessage('');
            clearProcessingTimer();
            setIsRecording(false);
            setVideoURL(error.originalPath);
          },
        );
      })
      .catch((err) => {
        setIsRecording(false);
      });
  };

  const cropVideo = async (videoURI, successCallback, errorCallback) => {
    const deviceModel = await DeviceInfo.getModel();

    let screenWidth = 1080;
    const paddingValue = screenWidth * (60 / width);
    const offSetY = width > 550 ? 300 : 100;
    let options = {
      cropWidth: screenWidth,
      cropHeight: parseInt((screenWidth + paddingValue) / 2),
      cropOffsetX: 0,
      cropOffsetY:
        parseInt((screenWidth - (screenWidth + paddingValue) / 2) / 2) +
        offSetY +
        (['iPhone 7 Plus', 'IN2025'].includes(deviceModel) ? 195 : 0),
    };

    if (Platform.OS === 'ios') {
      options.quality = '1920x1080';
    }

    try {
      if (Platform.OS === 'ios') {
        VideoCropper.crop(videoURI, options, (error, croppedVideoPath) => {
          if (!error) {
            console.log('VideoCropper - Crop Success', croppedVideoPath);
            successCallback(croppedVideoPath);
          } else {
            console.log('VideoCropper - Crop Error', error);
            errorCallback({originalPath: videoURI});
          }
        });
        return;
      } else {
        let croppedResultPath = `${videoURI.substring(
          0,
          videoURI.lastIndexOf('.'),
        )}_crop.mp4`;
        // RNFFmpeg.execute(`-i ${videoURI} -filter:v "crop=${options.cropWidth}:${options.cropHeight}:${options.cropOffsetX}:${options.cropOffsetY}" ${croppedResultPath}`).then( async result => {
        RNFFmpeg.execute(
          `-y -i ${videoURI} -vf "crop=${options.cropWidth}:${options.cropHeight}:${options.cropOffsetX}:${options.cropOffsetY}" -preset ultrafast -c:a copy -strict -2 ${croppedResultPath}`,
        )
          .then(async (result) => {
            console.log('RRFFMPEG - Crop Success', croppedResultPath);
            successCallback(croppedResultPath);
          })
          .catch((error) => {
            console.log('RRFFMPEG - Crop Error', error);
            errorCallback({originalPath: videoURI});
          });
      }
    } catch (error) {
      console.log('error', error);
      errorCallback({originalPath: videoURI});
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    let durationValue = 0;
    setDuration('00:00');
    intervalId = setInterval(() => {
      durationValue += 1;
      (captureMode === CAPTURE_MODE.MANUAL ||
        (captureMode === CAPTURE_MODE.AUTO && durationValue <= 10)) &&
        setDuration(secondsToMinsAndSecs(durationValue));
    }, 1000);

    if (captureMode === CAPTURE_MODE.AUTO) {
      setTimeout(() => {
        stopRecordingVideo();
      }, 11000);
    }
  };

  const stopRecordingVideo = () => {
    camera.stopRecording();
  };

  const handleStopRecording = () => {
    // setIsRecording(false);
    setDuration('00:00');
    clearInterval(intervalId);
  };

  const onDownloadPress = () => {
    if (false && Platform.OS === 'ios') {
      const filename = `VID_${Date.now().toString()}`;
      MovToMp4.convertMovToMp4(videoURL, filename).then(function (results) {
        CameraRoll.save(results, {type: 'video'})
          .then((res) => {
            Alert.alert('Success', 'Video has been saved successfully!');
            resetStates();
          })
          .catch((err) => {
            Alert.alert('Error', 'Download Failed!');
            resetStates();
          });
      });
    } else {
      CameraRoll.save(videoURL, {type: 'video'})
        .then((res) => {
          Alert.alert('Success', 'Video has been saved successfully!');
          // resetStates();
        })
        .catch((err) => {
          Alert.alert('Error', 'Download Failed!');
          // resetStates();
        });
    }
  };

  const onUploadPress = async () => {
    setShowSpinner(true);
    setSpinnerMessage('Uploading...');
    startProcessingTimer();

    try {
      const s3bucket = new S3({
        accessKeyId: ACCESS_ID,
        secretAccessKey: ACCESS_KEY,
        Bucket: BUCKET_NAME,
        signatureVersion: 'v4',
      });

      let filename = `VID_${Date.now().toString()}.mp4`;
      if (patientData && patientData.patient_id) {
        filename = `${(
          patientData.patient_id +
          '_' +
          patientData.patient_name
        ).replace(/ /g, '_')}_${Date.now().toString()}.mp4`;
      }
      let contentType = 'video/mp4';
      let contentDeposition = 'inline;filename="' + filename + '"';
      const base64 = await fs.readFile(videoURL, 'base64');
      const arrayBuffer = decode(base64);

      s3bucket.createBucket(() => {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `${BUCKET_FOLDER_FOR_PUPIL}${filename}`,
          Body: arrayBuffer,
          ContentDisposition: contentDeposition,
          ContentType: contentType,
          ACL: 'public-read',
        };
        s3bucket.upload(params, (err, data) => {
          if (err) {
            console.log('error in callback', err);
            Alert.alert('Error', 'Error in uploading the video');
            setShowSpinner(false);
            setSpinnerMessage('');
            clearProcessingTimer();
            resetStates();
          } else {
            console.log('success', data);
            console.log('Respomse URL : ' + data.Location);

            setSpinnerMessage('Processing...');
            initiatePupilVideoProcessingAPI(filename)
              .then((result) => {
                console.log('initiatePupilVideoProcessingAPI: ', result);
                if (result && result.data === 'Retake') {
                  Alert.alert('Error', 'Please retake the video');
                  // setResultReady(true);
                  // setShowProcessedResult(true);
                  setShowSpinner(false);
                  setSpinnerMessage('');
                  clearProcessingTimer();
                  resetStates('');
                  return;
                }
                setResultValue(result.data);
                setResultReady(true);
                setShowSpinner(false);
                setSpinnerMessage('');
                clearProcessingTimer();

                /* setTimeout(() => {
                                let pngFileName = `${filename.substring(0, filename.lastIndexOf("."))}_Dilation_Plot.png`
                                setDownloadFileName(pngFileName);
                                setResultReady(true);
                                setShowSpinner(false);
                                setSpinnerMessage("");
                                clearProcessingTimer();
                            }, 100); */
              })
              .catch((err) => {
                Alert.alert('Error', 'Error in processing the video');
                setShowSpinner(false);
                // setResultReady(true);
                // setShowProcessedResult(true);
                setSpinnerMessage('');
                clearProcessingTimer();
                resetStates('');
              });
          }
        });
      });
    } catch (err) {
      Alert.alert('Error', 'Error in uploading the video');
      setShowSpinner(false);
      setSpinnerMessage('');
      clearProcessingTimer();
      resetStates();
    }
  };

  const onGetResultPress = () => {
    setShowSpinner(true);
    setSpinnerMessage('Retriving Result...');
    startProcessingTimer();

    const params = {
      Bucket: BUCKET_NAME,
      Key: `${BUCKET_FOLDER_FOR_PUPIL_RESULT}${downloadFileName}`,
    };

    const s3bucket = new S3({
      accessKeyId: ACCESS_ID,
      secretAccessKey: ACCESS_KEY,
      Bucket: BUCKET_NAME,
      signatureVersion: 'v4',
    });

    s3bucket.getObject(params, (err, data) => {
      if (err) {
        console.log('error in getObject', err);
        Alert.alert('Error', 'Error in retriving the result');
        setShowSpinner(false);
        setSpinnerMessage('');
        clearProcessingTimer();
        setResultReady(false);
        setDownloadFileName('');
        resetStates();
      } else {
        let base64Str = encode(data.Body);
        setShowProcessedResult(true);
        setResultImageURI(`data:${data.ContentType};base64,${base64Str}`);
        setShowSpinner(false);
        setSpinnerMessage('');
        clearProcessingTimer();
        setResultReady(false);
        setDownloadFileName('');
        resetStates();
      }
    });
  };

  const onCaptureAgainPress = () => {
    setResultReady(false);
    setDownloadFileName('');
    setShowProcessedResult(false);
    setResultImageURI('');
    // navigation.navigate(SCREEN_NAMES.FACIAL_EXPRESSION)
  };

  const onRetakePress = () => {
    resetStates();
  };

  const resetStates = () => {
    setVideoURL('');
    setIsRecording(false);
    setDuration('00:00');
    clearInterval(intervalId);
  };

  const setEyeColor = (isDarkBrown) => {
    if (
      (isDarkBrownEyes && isDarkBrown) ||
      (!isDarkBrownEyes && !isDarkBrown)
    ) {
      return;
    }

    setIsDarkBrownEyes(isDarkBrown);

    if (isDarkBrown) {
      if (exposure !== DEFAULT_DARK_BROWN_EXPOSURE) {
        setExposure(DEFAULT_DARK_BROWN_EXPOSURE);
      }
    } else {
      if (exposure !== DEFAULT_OTHER_EXPOSURE) {
        setExposure(DEFAULT_OTHER_EXPOSURE);
      }
    }
  };

  const handleOnNextPress = () => {
    dispatch({
      type: CREATE_ASSESSMENT_ACTION.CREATE_ASSESSMENT,
      payload: {
        pupillary_dilation: Number(resultValue),
      },
    });
    navigation.navigate(SCREEN_NAMES.FACIAL_EXPRESSION);
  };

  const getCameraComponent = () => {
    return (
      <>
        <View
          style={{
            height: isRecording ? height - 170 - 50 : width,
            width: width,
            overflow: 'hidden',
          }}>
          <RNCamera
            ref={(ref) => {
              camera = ref;
            }}
            style={{height: height - 170 - 50, width: width}}
            type={cameraType}
            captureAudio={false}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            useNativeZoom={true}
            ratio={'16:9'}
            // autoFocus={
            //   Platform.OS === 'ios'
            //     ? RNCamera.Constants.AutoFocus.off
            //     : RNCamera.Constants.AutoFocus.on
            // }
            autoFocusPointOfInterest={foucsPoints || {}}
            defaultVideoQuality={RNCamera.Constants.VideoQuality['1080p']}
            onCameraReady={() => setIsCameraReady(true)}
            onRecordingStart={() => {
              handleStartRecording();
            }}
            onRecordingEnd={() => {
              handleStopRecording();
            }}
            zoom={(zoom/100)}
            focusDepth={focusDepth}
            maxZoom ={1}
            exposure={exposure < 0.15 ? 0.15 : exposure}
            flashMode={
              flashOn && isCameraReady
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.off
            }>
            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                activeOpacity={1}
                // onPressOut={() => {
                //   pressOut = setTimeout(() => {
                //     setShowBrightnessSlider(false);
                //   }, 3000);
                // }}
                // onPressIn={(evt) => {
                // setSelectedSetting('');
                // setShowBrightnessSlider(true);
                // if (pressOut) {
                //   clearTimeout(pressOut);
                // }
                onPress={(evt) => {
                  setFocusPoints({
                    x: parseFloat(1 - evt.nativeEvent.pageX / width),
                    y: parseFloat(1 - (evt.nativeEvent.pageY - 60) / width),
                    autoExposure: true,
                  });
                  setTimeout(() => {
                    setExposure(autoAdjust);
                  }, 3000);
                }}
                // <View
                style={{
                  flex: 1,
                }}>
                <View style={styles.frameTopLeft} pointerEvents="none"></View>
                <View style={styles.frameTopRight} pointerEvents="none"></View>
                <View
                  style={styles.frameBottomLeft}
                  pointerEvents="none"></View>
                <View
                  style={styles.frameBottomRight}
                  pointerEvents="none"></View>
                {eyeBorderType === EYE_BORDER_TYPE.RECTANGLE && (
                  <View
                    style={styles.eyeBorderRect}
                    pointerEvents="none"></View>
                )}
                {eyeBorderType === EYE_BORDER_TYPE.OVAL && (
                  <View
                    style={styles.eyeBorderOval}
                    pointerEvents="none"></View>
                )}
                {eyeBorderType === EYE_BORDER_TYPE.OVAL && (
                  <View
                    style={styles.eyeBorderCircle}
                    pointerEvents="none"></View>
                )}
                {timer !== '0' && (
                  <View style={[styles.timerContainer]} pointerEvents="none">
                    <Text style={styles.timerText}>{timer}</Text>
                  </View>
                )}
                {isRecording && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: width,
                      height: 91,
                      backgroundColor: 'rgba(9, 48, 76, 0.5)',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}
                    pointerEvents="none">
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 16,
                        color: COLORS.WHITE,
                      }}>
                      NO Blink
                    </Text>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 16,
                        color: COLORS.WHITE,
                      }}>
                      Record for at least 10 seconds
                    </Text>
                  </View>
                )}
                {/* </View> */}
              </TouchableOpacity>
            ) : (
              <CustomTouchableOpacity
                activeOpacity={1}
                // onPressOut={() => {
                //   pressOut = setTimeout(() => {
                //     setShowBrightnessSlider(false);
                //   }, 3000);
                // }}
                // onPressIn={(evt) => {
                // setSelectedSetting('');
                // setShowBrightnessSlider(true);
                // if (pressOut) {
                //   clearTimeout(pressOut);
                // }
                onPress={(evt) => {
                  setFocusPoints({
                    x: parseFloat(1 - evt.nativeEvent.pageX / width),
                    y: parseFloat(1 - (evt.nativeEvent.pageY - 60) / width),
                    autoExposure: true,
                  });
                }}
                // <View
                style={{
                  flex: 1,
                }}>
                <View style={styles.frameTopLeft} pointerEvents="none"></View>
                <View style={styles.frameTopRight} pointerEvents="none"></View>
                <View
                  style={styles.frameBottomLeft}
                  pointerEvents="none"></View>
                <View
                  style={styles.frameBottomRight}
                  pointerEvents="none"></View>
                {eyeBorderType === EYE_BORDER_TYPE.RECTANGLE && (
                  <View
                    style={styles.eyeBorderRect}
                    pointerEvents="none"></View>
                )}
                {eyeBorderType === EYE_BORDER_TYPE.OVAL && (
                  <View
                    style={styles.eyeBorderOval}
                    pointerEvents="none"></View>
                )}
                {eyeBorderType === EYE_BORDER_TYPE.OVAL && (
                  <View
                    style={styles.eyeBorderCircle}
                    pointerEvents="none"></View>
                )}
                {timer !== '0' && (
                  <View style={[styles.timerContainer]} pointerEvents="none">
                    <Text style={styles.timerText}>{timer}</Text>
                  </View>
                )}
                {isRecording && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: width,
                      height: 91,
                      backgroundColor: 'rgba(9, 48, 76, 0.5)',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}
                    pointerEvents="none">
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 16,
                        color: COLORS.WHITE,
                      }}>
                      NO Blink
                    </Text>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 16,
                        color: COLORS.WHITE,
                      }}>
                      Record for at least 10 seconds
                    </Text>
                  </View>
                )}
                {/* </View> */}
              </CustomTouchableOpacity>
            )}
          </RNCamera>
        </View>

        {!isRecording && (
          <View style={styles.scrollViewStyle}>
            <View style={{height: 8}} />
            <View
              style={{
                flexDirection: 'row',
                width: width - 40,
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
              <View>
                <Text style={{fontSize: height > 850 ? 16 : 12}}>
                  FPS: {fps}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <CustomTouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: height > 850 ? 30 : 20,
                    height: height > 850 ? 30 : 20,
                    borderRadius: 5,
                    backgroundColor:
                      selectedSetting === SETTINGS.ZOOM
                        ? COLORS.PRIMARY_MAIN
                        : 'rgba(0,0,0,0)',
                    borderColor: COLORS.PRIMARY_MAIN,
                    borderWidth: selectedSetting === SETTINGS.ZOOM ? 0 : 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    toggleSettings(SETTINGS.ZOOM);
                    // setShowBrightnessSlider(false);
                  }}>
                  <Fontisto
                    name="zoom"
                    size={height > 850 ? 18 : 10}
                    color={
                      selectedSetting === SETTINGS.ZOOM
                        ? COLORS.WHITE
                        : COLORS.GRAY_90
                    }
                  />
                </CustomTouchableOpacity>
                <CustomTouchableOpacity
                  style={{
                    marginLeft: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: height > 850 ? 30 : 20,
                    height: height > 850 ? 30 : 20,
                    borderRadius: 5,
                    backgroundColor:
                      selectedSetting === SETTINGS.FOCUS_DEPTH
                        ? COLORS.PRIMARY_MAIN
                        : 'rgba(0,0,0,0)',
                    borderColor: COLORS.PRIMARY_MAIN,
                    borderWidth:
                      selectedSetting === SETTINGS.FOCUS_DEPTH ? 0 : 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    toggleSettings(SETTINGS.FOCUS_DEPTH);
                    // setShowFocusDepthSliderModal(true)
                    // setShowBrightnessSlider(false)
                  }}>
                  <MaterialIcons
                    name="center-focus-strong"
                    size={height > 850 ? 18 : 10}
                    color={
                      selectedSetting === SETTINGS.FOCUS_DEPTH
                        ? COLORS.WHITE
                        : COLORS.GRAY_90
                    }
                  />
                </CustomTouchableOpacity>
                <CustomTouchableOpacity
                  style={{
                    marginLeft: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: height > 850 ? 30 : 20,
                    height: height > 850 ? 30 : 20,
                    borderRadius: 5,
                    backgroundColor:
                      selectedSetting === SETTINGS.EXPOSURE
                        ? COLORS.PRIMARY_MAIN
                        : 'rgba(0,0,0,0)',
                    borderColor: COLORS.PRIMARY_MAIN,
                    borderWidth: selectedSetting === SETTINGS.EXPOSURE ? 0 : 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    toggleSettings(SETTINGS.EXPOSURE);
                    // setShowBrightnessSlider(false)
                  }}>
                  <MaterialIcons
                    name="brightness-5"
                    size={height > 850 ? 18 : 12}
                    color={
                      selectedSetting === SETTINGS.EXPOSURE
                        ? COLORS.WHITE
                        : COLORS.GRAY_90
                    }
                  />
                </CustomTouchableOpacity>
              </View>
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                flexWrap:'wrap',
              }}
            > */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text
                  style={{
                    marginBottom: height >= 850 ? 10 : 14,
                    fontSize: height >= 850 ? 16 : 12,
                    lineHeight: height >= 850 ? 16 : 12,
                    fontWeight: '400',
                    color: COLORS.GRAY_90,
                  }}>
                  1. Find a well-lit environment.
                </Text>
                <Text
                  style={{
                    marginBottom: height >= 850 ? 10 : 14,
                    fontSize: height >= 850 ? 16 : 12,
                    lineHeight: height >= 850 ? 16 : 12,
                    fontWeight: '400',
                    color: COLORS.GRAY_90,
                  }}>
                  2. Position one eye within the circular frame.
                </Text>
                {/* <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>3. Turn your device  horizontally if needed.</Text> */}
                <Text
                  style={{
                    marginBottom: height >= 850 ? 10 : 14,
                    fontSize: height >= 850 ? 16 : 12,
                    lineHeight: height >= 850 ? 16 : 12,
                    fontWeight: '400',
                    color: COLORS.GRAY_90,
                  }}>
                  {/* 3. Get ready to not blink for 10 seconds. */}
                  3. Recording eye atleast 10 seconds without blinking
                </Text>
                {/* <Text
                  style={{
                    marginBottom: height >=850  ? 10 : 14,
                    fontSize: height >=850 ? 16 : 12,
                    lineHeight: height >=850 ? 16 : 12,
                    fontWeight: '400',
                    color: COLORS.GRAY_90,
                  }}>
                  4. Record the eye for at least 10 seconds.
                </Text> */}
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <View
                style={{
                  height: Boolean(MIN_HEIGHT === 736) ? 20 : 30,
                  marginBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginHorizontal: 10,
                  paddingTop: height > 850 ? 20 : 0,
                }}>
                <Text
                  style={{
                    fontWeight: '700',
                    color: COLORS.GRAY_90,
                    fontSize: height > 850 ? 12 : 10,
                    lineHeight: height > 850 ? 12 : 17,
                  }}>
                  {'Eye Color: '}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: `${COLORS.PRIMARY_MAIN}50`,
                    width: height > 850 ? 240 : 200,
                    justifyContent: 'space-between',
                    height: height > 850 ? 30 : 20,
                    alignItems: 'center',
                    borderRadius: 10,
                    alignSelf: 'center',
                  }}>
                  <CustomTouchableOpacity
                    style={{
                      backgroundColor: isDarkBrownEyes
                        ? COLORS.SECONDARY_MAIN
                        : `${COLORS.GRAY_40}`,
                      width: height < 850 ? 100 : 120,
                      height: height < 850 ? 20 : 30,
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: isDarkBrownEyes ? 1 : 0,
                    }}
                    onPress={() => setEyeColor(true)}>
                    <Text
                      style={{
                        color: isDarkBrownEyes ? COLORS.GRAY_90 : COLORS.WHITE,
                        fontWeight: '700',
                        fontSize: height < 850 ? 10 : 14,
                        lineHeight: height < 850 ? 12 : 17,
                        textTransform: 'uppercase',
                      }}>
                      {'Dark Brown'}
                    </Text>
                  </CustomTouchableOpacity>
                  <CustomTouchableOpacity
                    style={{
                      backgroundColor: isDarkBrownEyes
                        ? `${COLORS.GRAY_40}`
                        : COLORS.SECONDARY_MAIN,
                      width: height < 850 ? 100 : 120,
                      height: height < 850 ? 20 : 30,
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: isDarkBrownEyes ? 0 : 1,
                    }}
                    onPress={() => setEyeColor(false)}>
                    <Text
                      style={{
                        color: !isDarkBrownEyes ? COLORS.GRAY_90 : COLORS.WHITE,
                        fontWeight: '700',
                        fontSize: height < 850 ? 10 : 14,
                        lineHeight: height < 850 ? 12 : 17,
                        lineHeight: 17,
                        textTransform: 'uppercase',
                      }}>
                      {'Other'}
                    </Text>
                  </CustomTouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  height: height < 850 ? 50 : 80,
                  marginBottom: 30,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: `${COLORS.PRIMARY_MAIN}50`,
                    justifyContent: 'space-between',
                    height: height < 850 ? 20 : 30,
                    alignItems: 'center',
                    borderRadius: 10,
                    marginLeft: width > 600 ? 10 : 30,
                    bottom: height > 850 ? 0 : 5,
                    top : height >850 ? 20 : 0
                  }}>
                  <CustomTouchableOpacity
                    style={{
                      backgroundColor:
                        captureMode === CAPTURE_MODE.AUTO
                          ? COLORS.SECONDARY_MAIN
                          : `${COLORS.GRAY_40}`,
                      width: 100,
                      height: height < 850 ? 20 : 30,
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: captureMode === CAPTURE_MODE.AUTO ? 1 : 0,
                    }}
                    onPress={() => setCaptureMode(CAPTURE_MODE.AUTO)}
                    >
                    <Text
                      style={{
                        color:
                          captureMode === CAPTURE_MODE.AUTO
                            ? COLORS.GRAY_90
                            : COLORS.WHITE,
                        fontWeight: '700',
                        fontSize: height < 850 ? 10 : 14,
                        lineHeight: height < 850 ? 12 : 17,
                        textTransform: 'uppercase',
                      }}>
                      {'Auto'}
                    </Text>
                  </CustomTouchableOpacity>
                  <CustomTouchableOpacity
                    style={{
                      backgroundColor:
                        captureMode === CAPTURE_MODE.MANUAL
                          ? COLORS.SECONDARY_MAIN
                          : `${COLORS.GRAY_40}`,
                      width: 100,
                      height: height < 850 ? 20 : 30,
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: captureMode === CAPTURE_MODE.MANUAL ? 1 : 0,
                    }}
                    onPress={() => setCaptureMode(CAPTURE_MODE.MANUAL)}>
                    <Text
                      style={{
                        color:
                          captureMode === CAPTURE_MODE.MANUAL
                            ? COLORS.GRAY_90
                            : COLORS.WHITE,
                        fontWeight: '700',
                        fontSize: height < 850 ? 10 : 14,
                        lineHeight: height < 850 ? 12 : 17,
                        textTransform: 'uppercase',
                      }}>
                      {'Manual'}
                    </Text>
                  </CustomTouchableOpacity>
                  
                </View>
                
              </View>
            </View>
            {/* </View> */}

            {/* <View
              style={{
                width: width - 40,
                height: 30,
                marginTop: 20,
                marginBottom: 30,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: '700', color: COLORS.GRAY_90}}>
                {'FPS: '}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: `${COLORS.PRIMARY_MAIN}50`,
                  width: 160,
                  justifyContent: 'space-between',
                  height: 30,
                  alignItems: 'center',
                  borderRadius: 10,
                  alignSelf: 'center',
                }}>
                <CustomTouchableOpacity
                  style={{
                    backgroundColor:
                      fps === 30 ? COLORS.SECONDARY_MAIN : `${COLORS.GRAY_40}`,
                    width: 80,
                    height: 30,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: fps === 30 ? 1 : 0,
                  }}
                  onPress={() => setFps(30)}>
                  <Text
                    style={{
                      color: fps === 30 ? COLORS.GRAY_90 : COLORS.WHITE,
                      fontWeight: '700',
                      fontSize: 17,
                    }}>
                    {'30'}
                  </Text>
                </CustomTouchableOpacity>
                <CustomTouchableOpacity
                  style={{
                    backgroundColor:
                      fps === 60 ? COLORS.SECONDARY_MAIN : `${COLORS.GRAY_40}`,
                    width: 80,
                    height: 30,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: fps === 60 ? 1 : 0,
                  }}
                  onPress={() => setFps(60)}>
                  <Text
                    style={{
                      color: fps === 60 ? COLORS.GRAY_90 : COLORS.WHITE,
                      fontWeight: '700',
                      fontSize: 17,
                    }}>
                    {'60'}
                  </Text>
                </CustomTouchableOpacity>
              </View>
            </View> */}

            {/* <View style={{width: width - 40, height: 30, marginBottom: 30}}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: `${COLORS.PRIMARY_MAIN}50`,
                  width: 200,
                  justifyContent: 'space-between',
                  height: 30,
                  alignItems: 'center',
                  borderRadius: 10,
                  alignSelf: 'center',
                }}>
                <CustomTouchableOpacity
                  style={{
                    backgroundColor:
                      captureMode === CAPTURE_MODE.AUTO
                        ? COLORS.SECONDARY_MAIN
                        : `${COLORS.GRAY_40}`,
                    width: 100,
                    height: 30,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: captureMode === CAPTURE_MODE.AUTO ? 1 : 0,
                  }}
                  onPress={() => setCaptureMode(CAPTURE_MODE.AUTO)}>
                  <Text
                    style={{
                      color:
                        captureMode === CAPTURE_MODE.AUTO
                          ? COLORS.GRAY_90
                          : COLORS.WHITE,
                      fontWeight: '700',
                      fontSize: 14,
                      lineHeight: 17,
                      textTransform: 'uppercase',
                    }}>
                    {'Auto'}
                  </Text>
                </CustomTouchableOpacity>
                <CustomTouchableOpacity
                  style={{
                    backgroundColor:
                      captureMode === CAPTURE_MODE.MANUAL
                        ? COLORS.SECONDARY_MAIN
                        : `${COLORS.GRAY_40}`,
                    width: 100,
                    height: 30,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: captureMode === CAPTURE_MODE.MANUAL ? 1 : 0,
                  }}
                  onPress={() => setCaptureMode(CAPTURE_MODE.MANUAL)}>
                  <Text
                    style={{
                      color:
                        captureMode === CAPTURE_MODE.MANUAL
                          ? COLORS.GRAY_90
                          : COLORS.WHITE,
                      fontWeight: '700',
                      fontSize: 14,
                      lineHeight: 17,
                      textTransform: 'uppercase',
                    }}>
                    {'Manual'}
                  </Text>
                </CustomTouchableOpacity>
              </View>
            </View> */}

            <View
              style={{
                flex: 1,
                width: width - 40,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                bottom: 40,
              }}>
              {/* <CustomTouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => switchEyeBorderType()}>
                        {eyeBorderType === EYE_BORDER_TYPE.OVAL && <View style={{ width: 30, height: 15, borderWidth: 2, borderColor: COLORS.BLACK }}></View>}
                        {eyeBorderType === EYE_BORDER_TYPE.RECTANGLE && <View style={{ width: 15, height: 15, borderRadius: 15 / 2, borderWidth: 2, borderColor: COLORS.BLACK, transform: [{ scaleX: 2 }] }}></View>}
                    </CustomTouchableOpacity> */}
              <CustomTouchableOpacity
                disabled={processing}
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={() => {
                  setFlashOn(!flashOn);
                }}>
                <Ionicons
                  name={flashOn ? 'md-flash-off' : 'md-flash'}
                  size={height < 850 ? 20 : 25}
                  color={flashOn ? COLORS.GRAY_60 : COLORS.GRAY_90}
                />
              </CustomTouchableOpacity>
              {/* <CustomTouchableOpacity disabled={processing}
                        style={{ backgroundColor: processing ? `${COLORS.PRIMARY_MAIN}50` : COLORS.PRIMARY_MAIN, borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, paddingHorizontal: 28 }}
                        onPress={onStartRecordingPress}
                    >
                        <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.WHITE, textAlign: "center" }}>{"START RECORDING"}</Text>
                    </CustomTouchableOpacity> */}
              <CustomButton
                onPress={onStartRecordingPress}
                title="Start Recording"
                textStyle={{
                  color: COLORS.WHITE,
                  textAlign: 'center',
                  fontSize: height < 850 ? 12 : 16,
                }}
                disabled={processing}
                style={{
                  width: width * 0.5,
                  height: height < 850 ? 30 : 50,
                  backgroundColor: processing
                    ? COLORS.GRAY_40
                    : COLORS.PRIMARY_MAIN,
                  borderColor: COLORS.PRIMARY_MAIN,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              <CustomTouchableOpacity
                disabled={processing}
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={() => switchCamera()}>
                <Ionicons
                  name="camera-reverse-outline"
                  size={height < 850 ? 20 : 25}
                />
              </CustomTouchableOpacity>
            </View>
            <View style={{height: 20}} />
          </View>
        )}

        {
          // ((!isRecording && showBrightnessSlider)
          //  ||
          !isRecording && selectedSetting != '' && (
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                zindex: 1000,
                top: width - 50 - 25,
                // top:
                //   selectedSetting !== ''
                //     ? width - 50 - 25
                //     : foucsPoints.y <= 0.2
                //     ? height * 0.36
                //     : foucsPoints.y >= 0.7
                //     ? 100
                //     : (height - foucsPoints.y * 1000) / 2,
                // left:
                //   selectedSetting !== ''
                //     ? 20
                //     : foucsPoints.x >= 0.7
                //     ? 50
                //     : (width - foucsPoints.x * 1000) / 1.8 + 60,
                //    width: width-40,
                left: 20,
                width: width - 40,
                // width:
                //   selectedSetting !== '' ? width - 40 : width * 0.4,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: `${COLORS.WHITE}70`,
                // transform: [
                //   {
                //     rotate:
                //       selectedSetting !== ''  ? '360deg' : '270deg',
                //   },
                // ],
              }}>
              {/* {showBrightnessSlider && (
              <>
                <Text
                  style={{
                    width: 40,
                    textAlign: 'center',
                  }}>{`${parseInt(exposure * 100)}%`}</Text>
                <Slider
                  style={{
                    //width: width - 120,
                    width: width * 0.3,
                  }}
                  onResponderStart={() => {
                    if (pressOut) {
                      clearTimeout(pressOut);
                    }
                  }}
                  onResponderRelease={() => {
                    pressOut = setTimeout(() => {
                      setShowBrightnessSlider(false);
                    }, 3000);
                  }}
                  minimumValue={0}
                  maximumValue={1}
                  value={exposure}
                  onValueChange={(value) => setExposure(value)}
                  minimumTrackTintColor={COLORS.WHITE}
                  maximumTrackTintColor={COLORS.BLACK}
                />
              </>
            )} */}
              {selectedSetting === SETTINGS.ZOOM && (
                <>
                  <Text style={{width: 40, textAlign: 'center'}}>{`${parseInt(
                    zoom * 100,
                  )}%`}</Text>
                  <Slider
                    //   style={{width: width - 120}}
                    style={{
                      width:
                        selectedSetting === SETTINGS.ZOOM
                          ? width - 120
                          : width * 0.3,
                    }}
                    minimumValue={0}
                    value ={zoom}
                    onValueChange={(value) => setZoom(value)}
                    minimumTrackTintColor={COLORS.WHITE}
                    maximumTrackTintColor={COLORS.BLACK}
                  />
                </>
              )}
              {selectedSetting === SETTINGS.EXPOSURE && (
                <>
                  <Text style={{width: 40, textAlign: 'center'}}>{`${parseInt(
                    exposure * 100,
                  )}%`}</Text>
                  <Slider
                    style={{width: width - 120}}
                    // style={{
                    //   width:
                    //     selectedSetting === SETTINGS.EXPOSURE
                    //       ? width - 120
                    //       : width * 0.3,
                    // }}
                    minimumValue={0}
                    maximumValue={1}
                    value={exposure}
                    onValueChange={(value) => {
                      setExposure(value);
                      setAutoAdjust(value);
                    }}
                    minimumTrackTintColor={COLORS.WHITE}
                    maximumTrackTintColor={COLORS.BLACK}
                  />
                </>
              )}
              {selectedSetting === SETTINGS.FOCUS_DEPTH && (
                <>
                  <Text style={{width: 40, textAlign: 'center'}}>{`${parseInt(
                    focusDepth * 100,
                  )}%`}</Text>
                  <Slider
                    style={{
                      width:
                        selectedSetting === SETTINGS.FOCUS_DEPTH
                          ? width - 120
                          : width * 0.3,
                    }}
                    minimumValue={0}
                    maximumValue={1}
                    value={focusDepth}
                    onValueChange={(value) => setFocusDepth(value)}
                    minimumTrackTintColor={COLORS.WHITE}
                    maximumTrackTintColor={COLORS.BLACK}
                  />
                </>
              )}
            </View>
          )
        }

        {isRecording && (
          <>
            <View
              style={{
                height: 170,
                width: width,
                backgroundColor: COLORS.PRIMARY_MAIN,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  width: width,
                  color: COLORS.WHITE,
                  fontSize: 16,
                  fontWeight: '700',
                  marginTop: 14,
                  marginBottom: 20,
                }}>
                {duration}
              </Text>
              <CustomTouchableOpacity
                style={{marginBottom: 20}}
                disabled={captureMode === CAPTURE_MODE.AUTO}
                onPress={() => stopRecordingVideo()}>
                <View
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 54 / 2,
                    backgroundColor:
                      captureMode === CAPTURE_MODE.AUTO
                        ? '#C9414150'
                        : '#C94141',
                    borderWidth: 5,
                    borderColor: COLORS.WHITE,
                  }}></View>
              </CustomTouchableOpacity>
            </View>
          </>
        )}
      </>
    );
  };

  const getVideoPlayerComponent = () => {
    return (
      <>
        <View style={{height: width, width: width}}>
          <Video
            source={{uri: videoURL}}
            controls={true}
            resizeMode={'contain'}
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              bottom: 0,
              right: 0,
              width: width - 40,
              height: width - 40,
            }}
          />
        </View>
        <ScrollView
          style={{
            width: width,
            paddingTop: 30,
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {!resultReady && (
            <>
              <CustomTouchableOpacity
                disabled={processing}
                style={{
                  backgroundColor: COLORS.PRIMARY_MAIN,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 48,
                  width: width - 80,
                  paddingHorizontal: 28,
                  marginBottom: 12,
                }}
                onPress={onDownloadPress}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: COLORS.WHITE,
                    textAlign: 'center',
                  }}>
                  {'DOWNLOAD'}
                </Text>
              </CustomTouchableOpacity>
              <CustomTouchableOpacity
                disabled={processing}
                style={{
                  backgroundColor: COLORS.PRIMARY_MAIN,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 48,
                  width: width - 80,
                  paddingHorizontal: 28,
                  marginBottom: 12,
                }}
                onPress={onUploadPress}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: COLORS.WHITE,
                    textAlign: 'center',
                  }}>
                  {'CONFIRM'}
                </Text>
              </CustomTouchableOpacity>
              <CustomTouchableOpacity
                disabled={processing}
                style={{
                  backgroundColor: COLORS.PRIMARY_MAIN,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 48,
                  width: width - 80,
                  paddingHorizontal: 28,
                  marginBottom: 50,
                }}
                onPress={onRetakePress}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: COLORS.WHITE,
                    textAlign: 'center',
                  }}>
                  {'RETAKE'}
                </Text>
              </CustomTouchableOpacity>
            </>
          )}

          {/* {resultReady && <CustomTouchableOpacity disabled={processing}
                    style={{ backgroundColor: COLORS.PRIMARY_MAIN, borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, width: width - 80, paddingHorizontal: 28, marginBottom: 12 }}
                    onPress={onGetResultPress}
                >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.WHITE, textAlign: "center" }}>{"GET RESULT"}</Text>
                </CustomTouchableOpacity>} */}
          {resultReady && (
            <>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: COLORS.GRAY_90,
                  textAlign: 'center',
                  marginBottom: 15,
                }}>{`RESULT: ${resultValue}`}</Text>
              <CustomTouchableOpacity
                disabled={processing}
                style={{
                  backgroundColor: COLORS.PRIMARY_MAIN,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 48,
                  width: width - 80,
                  paddingHorizontal: 28,
                  marginBottom: 12,
                }}
                onPress={() => handleOnNextPress()}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: COLORS.WHITE,
                    textAlign: 'center',
                  }}>
                  {'NEXT'}
                </Text>
              </CustomTouchableOpacity>
            </>
          )}
        </ScrollView>
      </>
    );
  };

  const getResultScreen = () => {
    return (
      <View
        style={{
          width: width,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 30,
        }}>
        {resultImageURI !== '' ? (
          <Image
            style={{
              width: width - 60,
              height: width - 60,
              resizeMode: 'contain',
            }}
            source={{uri: resultImageURI}}
          />
        ) : (
          <Image
            source={DummyImageChart}
            style={{
              width: width - 60,
              height: width - 60,
              resizeMode: 'contain',
            }}
          />
        )}
        <CustomTouchableOpacity
          disabled={processing}
          style={{
            backgroundColor: COLORS.PRIMARY_MAIN,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            width: width - 80,
            paddingHorizontal: 28,
            marginBottom: 12,
            marginTop: 30,
          }}
          onPress={onCaptureAgainPress}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: COLORS.WHITE,
              textAlign: 'center',
            }}>
            {'CAPTURE AGAIN'}
          </Text>
          {/* <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.WHITE, textAlign: "center" }}>{"NEXT"}</Text> */}
        </CustomTouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.body}>
      {!showProcessedResult && (
        <>
          {videoURL === '' && getCameraComponent()}
          {videoURL !== '' && getVideoPlayerComponent()}
        </>
      )}
      {showProcessedResult && getResultScreen()}
      <Spinner
        visible={showSpinner}
        textContent={`${spinnerMessage} ${
          processingTimer !== '0' ? `${processingTimer} secs` : ''
        }`}
        textStyle={{color: COLORS.WHITE}}
      />
      {/* <FocusDepthSliderModal 
      open  ={showFocusDepthSliderModal}
      onClose = {()=>{setShowFocusDepthSliderModal(false)}}
      focusDepthMode ={focusDepthMode}
      focusDepthModeData = {FOCUS_DEPTH_MODE}
      setFocusDepthOn ={setFocusDepthOn}
      setFocusDepthMode = {setFocusDepthMode}
      /> */}
    </View>
  );
};

export default PupillaryDilationScreen;
