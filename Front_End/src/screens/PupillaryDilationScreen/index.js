import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    Dimensions,
    PermissionsAndroid,
    Platform,
    ScrollView,
    PixelRatio
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { RNCamera } from 'react-native-camera';
import Slider from '@react-native-community/slider';
import { ProcessingManager } from 'react-native-video-processing';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import CameraRoll from "@react-native-community/cameraroll";
import MovToMp4 from 'react-native-mov-to-mp4';
import Video from 'react-native-video';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import styles from './styles';
import { secondsToMinsAndSecs } from '../../utils/date';
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

const SETTINGS = {
    ZOOM: "zoom",
    EXPOSURE: "exposure",
    FOCUS_DEPTH: "focusDepth"
}

const PupillaryDilationScreen = ({ navigation }) => {

    const [eyeBorderType, setEyeBorderType] = useState(EYE_BORDER_TYPE.OVAL);
    const [showSpinner, setShowSpinner] = useState(false);
    const [selectedSetting, setSelectedSetting] = useState("");
    const [exposure, setExposure] = useState(0);
    const [zoom, setZoom] = useState(Platform.OS === "ios"? 0.1 : 0.175)
    const [focusDepth, setFocusDepth] = useState(0.3)
    const [timer, setTimer] = useState("0");
    const [duration, setDuration] = useState("00:00");
    const [processing, setProcessing] = useState(false);
    const [captureMode, setCaptureMode] = useState(CAPTURE_MODE.AUTO);
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

    const toggleSettings = (setting) => {
        setSelectedSetting(setting === selectedSetting? "" : setting);
    }

    const switchCamera = () => {
        setCameraType(cameraType === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back);
    }

    const switchEyeBorderType = () => {
        setEyeBorderType(eyeBorderType === EYE_BORDER_TYPE.OVAL ? EYE_BORDER_TYPE.RECTANGLE : EYE_BORDER_TYPE.OVAL);
    }

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
            console.log("videoData: ", data)

            // let options = {
            //     cropWidth: parseInt(width - 40),
            //     cropHeight: parseInt((width - 40)/2),
            //     cropOffsetX: 20,
            //     cropOffsetY: parseInt(((width - ((width - 40) / 2)) / 2)),
            // }


            // const temp = 1280/width;
            // let options = {
            //     cropWidth: parseInt(temp * (width - 40)),
            //     cropHeight: parseInt(temp * ((width - 40) / 2)),
            //     cropOffsetX: parseInt(temp * (20)),
            //     cropOffsetY: parseInt(temp * ((width - ((width - 40) / 2)) / 2)),
            // }
            // console.log("temp: ", temp);
            // console.log("screen width: ", width)
            // console.log("screen height: ", height)
            // console.log("cropOptions: ", options);


            // const screenWidth = PixelRatio.getPixelSizeForLayoutSize(width) * (PixelRatio.getPixelSizeForLayoutSize(width)/width);
            // let options = {
            //     cropWidth: PixelRatio.getPixelSizeForLayoutSize(width) * ((1920/1080) / (1280/800)),
            //     cropHeight: PixelRatio.getPixelSizeForLayoutSize(height) * ((1920/1080) / (1280/800)),
            //     cropOffsetX: 0,
            //     cropOffsetY: 0,
            // }

            let screenWidth = 1080;
            const paddingValue = screenWidth * (60/width);
            let options = {
                cropWidth: screenWidth,
                cropHeight: parseInt((screenWidth + paddingValue)/2),
                cropOffsetX: 0,
                cropOffsetY: parseInt((screenWidth - ((screenWidth + paddingValue) / 2)) / 2) + (100),
            }
            
            if(Platform.OS === "ios") {
                options.quality = "1920x1080"
            }

            console.log("screen width: ", screenWidth)
            console.log("cropOptions: ", options);

            setShowSpinner(true);

            try {
                ProcessingManager.crop(data.uri, options).then(croppedData => {
                    setShowSpinner(false);
                    setIsRecording(false);
                    setVideoURL(croppedData);
                }).catch(error => {
                    console.log('error', error);
                    setShowSpinner(false);
                    setIsRecording(false);
                    setVideoURL(data.uri);
                })
            } catch(error) {
                console.log('error', error);
                setShowSpinner(false);
                setIsRecording(false);
                setVideoURL(data.uri);
            }
            
        }).catch(err => {
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
        resetStates();
    }

    const resetStates = () => {
        setVideoURL("");
        setIsRecording(false);
        setDuration("00:00");
        clearInterval(intervalId);
    }

    const getCameraComponent = () => {
        return (<>
            <View style={{ height: isRecording ? (height - 170 - 50) : width, width: width, overflow: "hidden" }}>
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
                    autoFocus={Platform.OS === "ios"? RNCamera.Constants.AutoFocus.off : RNCamera.Constants.AutoFocus.on}
                    defaultVideoQuality={RNCamera.Constants.VideoQuality["1080p"]}
                    onCameraReady={() => setIsCameraReady(true)}
                    onRecordingStart={() => {
                        handleStartRecording();
                    }}
                    onRecordingEnd={() => {
                        handleStopRecording();
                    }}
                    zoom={zoom}
                    focusDepth={focusDepth}
                    exposure={exposure}
                >
                    <View style={styles.frameTopLeft} pointerEvents="none"></View>
                    <View style={styles.frameTopRight} pointerEvents="none"></View>
                    <View style={styles.frameBottomLeft} pointerEvents="none"></View>
                    <View style={styles.frameBottomRight} pointerEvents="none"></View>
                    {eyeBorderType === EYE_BORDER_TYPE.RECTANGLE && <View style={styles.eyeBorderRect} pointerEvents="none"></View>}
                    {eyeBorderType === EYE_BORDER_TYPE.OVAL && <View style={styles.eyeBorderOval} pointerEvents="none"></View>}
                    {eyeBorderType === EYE_BORDER_TYPE.OVAL && <View style={styles.eyeBorderCircle} pointerEvents="none"></View>}
                    {timer !== "0" && <View style={[styles.timerContainer]} pointerEvents="none"><Text style={styles.timerText}>{timer}</Text></View>}
                    {isRecording && <View style={{ position: "absolute", bottom: 0, width: width, height: 91, backgroundColor: "rgba(9, 48, 76, 0.5)", alignItems: 'center', justifyContent: "space-around" }} pointerEvents="none">
                        <Text style={{ fontWeight: "700", fontSize: 16, color: COLORS.WHITE }}>NO Blink</Text>
                        <Text style={{ fontWeight: "700", fontSize: 16, color: COLORS.WHITE }}>Record for at least 10 seconds</Text>
                    </View>}
                </RNCamera>
            </View>

            {!isRecording && <ScrollView style={{ width: width, height: height - width, paddingHorizontal: 20 }}>
                <View style={{ height: 8 }} />
                <View style={{ flexDirection: "row", width: width - 40, justifyContent: 'flex-end', marginBottom: 8 }}>
                    <CustomTouchableOpacity style={{ alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 5, backgroundColor: selectedSetting === SETTINGS.ZOOM? COLORS.PRIMARY_MAIN : "rgba(0,0,0,0)", borderColor: COLORS.PRIMARY_MAIN, borderWidth: selectedSetting === SETTINGS.ZOOM? 0 : 2, alignItems: "center", justifyContent: "center" }} onPress={() => toggleSettings(SETTINGS.ZOOM)}>
                        <Fontisto name="zoom" size={18} color={selectedSetting === SETTINGS.ZOOM? COLORS.WHITE : COLORS.GRAY_90}/>
                    </CustomTouchableOpacity>
                    <CustomTouchableOpacity style={{ marginLeft: 15, alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 5, backgroundColor: selectedSetting === SETTINGS.FOCUS_DEPTH? COLORS.PRIMARY_MAIN : "rgba(0,0,0,0)", borderColor: COLORS.PRIMARY_MAIN, borderWidth: selectedSetting === SETTINGS.FOCUS_DEPTH? 0 : 2, alignItems: "center", justifyContent: "center" }} onPress={() => toggleSettings(SETTINGS.FOCUS_DEPTH)}>
                        <MaterialIcons name="center-focus-strong" size={18} color={selectedSetting === SETTINGS.FOCUS_DEPTH? COLORS.WHITE : COLORS.GRAY_90}/>
                    </CustomTouchableOpacity>
                    <CustomTouchableOpacity style={{ marginLeft: 15, alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 5, backgroundColor: selectedSetting === SETTINGS.EXPOSURE? COLORS.PRIMARY_MAIN : "rgba(0,0,0,0)", borderColor: COLORS.PRIMARY_MAIN, borderWidth: selectedSetting === SETTINGS.EXPOSURE? 0 : 2, alignItems: "center", justifyContent: "center" }} onPress={() => toggleSettings(SETTINGS.EXPOSURE)}>
                        <MaterialIcons name="brightness-5" size={18} color={selectedSetting === SETTINGS.EXPOSURE? COLORS.WHITE : COLORS.GRAY_90}/>
                    </CustomTouchableOpacity>
                </View>
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>1. Find a well-lit environment.</Text>
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>2. Position one eye within the circular frame.</Text>
                {/* <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>3. Turn your device  horizontally if needed.</Text> */}
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>3. Get ready to not blink for 10 seconds.</Text>
                <Text style={{ marginBottom: 0, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>4. Record the eye for at least 10 seconds.</Text>
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
                    {/* <CustomTouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => switchEyeBorderType()}>
                        {eyeBorderType === EYE_BORDER_TYPE.OVAL && <View style={{ width: 30, height: 15, borderWidth: 2, borderColor: COLORS.BLACK }}></View>}
                        {eyeBorderType === EYE_BORDER_TYPE.RECTANGLE && <View style={{ width: 15, height: 15, borderRadius: 15 / 2, borderWidth: 2, borderColor: COLORS.BLACK, transform: [{ scaleX: 2 }] }}></View>}
                    </CustomTouchableOpacity> */}
                    <View style={{ width: 25, height: 25 }}></View>
                    <CustomTouchableOpacity disabled={processing}
                        style={{ backgroundColor: processing ? `${COLORS.PRIMARY_MAIN}50` : COLORS.PRIMARY_MAIN, borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, paddingHorizontal: 28 }}
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

            {(!isRecording && selectedSetting !== "") && <View style={{ flexDirection: "row", position: "absolute", top: (width - 50 - 25), left: 20, width: width-40, height: 50 , alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: `${COLORS.WHITE}70` }}>
                {selectedSetting === SETTINGS.EXPOSURE && <>
                    <Text style={{ width: 40, textAlign: 'center' }}>{`${parseInt(exposure*100)}%`}</Text>
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
                    <Text style={{ width: 40, textAlign: 'center' }}>{`${parseInt(zoom*100)}%`}</Text>
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
                    <Text style={{ width: 40, textAlign: 'center' }}>{`${parseInt(focusDepth*100)}%`}</Text>
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
                    <CustomTouchableOpacity style={{ marginBottom: 20 }} disabled={captureMode === CAPTURE_MODE.AUTO} onPress={() => stopRecordingVideo()}>
                        <View style={{ width: 54, height: 54, borderRadius: 54 / 2, backgroundColor: captureMode === CAPTURE_MODE.AUTO ? "#C9414150" : "#C94141", borderWidth: 5, borderColor: COLORS.WHITE }}></View>
                    </CustomTouchableOpacity>
                </View>
            </>}
            <Spinner
                visible={showSpinner}
                textContent={'Cropping...'}
                textStyle={{ color: COLORS.WHITE }}
            />
        </>);
    }

    const getVideoPlayerComponent = () => {
        return (<>
            <View style={{ height: width, width: width }}>
                <Video
                    source={{ uri: videoURL }}
                    controls={true}
                    resizeMode={"contain"}
                    style={{ position: 'absolute', top: 20, left: 20, bottom: 0, right: 0, width: width - 40, height: width - 40 }} />
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

export default PupillaryDilationScreen;
