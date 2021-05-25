import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  Alert,
  Dimensions,
  PermissionsAndroid,
  Platform,
  NativeModules,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Slider from '@react-native-community/slider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Spinner from 'react-native-loading-spinner-overlay';
import {RNFFmpeg} from 'react-native-ffmpeg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CameraRoll from '@react-native-community/cameraroll';
import MovToMp4 from 'react-native-mov-to-mp4';
import Video from 'react-native-video';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import styles from './styles';
import {secondsToMinsAndSecs} from '../../utils/date';
import EyeBoundary from './EyeBoundary';
import {COLORS} from '../../constants/colors';
import {SCREEN_NAMES} from '../../constants/navigation';
import CustomButton from '../../components/shared/CustomButton';
import S3 from 'aws-sdk/clients/s3';
import fs from 'react-native-fs';
import {decode, encode} from 'base64-arraybuffer';
import {
  ACCESS_ID,
  ACCESS_KEY,
  BUCKET_FOLDER_FOR_FACE,
  BUCKET_NAME,
} from '../../constants/aws';
import {initiateFacialExpressionVideoProcessingAPI} from '../../api/painAssessment';
import {useDispatch, useSelector} from 'react-redux';
import createAssessmentAPI from '../../api/createAssessment';

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

const SETTINGS = {
  ZOOM: 'zoom',
  EXPOSURE: 'exposure',
  FOCUS_DEPTH: 'focusDepth',
};

