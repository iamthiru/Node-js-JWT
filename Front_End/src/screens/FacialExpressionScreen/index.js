import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
    Dimensions,
    PermissionsAndroid,
    Platform,
    NativeModules
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Slider from '@react-native-community/slider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Spinner from 'react-native-loading-spinner-overlay';
import { RNFFmpeg } from 'react-native-ffmpeg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CameraRoll from "@react-native-community/cameraroll";
import MovToMp4 from 'react-native-mov-to-mp4';
import Video from 'react-native-video';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import styles from './styles';
import { secondsToMinsAndSecs } from '../../utils/date';
import EyeBoundary from './EyeBoundary';
import { COLORS } from '../../constants/colors';
import { SCREEN_NAMES } from '../../constants/navigation';

const { width, height } = Dimensions.get("window");
const { VideoCropper } = NativeModules

let camera = null;
let intervalId = null;

const EYE_BORDER_TYPE = {
    OVAL: "oval",
    RECTANGLE: "rectangle"
}

const CAPTURE_MODE = {
    AUTO: "auto",
    MANUAL: "manual"
}

const SETTINGS = {
    ZOOM: "zoom",
    EXPOSURE: "exposure",
    FOCUS_DEPTH: "focusDepth"
}

const FacialExpressionScreen = ({ navigation }) => {

    const [eyeBorderType, setEyeBorderType] = useState(EYE_BORDER_TYPE.OVAL)
    const [timer, setTimer] = useState("0");
    const [duration, setDuration] = useState("00:00");
    const [processing, setProcessing] = useState(false);
    const [enableRecording, setEnableRecording] = useState(false);
    const [captureMode, setCaptureMode] = useState(CAPTURE_MODE.AUTO);
    const [selectedSetting, setSelectedSetting] = useState("");
    const [toastText, setToastText] = useState("");
    const [box, setBox] = useState({});
    const [eyePosition, setEyePosition] = useState({});
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
    const [isRecording, setIsRecording] = useState(false);
    const [videoURL, setVideoURL] = useState("");
    const [fps, setFps] = useState(30);
    const [exposure, setExposure] = useState(0.3);
    const [zoom, setZoom] = useState(Platform.OS === "ios" ? 0.1 : 0.175)
    const [focusDepth, setFocusDepth] = useState(0.3)
    const [spinnerState, setShowSpinner] = useState({
        open: false,
        message: ''
    });


    useEffect(() => {
        setTimeout(() => checkStoragePermission(), 3000);
    }, [])

    const toggleSettings = (setting) => {
        setSelectedSetting(setting === selectedSetting ? "" : setting);
    }

    const checkStoragePermission = async () => {
        if (Platform.OS !== "android") {
            return;
        }

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: "Storage Permission",
                    message: "App needs access to memory to store files"
                }
            );
        } catch (err) {
            console.warn(err);
        }
    }

    const switchCamera = () => {
        setCameraType(cameraType === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back);
    }

    const switchEyeBorderType = () => {
        setEyeBorderType(eyeBorderType === EYE_BORDER_TYPE.OVAL ? EYE_BORDER_TYPE.RECTANGLE : EYE_BORDER_TYPE.OVAL);
    }

    const onFaceDetected = ({ faces }) => {
        if (faces[0]) {
            let faceData = {
                width: faces[0].bounds.size.width,
                height: faces[0].bounds.size.height,
                x: faces[0].bounds.origin.x,
                y: faces[0].bounds.origin.y,
                yawAngle: faces[0].yawAngle,
                rollAngle: faces[0].rollAngle
            };
            let eyeData = {
                rightEyePosition: faces[0].rightEyePosition,
                leftEyePosition: faces[0].leftEyePosition
            };

            let faceAreaWidth = (width - 40);
            let faceAreaX = ((width - faceAreaWidth) / 2);
            let faceAreaY = (((width + (width * 0.25)) - (width - 40)) / 2);

            console.log(faceAreaWidth, faceAreaX, faceAreaY)
            console.log("faceData: ", faceData)
            console.log("eyeData: ", eyeData)

            setBox(faceData);

            if (((faceAreaWidth - faceData.width) >= 0 && (faceAreaWidth - faceData.width) <= 150 && (faceData.x - faceAreaX) >= 0 && (faceData.x - faceAreaX) <= 150) &&
                ((faceData.y - faceAreaY) >= 0 && (faceData.y - faceAreaY) <= 150) &&
                (faceData.rollAngle >= -5 && faceData.rollAngle <= 5 && faceData.yawAngle >= -5 && faceData.yawAngle <= 7)) {
                setEyePosition(eyeData);
                setEnableRecording(true);
                setToastText("Ready to Capture");
            }
            else {
                setEnableRecording(false);
                setEyePosition({});
                if ((faceAreaWidth - faceData.width) < 0) {
                    setToastText("Move your face backward");
                }
                else if ((faceAreaWidth - faceData.width) > 150) {
                    setToastText("Bring your face little closer");
                }
                else if ((faceData.x - faceAreaX) < 0) {
                    setToastText("Move your face right");
                }
                else if ((faceData.x - faceAreaX) > 150) {
                    setToastText("Move your face left");
                }
                else if ((faceData.y - faceAreaY) < 0) {
                    setToastText("Move your face down");
                }
                else if ((faceData.y - faceAreaY) > 150) {
                    setToastText("Move your face up");
                }
                else if ((faceData.rollAngle >= -5 && faceData.rollAngle <= 5 && faceData.yawAngle >= -5 && faceData.yawAngle <= 7)) {
                    setToastText("Keep your face straight");
                }
                else {
                    setToastText("Bring your face inside the frame");
                }
            }
        } else {
            setEyePosition({});
            setEnableRecording(false);
            setToastText("");
        }
    };

    const onStartRecordingPress = () => {
        setProcessing(true);
        let timerValue = 3;
        setTimer(timerValue.toString());

        intervalId = setInterval(() => {
            timerValue -= 1;
            (timerValue >= 1) && setTimer(timerValue.toString());
        }, 1000)
        setTimeout(() => {
            setProcessing(false);
            setTimer("0");
            clearInterval(intervalId);
            recordVideo();
        }, 3000)
    }

    const recordVideo = () => {
        if (!isCameraReady) {
            return;
        }

        camera.recordAsync({ mute: true, quality: RNCamera.Constants.VideoQuality['1080p'] }).then((data) => {
            console.log("videoData: ", data);
           
            setShowSpinner({
                open: true,
                message: 'Cropping...'
            })
            cropVideo(data.uri, (croppedVideoPath) => {
                setShowSpinner({
                    open: true,
                    message: 'Converting Frame Rate...'
                }); 
                let resultPath = `${croppedVideoPath.substring(0, croppedVideoPath.lastIndexOf("."))}_2.mp4`;
                RNFFmpeg.execute(`-i ${croppedVideoPath} -filter:v fps=${fps} -preset ultrafast ${resultPath}`).then(async res => {
                    console.log("RRFFMPEG - FPS Conversion Success", resultPath)
                    if(Platform.OS === "ios") {
                        setShowSpinner({
                            open: false,
                            message: ''
                        });
                        setIsRecording(false);
                        setVideoURL(resultPath);
                    } else {
                        setShowSpinner({
                            open: false,
                            message: ''
                        });
                        setIsRecording(false);
                        setVideoURL(resultPath);
                    }
                }).catch(err => {
                    console.log("RRFFMPEG - FPS Conversion Error", err)
                    setShowSpinner({
                        open: false,
                        message: ''
                    });
                    setIsRecording(false);
                    setVideoURL(croppedVideoPath);
                })
            }, (error) => {
                setShowSpinner({
                    open: false,
                    message: ''
                });
                setIsRecording(false);
                setVideoURL(error.originalPath);
            });

        }).catch(err => {
            setIsRecording(false);
        })
    }

    const cropVideo = async (videoURI, successCallback, errorCallback) => {
        const paddingValue = 1080 * (15 / width);
        let options = {
            cropWidth: parseInt(1080 - paddingValue),
            cropHeight: parseInt(1080 + (1080 * 0.25)),
            cropOffsetX: parseInt((1080 - (1080 - paddingValue)) / 2),
            cropOffsetY: parseInt((((1080 + (1080 * 0.25)) - (1080 - paddingValue)) / 2) - (1080 * (10 / width))),
        }
        if (Platform.OS === "ios") {
            options.quality = "1920x1080"
        }

        try {
            if(Platform.OS === 'ios') {
                VideoCropper.crop(videoURI, options, (error, croppedVideoPath) => {
                    if(!error){
                        console.log("VideoCropper - Crop Success", croppedVideoPath)
                        successCallback(croppedVideoPath)
                    } else {
                        console.log("VideoCropper - Crop Error", error)
                        errorCallback({ originalPath: videoURI });
                    }
                })
                return
            } else {
                let croppedResultPath = `${videoURI.substring(0, videoURI.lastIndexOf("."))}_crop.mp4`;
                // RNFFmpeg.execute(`-i ${videoURI} -filter:v "crop=${options.cropWidth}:${options.cropHeight}:${options.cropOffsetX}:${options.cropOffsetY}" ${croppedResultPath}`).then( async result => {
                RNFFmpeg.execute(`-y -i ${videoURI} -vf "crop=${options.cropWidth}:${options.cropHeight}:${options.cropOffsetX}:${options.cropOffsetY}" -preset ultrafast -c:a copy -strict -2 ${croppedResultPath}`).then(async result => {
                    console.log("RRFFMPEG - Crop Success", croppedResultPath)
                    successCallback(croppedResultPath);
                }).catch(error => {
                    console.log("RRFFMPEG - Crop Error", error)
                    errorCallback({ originalPath: videoURI });
                })
            }
        } catch (error) {
            console.log('error', error);
            errorCallback({ originalPath: videoURI });
        }
    }

    const handleStartRecording = () => {
        setIsRecording(true);
        let durationValue = 0;
        setDuration("00:00");
        intervalId = setInterval(() => {
            durationValue += 1;
            (captureMode === CAPTURE_MODE.MANUAL || (captureMode === CAPTURE_MODE.AUTO && durationValue <= 10)) && setDuration(secondsToMinsAndSecs(durationValue));
        }, 1000);

        if (captureMode === CAPTURE_MODE.AUTO) {
            setTimeout(() => {
                stopRecordingVideo();
            }, 11000)
        }
    }

    const stopRecordingVideo = () => {
        camera.stopRecording();
    }

    const handleStopRecording = () => {
        // setIsRecording(false);
        setDuration("00:00");
        clearInterval(intervalId);
    }

    const onConfirmPress = () => {
        // if (false && Platform.OS === "ios") {
        //     const filename = `VID_${Date.now().toString()}`;
        //     MovToMp4.convertMovToMp4(videoURL, filename)
        //         .then(function (results) {
        //             CameraRoll.save(results, { type: "video" }).then(res => {
        //                 Alert.alert("Success", "Video has been saved successfully!");
        //                 resetStates();
        //             }).catch(err => {
        //                 Alert.alert("Error", "Download Failed!");
        //                 resetStates();
        //             })
        //         });
        // } else {
        //     CameraRoll.save(videoURL, { type: "video" }).then(res => {
        //         Alert.alert("Success", "Video has been saved successfully!");
        //         resetStates();
        //     }).catch(err => {
        //         Alert.alert("Error", "Download Failed!");
        //         resetStates();
        //     })
        // }
        navigation.navigate(SCREEN_NAMES.HOME_OLD)
    }

    const onRetakePress = () => {
        // setVideoURL("");
        resetStates();
    }

    const resetStates = () => {
        setVideoURL("");
        setIsRecording(false);
        setDuration("00:00");
        clearInterval(intervalId);
        setEnableRecording(false);
        setToastText("");
    }

    const getCameraComponent = () => {
        return (<>
            <View style={{ height: isRecording ? (height - 170 - 50) : (width + (width * 0.25)), width: width, overflow: "hidden" }}>
                <RNCamera
                    ref={ref => { camera = ref; }}
                    style={{ height: (height - 170 - 50), width: width }}
                    type={cameraType}
                    captureAudio={false}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel'
                    }}
                    useNativeZoom={true}
                    ratio={"16:9"}
                    defaultVideoQuality={RNCamera.Constants.VideoQuality["1080p"]}
                    faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                    onFacesDetected={onFaceDetected}
                    onCameraReady={() => setIsCameraReady(true)}
                    onRecordingStart={() => {
                        handleStartRecording();
                    }}
                    onRecordingEnd={() => {
                        handleStopRecording();

                    }}
                    zoom={zoom}
                    focusDepth={focusDepth}
                    exposure={exposure < 0.15? 0.15 : exposure}
                >
                    {(!isRecording && toastText !== "") && <View style={{ position: "absolute", top: 0, width: width, height: 30, backgroundColor: "rgba(9, 48, 76, 0.5)", alignItems: 'center', justifyContent: "center" }} pointerEvents="none">
                        <Text style={{ fontWeight: "700", fontSize: 16, color: COLORS.WHITE }}>{toastText}</Text>
                    </View>}
                    <View style={styles.frameTopLeft} pointerEvents="none"></View>
                    <View style={styles.frameTopRight} pointerEvents="none"></View>
                    <View style={styles.frameBottomLeft} pointerEvents="none"></View>
                    <View style={styles.frameBottomRight} pointerEvents="none"></View>
                    {(!isRecording && eyePosition.rightEyePosition) && <EyeBoundary rightEyePosition={eyePosition.rightEyePosition}
                        leftEyePosition={eyePosition.leftEyePosition}
                        rollAngle={box.rollAngle}
                        yawAngle={box.yawAngle} />}
                    {timer !== "0" && <View style={[styles.timerContainer]} pointerEvents="none"><Text style={styles.timerText}>{timer}</Text></View>}
                </RNCamera>
            </View>

            {!isRecording && <ScrollView style={{ width: width, height: height - ((width + (width * 0.25))), paddingHorizontal: 20 }}>
                <View style={{ flexDirection: "row", width: width - 40, justifyContent: 'flex-end', marginTop: 8 }}>
                    <CustomTouchableOpacity style={{ alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 5, backgroundColor: selectedSetting === SETTINGS.ZOOM ? COLORS.PRIMARY_MAIN : "rgba(0,0,0,0)", borderColor: COLORS.PRIMARY_MAIN, borderWidth: selectedSetting === SETTINGS.ZOOM ? 0 : 2, alignItems: "center", justifyContent: "center" }} onPress={() => toggleSettings(SETTINGS.ZOOM)}>
                        <Fontisto name="zoom" size={18} color={selectedSetting === SETTINGS.ZOOM ? COLORS.WHITE : COLORS.GRAY_90} />
                    </CustomTouchableOpacity>
                    <CustomTouchableOpacity style={{ marginLeft: 15, alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 5, backgroundColor: selectedSetting === SETTINGS.FOCUS_DEPTH ? COLORS.PRIMARY_MAIN : "rgba(0,0,0,0)", borderColor: COLORS.PRIMARY_MAIN, borderWidth: selectedSetting === SETTINGS.FOCUS_DEPTH ? 0 : 2, alignItems: "center", justifyContent: "center" }} onPress={() => toggleSettings(SETTINGS.FOCUS_DEPTH)}>
                        <MaterialIcons name="center-focus-strong" size={18} color={selectedSetting === SETTINGS.FOCUS_DEPTH ? COLORS.WHITE : COLORS.GRAY_90} />
                    </CustomTouchableOpacity>
                    <CustomTouchableOpacity style={{ marginLeft: 15, alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 5, backgroundColor: selectedSetting === SETTINGS.EXPOSURE ? COLORS.PRIMARY_MAIN : "rgba(0,0,0,0)", borderColor: COLORS.PRIMARY_MAIN, borderWidth: selectedSetting === SETTINGS.EXPOSURE ? 0 : 2, alignItems: "center", justifyContent: "center" }} onPress={() => toggleSettings(SETTINGS.EXPOSURE)}>
                        <MaterialIcons name="brightness-5" size={18} color={selectedSetting === SETTINGS.EXPOSURE ? COLORS.WHITE : COLORS.GRAY_90} />
                    </CustomTouchableOpacity>
                </View>
                <View style={{ height: 10 }} />
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>1. Find a well-lit environment.</Text>
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>2. Position the face with in the frame.</Text>
                <Text style={{ marginBottom: 0, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>3. Get ready to not blink for 10 seconds.</Text>

                <View style={{ width: width - 40, height: 30, marginTop: 20, marginBottom: 10, flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
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
                </View>

                <View style={{ width: width - 40, height: 30, marginTop: 10, marginBottom: 30 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            backgroundColor: `${COLORS.PRIMARY_MAIN}50`,
                            width: 200,
                            justifyContent: "space-between",
                            height: 30,
                            alignItems: "center",
                            borderRadius: 10,
                            alignSelf: "center",

                        }}
                    >
                        <CustomTouchableOpacity style={{ backgroundColor: (captureMode === CAPTURE_MODE.AUTO ? COLORS.PRIMARY_MAIN : `${COLORS.PRIMARY_MAIN}50`), width: 100, height: 30, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, alignItems: "center", justifyContent: "center" }} onPress={() => setCaptureMode(CAPTURE_MODE.AUTO)}>
                            <Text
                                style={{
                                    color: COLORS.WHITE,
                                    fontWeight: "700",
                                    fontSize: 17
                                }}
                            >{"Auto"}</Text>
                        </CustomTouchableOpacity>
                        <CustomTouchableOpacity style={{ backgroundColor: (captureMode === CAPTURE_MODE.MANUAL ? COLORS.PRIMARY_MAIN : `${COLORS.PRIMARY_MAIN}50`), width: 100, height: 30, borderTopRightRadius: 10, borderBottomRightRadius: 10, alignItems: "center", justifyContent: "center" }} onPress={() => setCaptureMode(CAPTURE_MODE.MANUAL)}>
                            <Text
                                style={{
                                    color: COLORS.WHITE,
                                    fontWeight: "700",
                                    fontSize: 17
                                }}
                            >{"Manual"}</Text>
                        </CustomTouchableOpacity>
                    </View>
                </View>

                <View style={{ flex: 1, width: width - 40, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }}>
                    <View style={{ width: 25, height: 25 }}></View>
                    <CustomTouchableOpacity disabled={processing || !enableRecording}
                        style={{ backgroundColor: (processing || !enableRecording) ? `${COLORS.PRIMARY_MAIN}50` : COLORS.PRIMARY_MAIN, borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, paddingHorizontal: 28 }}
                        onPress={onStartRecordingPress}
                    >
                        <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.WHITE, textAlign: "center" }}>{"START RECORDING"}</Text>
                    </CustomTouchableOpacity>
                    <CustomTouchableOpacity disabled={processing} style={{ alignItems: "center", justifyContent: "center" }} onPress={() => switchCamera()}>
                        <Ionicons name="camera-reverse-outline" size={25} />
                    </CustomTouchableOpacity>
                </View>
                <View style={{ height: 20 }} />
            </ScrollView>}

            {(!isRecording && selectedSetting !== "") && <View style={{ flexDirection: "row", position: "absolute", top: width - 40, left: 20, width: width - 40, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: `${COLORS.WHITE}70` }}>
                {selectedSetting === SETTINGS.EXPOSURE && <>
                    <Text style={{ width: 40, textAlign: 'center' }}>{`${parseInt(exposure * 100)}%`}</Text>
                    <Slider
                        style={{ width: width - 120 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={exposure}
                        onValueChange={(value) => setExposure(value)}
                        minimumTrackTintColor={COLORS.WHITE}
                        maximumTrackTintColor={COLORS.BLACK}
                    />
                </>}
                {selectedSetting === SETTINGS.ZOOM && <>
                    <Text style={{ width: 40, textAlign: 'center' }}>{`${parseInt(zoom * 100)}%`}</Text>
                    <Slider
                        style={{ width: width - 120 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={zoom}
                        onValueChange={(value) => setZoom(value)}
                        minimumTrackTintColor={COLORS.WHITE}
                        maximumTrackTintColor={COLORS.BLACK}
                    />
                </>}
                {selectedSetting === SETTINGS.FOCUS_DEPTH && <>
                    <Text style={{ width: 40, textAlign: 'center' }}>{`${parseInt(focusDepth * 100)}%`}</Text>
                    <Slider
                        style={{ width: width - 120 }}
                        minimumValue={0}
                        maximumValue={1}
                        value={focusDepth}
                        onValueChange={(value) => setFocusDepth(value)}
                        minimumTrackTintColor={COLORS.WHITE}
                        maximumTrackTintColor={COLORS.BLACK}
                    />
                </>}
            </View>}

            {isRecording && <>
                <View style={{ height: 170, width: width, backgroundColor: COLORS.PRIMARY_MAIN, alignItems: "center" }}>
                    <Text style={{ textAlign: "center", width: width, color: COLORS.WHITE, fontSize: 16, fontWeight: "700", marginTop: 14, marginBottom: 20 }}>{duration}</Text>
                    <CustomTouchableOpacity disabled={captureMode === CAPTURE_MODE.AUTO} onPress={() => stopRecordingVideo()}>
                        <View style={{ width: 54, height: 54, borderRadius: 54 / 2, backgroundColor: captureMode === CAPTURE_MODE.AUTO ? "#C9414150" : "#C94141", borderWidth: 5, borderColor: COLORS.WHITE }}></View>
                    </CustomTouchableOpacity>
                </View>
            </>}
        </>);
    }

    const getVideoPlayerComponent = () => {
        return (<>
            <View style={{ height: (width + (width * 0.25)), width: width }}>
                <Video
                    source={{ uri: videoURL }}
                    controls={true}
                    style={{ position: 'absolute', top: 20, left: 20, bottom: 0, right: 0, width: width - 40, height: (width + (width * 0.25)) - 40 }} />
            </View>
            <View style={{ width: width, justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                <CustomTouchableOpacity disabled={processing}
                    style={{ backgroundColor: COLORS.PRIMARY_MAIN, borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, width: width - 80, paddingHorizontal: 28, marginBottom: 12 }}
                    onPress={onConfirmPress}
                >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.WHITE, textAlign: "center" }}>{"CONFIRM"}</Text>
                </CustomTouchableOpacity>
                <CustomTouchableOpacity disabled={processing}
                    style={{ backgroundColor: COLORS.WHITE, borderRadius: 10, borderColor: COLORS.PRIMARY_MAIN, borderWidth: 2, alignItems: "center", justifyContent: "center", height: 48, width: width - 80, paddingHorizontal: 28 }}
                    onPress={onRetakePress}
                >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.GRAY_90, textAlign: "center" }}>{"RETAKE"}</Text>
                </CustomTouchableOpacity>
            </View>
        </>)
    }

    return (
        <View style={styles.body}>
            {videoURL === "" && getCameraComponent()}
            {videoURL !== "" && getVideoPlayerComponent()}
            <Spinner
                visible={spinnerState.open}
                textContent={spinnerState.message}
                textStyle={{ color: COLORS.WHITE }}
            />
        </View>
    );
};

export default FacialExpressionScreen;
