import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
    Dimensions,
    PermissionsAndroid,
    Platform
} from 'react-native';
import { RNCamera } from 'react-native-camera';
// import { ProcessingManager } from 'react-native-video-processing';
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

const { width, height } = Dimensions.get("window");

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

const FacialExpressionScreen = ({ navigation }) => {

    const [eyeBorderType, setEyeBorderType] = useState(EYE_BORDER_TYPE.OVAL)
    const [timer, setTimer] = useState("0");
    const [duration, setDuration] = useState("00:00");
    const [processing, setProcessing] = useState(false);
    const [enableRecording, setEnableRecording] = useState(false);
    const [captureMode, setCaptureMode] = useState(CAPTURE_MODE.AUTO);
    const [toastText, setToastText] = useState("");
    const [box, setBox] = useState({});
    const [eyePosition, setEyePosition] = useState({});
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
    const [isRecording, setIsRecording] = useState(false);
    const [videoURL, setVideoURL] = useState("");


    useEffect(() => {
        setTimeout(() => checkStoragePermission(), 3000);
    }, [])

    const checkStoragePermission = async () => {
        if(Platform.OS !== "android") {
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
            /* const paddingValue = 1080 * (15/width);
            let options = {
                cropWidth: parseInt(1080 - paddingValue),
                cropHeight: parseInt(1080 + (1080 * 0.25)),
                cropOffsetX: parseInt((1080 - (1080 - paddingValue)) / 2),
                cropOffsetY: parseInt((((1080 + (1080 * 0.25)) - (1080 - paddingValue)) / 2) - (1080 * (10/width))),
            }
            if(Platform.OS === "ios") {
                options.quality = "1920x1080"
            }

            ProcessingManager.crop(data.uri, options).then(croppedData => {
                setIsRecording(false);
                setVideoURL(croppedData);
            }).catch(error => {
                console.log('error', error);
                setIsRecording(false);
            }) */
            // setVideoURL(data.uri);

            const videoType = data.uri.substring(data.uri.lastIndexOf(".") + 1, data.uri.length);
            if (videoType.toLowerCase() !== "mp4") {
                let convertedVideoPath = `${data.uri.substring(0, data.uri.lastIndexOf("."))}_conv.mp4`
                RNFFmpeg.execute(`-i ${data.uri} -qscale 0 ${convertedVideoPath}`).then(async res => {
                    console.log("RNFFmpeg Conversion Success")
                    cropVideo(convertedVideoPath)
                }).catch(err => {
                    console.log("RNFFmpeg Conversion Error")
                    cropVideo(data.uri)
                })
            } else {
                cropVideo(data.uri)
            }

        }).catch(err => {
            setIsRecording(false);
        })
    }

    const cropVideo = async (videoURI) => {
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

        let croppedResultPath = `${videoURI.substring(0, videoURI.lastIndexOf("."))}_crop.mp4`;
        RNFFmpeg.execute(`-i ${videoURI} -filter:v "crop=${options.cropWidth}:${options.cropHeight}:${options.cropOffsetX}:${options.cropOffsetY}" ${croppedResultPath}`).then(croppedData => {
            setIsRecording(false);
            setVideoURL(croppedData);
        }).catch(error => {
            console.log('error', error);
            setIsRecording(false);
        })
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
        if(Platform.OS === "ios") {
            const filename = `VID_${Date.now().toString()}`;
            MovToMp4.convertMovToMp4(videoURL, filename)
              .then(function (results) {
                CameraRoll.save(results, { type: "video" }).then(res => {
                    Alert.alert("Success", "Video has been saved successfully!");
                    resetStates();
                }).catch(err => {
                    Alert.alert("Error", "Download Failed!");
                    resetStates();
                })
            });
        } else {
            CameraRoll.save(videoURL, { type: "video" }).then(res => {
                Alert.alert("Success", "Video has been saved successfully!");
                resetStates();
            }).catch(err => {
                Alert.alert("Error", "Download Failed!");
                resetStates();
            })
        }
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
                <View style={{ height: 38 }} />
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>1. Find a well-lit environment.</Text>
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>2. Position the face with in the frame.</Text>
                <Text style={{ marginBottom: 0, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>3. Get ready to not blink for 10 seconds.</Text>

                <View style={{ width: width - 40, height: 30, marginTop: 20, marginBottom: 30 }}>
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
        </View>
    );
};

export default FacialExpressionScreen;
