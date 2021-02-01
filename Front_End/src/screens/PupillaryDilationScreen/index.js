import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    Dimensions,
    PermissionsAndroid,
    Platform,
    ScrollView
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { ProcessingManager } from 'react-native-video-processing';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs'
import Video from 'react-native-video';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import styles from './styles';
import { secondsToMinsAndSecs } from '../../utils/date';

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

const PupillaryDilationScreen = ({ navigation }) => {

    const [eyeBorderType, setEyeBorderType] = useState(EYE_BORDER_TYPE.OVAL)
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
            // const options = {
            //     cropWidth: width - 40,
            //     cropHeight: (width - 40)/2,
            //     cropOffsetX: 20,
            //     cropOffsetY: ((width - ((width - 40) / 2)) / 2),
            // }
            const paddingValue = 1080 * (15/width);
            const options = {
                cropWidth: 1080 - (paddingValue * 2),
                cropHeight: (1080 - (paddingValue * 2))/2,
                cropOffsetX: paddingValue,
                cropOffsetY: ((1080 - ((1080 - (paddingValue * 2)) / 2)) / 2) + (1080 * (35/width)),
            }
            ProcessingManager.crop(data.uri, options).then(croppedData => {
                setIsRecording(false);
                setVideoURL(croppedData);
            }).catch(error => {
                console.log('error', error);
                setIsRecording(false);
            })
            // setVideoURL(data.uri);
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
        if(Platform.OS === 'ios') {
            resetStates();
            return;
        }
        
        let fileName = `VID_${(new Date()).getTime()}.mp4`;
        RNFS.copyFile(videoURL, RNFS.ExternalStorageDirectoryPath + '/' + fileName).then(() => {
            Alert.alert("Video Saved", "Video has been saved to " + RNFS.ExternalStorageDirectoryPath + '/' + fileName);
            // setVideoURL("");
            resetStates();
        }, (error) => {
            console.log("CopyFile fail for video: " + error);
            Alert.alert("Error", "Download Failed!");
            // setVideoURL("");
            resetStates();
        });
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
                    defaultVideoQuality={RNCamera.Constants.VideoQuality["1080p"]}
                    onCameraReady={() => setIsCameraReady(true)}
                    onRecordingStart={() => {
                        handleStartRecording();
                    }}
                    onRecordingEnd={() => {
                        handleStopRecording();
                    }}
                >
                    <View style={styles.frameTopLeft} pointerEvents="none"></View>
                    <View style={styles.frameTopRight} pointerEvents="none"></View>
                    <View style={styles.frameBottomLeft} pointerEvents="none"></View>
                    <View style={styles.frameBottomRight} pointerEvents="none"></View>
                    {eyeBorderType === EYE_BORDER_TYPE.RECTANGLE && <View style={styles.eyeBorderRect} pointerEvents="none"></View>}
                    {eyeBorderType === EYE_BORDER_TYPE.OVAL && <View style={styles.eyeBorderOval} pointerEvents="none"></View>}
                    {timer !== "0" && <View style={[styles.timerContainer]} pointerEvents="none"><Text style={styles.timerText}>{timer}</Text></View>}
                    {isRecording && <View style={{ position: "absolute", bottom: 0, width: width, height: 91, backgroundColor: "rgba(9, 48, 76, 0.5)", alignItems: 'center', justifyContent: "space-around" }} pointerEvents="none">
                        <Text style={{ fontWeight: "700", fontSize: 16, color: "#FFFFFF" }}>NO Blink</Text>
                        <Text style={{ fontWeight: "700", fontSize: 16, color: "#FFFFFF" }}>Record for at least 10 seconds</Text>
                    </View>}
                </RNCamera>
            </View>

            {!isRecording && <ScrollView style={{ width: width, height: height - width, paddingHorizontal: 20 }}>
                <View style={{ height: 38 }} />
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: '#282828' }}>1. Find a well-lit environment.</Text>
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: '#282828' }}>2. Position one eye within the circular frame.</Text>
                {/* <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: '#282828' }}>3. Turn your device  horizontally if needed.</Text> */}
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: '#282828' }}>3. Get ready to not blink for 10 seconds.</Text>
                <Text style={{ marginBottom: 0, fontSize: 16, fontWeight: '400', color: '#282828' }}>4. Record the eye for at least 10 seconds.</Text>

                <View style={{ width: width - 40, height: 30, marginTop: 20, marginBottom: 30 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            backgroundColor: "#0E5F8150",
                            width: 200,
                            justifyContent: "space-between",
                            height: 30,
                            alignItems: "center",
                            borderRadius: 10,
                            alignSelf: "center",

                        }}
                    >
                        <CustomTouchableOpacity style={{ backgroundColor: (captureMode === CAPTURE_MODE.AUTO ? "#0E5F81" : "#0E5F8150"), width: 100, height: 30, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, alignItems: "center", justifyContent: "center" }} onPress={() => setCaptureMode(CAPTURE_MODE.AUTO)}>
                            <Text
                                style={{
                                    color: "#FFFFFF",
                                    fontWeight: "700",
                                    fontSize: 17
                                }}
                            >{"Auto"}</Text>
                        </CustomTouchableOpacity>
                        <CustomTouchableOpacity style={{ backgroundColor: (captureMode === CAPTURE_MODE.MANUAL ? "#0E5F81" : "#0E5F8150"), width: 100, height: 30, borderTopRightRadius: 10, borderBottomRightRadius: 10, alignItems: "center", justifyContent: "center" }} onPress={() => setCaptureMode(CAPTURE_MODE.MANUAL)}>
                            <Text
                                style={{
                                    color: "#FFFFFF",
                                    fontWeight: "700",
                                    fontSize: 17
                                }}
                            >{"Manual"}</Text>
                        </CustomTouchableOpacity>
                    </View>
                </View>

                <View style={{ flex: 1, width: width - 40, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }}>
                    <CustomTouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => switchEyeBorderType()}>
                        {eyeBorderType === EYE_BORDER_TYPE.OVAL && <View style={{ width: 30, height: 15, borderWidth: 2, borderColor: "#000000" }}></View>}
                        {eyeBorderType === EYE_BORDER_TYPE.RECTANGLE && <View style={{ width: 15, height: 15, borderRadius: 15 / 2, borderWidth: 2, borderColor: "#000000", transform: [{ scaleX: 2 }] }}></View>}
                    </CustomTouchableOpacity>
                    <CustomTouchableOpacity disabled={processing}
                        style={{ backgroundColor: processing ? "#0E5F8150" : "#0E5F81", borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, paddingHorizontal: 28 }}
                        onPress={onStartRecordingPress}
                    >
                        <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF", textAlign: "center" }}>{"START RECORDING"}</Text>
                    </CustomTouchableOpacity>
                    <CustomTouchableOpacity disabled={processing} style={{ alignItems: "center", justifyContent: "center" }} onPress={() => switchCamera()}>
                        <Ionicons name="camera-reverse-outline" size={25} />
                    </CustomTouchableOpacity>
                </View>
                <View style={{ height: 20 }} />
            </ScrollView>}

            {isRecording && <>
                <View style={{ height: 170, width: width, backgroundColor: '#0E5F81', alignItems: "center" }}>
                    <Text style={{ textAlign: "center", width: width, color: '#FFFFFF', fontSize: 16, fontWeight: "700", marginTop: 14, marginBottom: 20 }}>{duration}</Text>
                    <CustomTouchableOpacity style={{ marginBottom: 20 }} disabled={captureMode === CAPTURE_MODE.AUTO} onPress={() => stopRecordingVideo()}>
                        <View style={{ width: 54, height: 54, borderRadius: 54 / 2, backgroundColor: captureMode === CAPTURE_MODE.AUTO ? "#C9414150" : "#C94141", borderWidth: 5, borderColor: "#FFFFFF" }}></View>
                    </CustomTouchableOpacity>
                </View>
            </>}
        </>);
    }

    const getVideoPlayerComponent = () => {
        return (<>
            <View style={{ height: width, width: width }}>
                <Video
                    source={{ uri: videoURL }}
                    controls={true}
                    style={{ position: 'absolute', top: 15, left: 15, bottom: 0, right: 0 }} />
            </View>
            <View style={{ width: width, justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                <CustomTouchableOpacity disabled={processing}
                    style={{ backgroundColor: "#0E5F81", borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, width: width - 80, paddingHorizontal: 28, marginBottom: 12 }}
                    onPress={onConfirmPress}
                >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF", textAlign: "center" }}>{"CONFIRM"}</Text>
                </CustomTouchableOpacity>
                <CustomTouchableOpacity disabled={processing}
                    style={{ backgroundColor: "#FFFFFF", borderRadius: 10, borderColor: "#0E5F81", borderWidth: 2, alignItems: "center", justifyContent: "center", height: 48, width: width - 80, paddingHorizontal: 28 }}
                    onPress={onRetakePress}
                >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#282828", textAlign: "center" }}>{"RETAKE"}</Text>
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