const FacialExpressionScreen = ({navigation}) => {
  const [eyeBorderType, setEyeBorderType] = useState(EYE_BORDER_TYPE.OVAL);
  const [timer, setTimer] = useState('0');
  const [duration, setDuration] = useState('00:00');
  const [processing, setProcessing] = useState(false);
  const [enableRecording, setEnableRecording] = useState(false);
  const [captureMode, setCaptureMode] = useState(CAPTURE_MODE.AUTO);
  const [selectedSetting, setSelectedSetting] = useState('');
  const [toastText, setToastText] = useState('');
  const [box, setBox] = useState({});
  const [eyePosition, setEyePosition] = useState({});
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState('');
  const [fps, setFps] = useState(60);
  const [flashOn, setFlashOn] = useState(false);
  const [exposure, setExposure] = useState(0.0);
  const [zoom, setZoom] = useState(0);
  const [focusDepth, setFocusDepth] = useState(0.0);
  const [processingTimer, setProcessingTimer] = useState('0');
  const [resultReady, setResultReady] = useState(false);
  const [resultValue, setResultValue] = useState('');
  // const [showBrightnessSlider, setShowBrightnessSlider] = useState(false);
  const [spinnerState, setShowSpinner] = useState({
    open: false,
    message: '',
  });
  const [foucsPoints, setFocusPoints] = useState({
    x: 0.5,
    y: 0.5,
    autoExposure: true,
  });

  const assessment_data = useSelector((state) => state.createAsseement);
  const patientData = useSelector((state) => state.patientData.patient);
  const token = useSelector((state) => state.user.authToken);
  const userId = useSelector((state) => state.user.loggedInUserId);

  // var pressOut;

  useEffect(() => {
    setTimeout(() => checkStoragePermission(), 3000);
  }, []);

  const toggleSettings = (setting) => {
    setSelectedSetting(setting === selectedSetting ? '' : setting);
  };

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

  const onFaceDetected = ({faces}) => {
    if (faces[0]) {
      let faceData = {
        width: faces[0].bounds.size.width,
        height: faces[0].bounds.size.height,
        x: faces[0].bounds.origin.x,
        y: faces[0].bounds.origin.y,
        yawAngle: faces[0].yawAngle,
        rollAngle: faces[0].rollAngle,
      };
      let eyeData = {
        rightEyePosition: faces[0].rightEyePosition,
        leftEyePosition: faces[0].leftEyePosition,
      };

      let faceAreaWidth = width - 40;
      let faceAreaX = (width - faceAreaWidth) / 2;
      let faceAreaY = (width + width * 0.25 - (width - 40)) / 2;

      console.log(faceAreaWidth, faceAreaX, faceAreaY);
      console.log('faceData: ', faceData);
      console.log('eyeData: ', eyeData);

      setBox(faceData);

      if (
        faceAreaWidth - faceData.width >= 0 &&
        faceAreaWidth - faceData.width <= 150 &&
        faceData.x - faceAreaX >= 0 &&
        faceData.x - faceAreaX <= 150 &&
        faceData.y - faceAreaY >= 0 &&
        faceData.y - faceAreaY <= 150 &&
        faceData.rollAngle >= -5 &&
        faceData.rollAngle <= 5 &&
        faceData.yawAngle >= -5 &&
        faceData.yawAngle <= 7
      ) {
        setEyePosition(eyeData);
        setEnableRecording(true);
        setToastText('Ready to Capture');
      } else {
        setEnableRecording(false);
        setEyePosition({});
        if (faceAreaWidth - faceData.width < 0) {
          setToastText('Move your face backward');
        } else if (faceAreaWidth - faceData.width > 150) {
          setToastText('Bring your face little closer');
        } else if (faceData.x - faceAreaX < 0) {
          setToastText('Move your face right');
        } else if (faceData.x - faceAreaX > 150) {
          setToastText('Move your face left');
        } else if (faceData.y - faceAreaY < 0) {
          setToastText('Move your face down');
        } else if (faceData.y - faceAreaY > 150) {
          setToastText('Move your face up');
        } else if (
          faceData.rollAngle >= -5 &&
          faceData.rollAngle <= 5 &&
          faceData.yawAngle >= -5 &&
          faceData.yawAngle <= 7
        ) {
          setToastText('Keep your face straight');
        } else {
          setToastText('Bring your face inside the frame');
        }
      }
    } else {
      setEyePosition({});
      setEnableRecording(false);
      setToastText('');
    }
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
      .then((data) => {
        console.log('videoData: ', data);

        setShowSpinner({
          open: true,
          message: 'Cropping...',
        });
        startProcessingTimer();
        cropVideo(
          data.uri,
          (croppedVideoPath) => {
            setShowSpinner({
              open: true,
              message: 'Converting Frame Rate...',
            });
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
                  setShowSpinner({
                    open: false,
                    message: '',
                  });
                  clearProcessingTimer();
                  setIsRecording(false);
                  setVideoURL(resultPath);
                } else {
                  setShowSpinner({
                    open: false,
                    message: '',
                  });
                  clearProcessingTimer();
                  setIsRecording(false);
                  setVideoURL(resultPath);
                }
              })
              .catch((err) => {
                console.log('RRFFMPEG - FPS Conversion Error', err);
                setShowSpinner({
                  open: false,
                  message: '',
                });
                clearProcessingTimer();
                setIsRecording(false);
                setVideoURL(croppedVideoPath);
              });
          },
          (error) => {
            setShowSpinner({
              open: false,
              message: '',
            });
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
    const paddingValue = 1080 * (15 / width);
    let options = {
      cropWidth: parseInt(1080 - paddingValue),
      cropHeight: parseInt(1080 + 1080 * 0.25),
      cropOffsetX: parseInt((1080 - (1080 - paddingValue)) / 2),
      cropOffsetY: parseInt(
        (1080 + 1080 * 0.25 - (1080 - paddingValue)) / 2 - 1080 * (10 / width),
      ),
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
    // navigation.navigate(SCREEN_NAMES.HOME_OLD)
  };

  const onUploadPress = async () => {
    setShowSpinner({
      open: true,
      message: 'Uploading...',
    });
    startProcessingTimer();

    try {
      const s3bucket = new S3({
        accessKeyId: ACCESS_ID,
        secretAccessKey: ACCESS_KEY,
        Bucket: BUCKET_NAME,
        signatureVersion: 'v4',
      });

      let filename = `VID_${Date.now().toString()}.mp4`;
      if(patientData && patientData.patient_id) {
        filename = `${(patientData.patient_id + "_" + patientData.patient_name).replace(/ /g, "_")}_${Date.now().toString()}.mp4`;
      }
      let contentType = 'video/mp4';
      let contentDeposition = 'inline;filename="' + filename + '"';
      const base64 = await fs.readFile(videoURL, 'base64');
      const arrayBuffer = decode(base64);

      s3bucket.createBucket(() => {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `${BUCKET_FOLDER_FOR_FACE}${filename}`,
          Body: arrayBuffer,
          ContentDisposition: contentDeposition,
          ContentType: contentType,
          ACL: 'public-read',
        };
        s3bucket.upload(params, (err, data) => {
          if (err) {
            console.log('error in callback', err);
            Alert.alert('Error', 'Error in uploading the video');
            setShowSpinner({
              open: false,
              message: '',
            });
            clearProcessingTimer();
            resetStates();
          } else {
            console.log('success', data);
            console.log('Respomse URL : ' + data.Location);
            // handleCreateAssessmentAPI()

            setShowSpinner({
              open: true,
              message: 'Processing...',
            });
            initiateFacialExpressionVideoProcessingAPI(filename)
              .then((result) => {
                console.log(
                  'initiateFacialExpressionVideoProcessingAPI: ',
                  result,
                );
                if (result && result.data === 'Retake') {
                  Alert.alert('Error', 'Please retake the video');
                  // setResultReady(true);
                  // setShowProcessedResult(true);
                  setShowSpinner({
                    open: false,
                    message: '',
                  });
                  clearProcessingTimer();
                  resetStates('');
                  return;
                }

                setResultValue(result.data);
                setResultReady(true);
                setShowSpinner({
                  open: false,
                  message: '',
                });
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
                console.log('Err:', err);
                setShowSpinner({
                  open: false,
                  message: '',
                });
                // setResultReady(true);
                // setShowProcessedResult(true);
                clearProcessingTimer();
                resetStates('');
              });
          }
        });
      });
    } catch (err) {
      Alert.alert('Error', 'Error in uploading the video');
      setShowSpinner({
        open: false,
        message: '',
      });
      clearProcessingTimer();
      resetStates();
    }
  };

  const onRetakePress = () => {
    // setVideoURL("");
    resetStates();
  };

  const handleCreateAssessmentAPI = () => {
    console.log('=========assessment api========', assessment_data);

    let date = new Date(assessment_data.assessment_date);
    let reminder_date = assessment_data.remainder_date
      ? new Date(assessment_data.remainder_date)
      : new Date();
    let facial_exp_parsed_value = JSON.parse(resultValue);
    let facial_exp_result = facial_exp_parsed_value[facial_exp_parsed_value.length - 1];
    let total_score = Number(assessment_data.pupillary_dilation) + Number(facial_exp_result);

    if (assessment_data.isRemainder) {
      createAssessmentAPI(
        {
          patient_id: (patientData && patientData.patient_id) || 0,
          assessment_datetime: date.getTime(),
          type: assessment_data.type,
          current_pain_score: assessment_data.current_pain,
          least_pain_score: assessment_data.least_pain,
          most_pain_score: assessment_data.most_pain,
          description: assessment_data.description,
          pain_location_id: assessment_data.painLocation_id,
          pain_quality_id: assessment_data.pain_activity_id,
          pain_frequency_id: assessment_data.pain_frequency_id,
          note: assessment_data.notes,
          total_score: total_score,
          createdAt: new Date().getTime(),
          createdBy: userId,
          isReminder: assessment_data.isRemainder,
          reminder_datetime: reminder_date.getTime(),
          frequency: assessment_data.frequence,
          pain_impact_id: assessment_data.painImpactId,
          pupillary_dilation: assessment_data.pupillary_dilation,
          facial_expresssion: Number(facial_exp_result),
        },
        token,
      )
        .then((res) => {
          if (res.data.isError) {
            Alert.alert('------invalid assessment-----', res);
            return;
          }
          console.log('----assessment sucessful----', res);
        })
        .catch((err) => {
          console.log('assessment error', err);
        });
    } else {
      createAssessmentAPI(
        {
          patient_id: (patientData && patientData.patient_id) || 0, 
          assessment_datetime: date.getTime(),
          type: assessment_data.type,
          current_pain_score: assessment_data.current_pain,
          least_pain_score: assessment_data.least_pain,
          most_pain_score: assessment_data.most_pain,
          description: assessment_data.description,
          pain_location_id: assessment_data.painLocation_id,
          pain_quality_id: assessment_data.pain_activity_id,
          pain_frequency_id: assessment_data.pain_frequency_id,
          note: assessment_data.notes,
          total_score: total_score,
          createdAt: new Date().getTime(),
          createdBy: userId,
          isReminder: assessment_data.isRemainder,
          pain_impact_id: assessment_data.painImpactId,
          pupillary_dilation: assessment_data.pupillary_dilation,
          facial_expresssion: Number(facial_exp_result),
        },
        token,
      )
        .then((res) => {
          if (res.data.isError) {
            Alert.alert('------invalid assessment-----', res);
            return;
          }
          console.log('----assessment sucessful----', res);
        })
        .catch((err) => {
          console.log('assessment error', err);
        });
    }
  };

  const resetStates = () => {
    setVideoURL('');
    setIsRecording(false);
    setDuration('00:00');
    clearInterval(intervalId);
    setEnableRecording(false);
    setToastText('');
  };

  const handleOnNextPress = () => {
    handleCreateAssessmentAPI();
    navigation.navigate(SCREEN_NAMES.RESULT);
  }

  const getCameraComponent = () => {
    return (
      <>
        <TouchableOpacity
          // activeOpacity={1}
          // onPressOut={() => {
          //   pressOut = setTimeout(() => {
          //     setShowBrightnessSlider(false);
          //   }, 3000);
          // }}
          // onPressIn={(evt) => {
          //   setSelectedSetting('');
          //   setShowBrightnessSlider(true);
          //   if (pressOut) {
          //     clearTimeout(pressOut);
          //   }
          onPress={(evt) => {
            setFocusPoints({
              x: parseFloat(1 - evt.nativeEvent.pageX / width),
              y: parseFloat(1 - (evt.nativeEvent.pageY - 60) / width),
              autoExposure: true,
            });
          }}
          // <View
          style={{
            height: isRecording ? height - 170 - 50 : width + width * 0.25,
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
            defaultVideoQuality={RNCamera.Constants.VideoQuality['1080p']}
            faceDetectionLandmarks={
              RNCamera.Constants.FaceDetection.Landmarks.all
            }
            onFacesDetected={onFaceDetected}
            onCameraReady={() => setIsCameraReady(true)}
            onRecordingStart={() => {
              handleStartRecording();
            }}
            onRecordingEnd={() => {
              handleStopRecording();
            }}
            autoFocus={
              Platform.OS === 'ios'
                ? RNCamera.Constants.AutoFocus.off
                : RNCamera.Constants.AutoFocus.on
              //  RNCamera.Constants.AutoFocus.off
            }
            autoFocusPointOfInterest={foucsPoints || {}}
            zoom={zoom}
            focusDepth={focusDepth}
            exposure={exposure < 0.15 ? 0.15 : exposure}
            flashMode={
              flashOn && isCameraReady
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.off
            }>
            {!isRecording && toastText !== '' && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  width: width,
                  height: 30,
                  backgroundColor: 'rgba(9, 48, 76, 0.5)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                pointerEvents="none">
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 16,
                    color: COLORS.WHITE,
                  }}>
                  {toastText}
                </Text>
              </View>
            )}
            <View style={styles.frameTopLeft} pointerEvents="none"></View>
            <View style={styles.frameTopRight} pointerEvents="none"></View>
            <View style={styles.frameBottomLeft} pointerEvents="none"></View>
            <View style={styles.frameBottomRight} pointerEvents="none"></View>
            {!isRecording && eyePosition.rightEyePosition && (
              <EyeBoundary
                rightEyePosition={eyePosition.rightEyePosition}
                leftEyePosition={eyePosition.leftEyePosition}
                rollAngle={box.rollAngle}
                yawAngle={box.yawAngle}
              />
            )}
            {timer !== '0' && (
              <View style={[styles.timerContainer]} pointerEvents="none">
                <Text style={styles.timerText}>{timer}</Text>
              </View>
            )}
          </RNCamera>
        </TouchableOpacity>
        {/* </View> */}

        {!isRecording && (
          <ScrollView
            style={{
              width: width,
              height: height - (width + width * 0.25),
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: width - 40,
                justifyContent: 'space-between',
                marginTop: 8,
              }}>
              <View>
                <Text>FPS: {fps}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <CustomTouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 30,
                    height: 30,
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
                    size={18}
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
                    width: 30,
                    height: 30,
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
                    // setShowBrightnessSlider(false);
                  }}>
                  <MaterialIcons
                    name="center-focus-strong"
                    size={18}
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
                    width: 30,
                    height: 30,
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
                    // setShowBrightnessSlider(false);
                  }}>
                  <MaterialIcons
                    name="brightness-5"
                    size={18}
                    color={
                      selectedSetting === SETTINGS.EXPOSURE
                        ? COLORS.WHITE
                        : COLORS.GRAY_90
                    }
                  />
                </CustomTouchableOpacity>
              </View>
            </View>
            <View style={{height: 10}} />
            <Text
              style={{
                marginBottom: 14,
                fontSize: 16,
                fontWeight: '400',
                color: COLORS.GRAY_90,
              }}>
              1. Find a well-lit environment.
            </Text>
            <Text
              style={{
                marginBottom: 14,
                fontSize: 16,
                fontWeight: '400',
                color: COLORS.GRAY_90,
              }}>
              2. Position the face with in the frame.
            </Text>
            <Text
              style={{
                marginBottom: 0,
                fontSize: 16,
                fontWeight: '400',
                color: COLORS.GRAY_90,
              }}>
              3. Get ready to not blink for 10 seconds.
            </Text>

            {/* <View style={{ width: width - 40, height: 30, marginTop: 20, marginBottom: 10, flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: "700", color: COLORS.GRAY_90 }}>{"FPS: "}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            backgroundColor: `${COLORS.PRIMARY_MAIN}50`,
                            width: 160,
                            justifyContent: "space-between",
                            height: 30,
                            alignItems: "center",
                            borderRadius: 10,
                            alignSelf: "center",
                        }}
                    >
                        <CustomTouchableOpacity style={{ backgroundColor: (fps === 30 ? COLORS.PRIMARY_MAIN : `${COLORS.PRIMARY_MAIN}50`), width: 80, height: 30, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, alignItems: "center", justifyContent: "center" }} onPress={() => setFps(30)}>
                            <Text
                                style={{
                                    color: COLORS.WHITE,
                                    fontWeight: "700",
                                    fontSize: 17
                                }}
                            >{"30"}</Text>
                        </CustomTouchableOpacity>
                        <CustomTouchableOpacity style={{ backgroundColor: (fps === 60 ? COLORS.PRIMARY_MAIN : `${COLORS.PRIMARY_MAIN}50`), width: 80, height: 30, borderTopRightRadius: 10, borderBottomRightRadius: 10, alignItems: "center", justifyContent: "center" }} onPress={() => setFps(60)}>
                            <Text
                                style={{
                                    color: COLORS.WHITE,
                                    fontWeight: "700",
                                    fontSize: 17
                                }}
                            >{"60"}</Text>
                        </CustomTouchableOpacity>
                    </View>
                </View> */}

            <View
              style={{
                width: width - 40,
                height: 30,
                marginTop: 20,
                marginBottom: 30,
              }}>
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
            </View>

            <View
              style={{
                flex: 1,
                width: width - 40,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}>
              <CustomTouchableOpacity
                disabled={processing}
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={() => {
                  setFlashOn(!flashOn);
                }}>
                <Ionicons
                  name={flashOn ? 'md-flash-off' : 'md-flash'}
                  size={25}
                  color={flashOn ? COLORS.GRAY_60 : COLORS.GRAY_90}
                />
              </CustomTouchableOpacity>
              <CustomButton
                onPress={onStartRecordingPress}
                title="Start Recording"
                textStyle={{color: COLORS.WHITE, textAlign: 'center'}}
                disabled={processing || !enableRecording}
                style={{
                  width: width * 0.5,
                  backgroundColor:
                    processing || !enableRecording
                      ? COLORS.GRAY_40
                      : COLORS.PRIMARY_MAIN,
                  borderColor: COLORS.PRIMARY_MAIN,
                  borderWidth: processing || !enableRecording ? 0 : 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              <CustomTouchableOpacity
                disabled={processing}
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={() => switchCamera()}>
                <Ionicons name="camera-reverse-outline" size={25} />
              </CustomTouchableOpacity>
            </View>
            <View style={{height: 20}} />
          </ScrollView>
        )}

        {
          // ((!isRecording && showBrightnessSlider) ||

          !isRecording && selectedSetting !== '' && (
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                zindex: 1000,
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
                //     ? 20
                //     : (width - foucsPoints.x * 1000) / 1.8 + 60,
                // width: selectedSetting !== '' ? width - 40 : width * 0.5,
                top: width - 40,
                left: 20,
                width: width - 40,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                backgroundColor: `${COLORS.WHITE}70`,
                transform: [
                  {
                    rotate: selectedSetting !== '' ? '360deg' : '270deg',
                  },
                ],
              }}>
              {/* {showBrightnessSlider && (
              <>
                <Text style={{width: 40, textAlign: 'center'}}>{`${parseInt(
                  exposure * 100,
                )}%`}</Text>
                <Slider
                  style={{
                    // width: width - 120
                    width: width * 0.4,
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
              {selectedSetting === SETTINGS.EXPOSURE && (
                <>
                  <Text
                    style={{
                      width: 40,
                      textAlign: 'center',
                    }}>{`${parseInt(zoom * 100)}%`}</Text>
                  <Slider
                    style={{width: width - 120}}
                    minimumValue={0}
                    maximumValue={1}
                    value={exposure}
                    onValueChange={(value) => setExposure(value)}
                    minimumTrackTintColor={COLORS.WHITE}
                    maximumTrackTintColor={COLORS.BLACK}
                  />
                </>
              )}

              {selectedSetting === SETTINGS.ZOOM && (
                <>
                  <Text
                    style={{
                      width: 40,
                      textAlign: 'center',
                    }}>{`${parseInt(zoom * 100)}%`}</Text>
                  <Slider
                    style={{width: width - 120}}
                    minimumValue={0}
                    maximumValue={1}
                    value={zoom}
                    onValueChange={(value) => setZoom(value)}
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
                    style={{width: width - 120}}
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
        <View style={{height: width + width * 0.25, width: width}}>
          <Video
            source={{uri: videoURL}}
            controls={true}
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              bottom: 0,
              right: 0,
              width: width - 40,
              height: width + width * 0.25 - 40,
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
                  {'FINISH'}
                </Text>
              </CustomTouchableOpacity>
            </>
          )}
        </ScrollView>
      </>
    );
  };

  return (
    <View style={styles.body}>
      {videoURL === '' && getCameraComponent()}
      {videoURL !== '' && getVideoPlayerComponent()}
      <Spinner
        visible={spinnerState.open}
        textContent={spinnerState.message}
        textContent={`${spinnerState.message} ${
          processingTimer !== '0' ? `${processingTimer} secs` : ''
        }`}
        textStyle={{color: COLORS.WHITE}}
      />
    </View>
  );
};

export default FacialExpressionScreen;
