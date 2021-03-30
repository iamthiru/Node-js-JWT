import React, { useState, useEffect } from 'react';
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
    NativeModules
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { RNCamera } from 'react-native-camera';
import Slider from '@react-native-community/slider';
// import { ProcessingManager } from 'react-native-video-processing';
import { RNFFmpeg } from 'react-native-ffmpeg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import CameraRoll from "@react-native-community/cameraroll";
import MovToMp4 from 'react-native-mov-to-mp4';
import Video from 'react-native-video';
import DeviceInfo from 'react-native-device-info';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import styles from './styles';
import { secondsToMinsAndSecs } from '../../utils/date';
import { COLORS } from '../../constants/colors';

import S3 from 'aws-sdk/clients/s3';
import fs, { stat } from 'react-native-fs';
import { decode, encode } from 'base64-arraybuffer';

import { ACCESS_ID, ACCESS_KEY, BUCKET_FOLDER_FOR_PUPIL, BUCKET_FOLDER_FOR_PUPIL_RESULT, BUCKET_NAME } from '../../constants/aws';
import { initiateVideoProcessingAPI } from '../../api/painAssessment';

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

const PupillaryDilationScreen = ({ navigation }) => {

    const [eyeBorderType, setEyeBorderType] = useState(EYE_BORDER_TYPE.OVAL);
    const [showSpinner, setShowSpinner] = useState(false);
    const [spinnerMessage, setSpinnerMessage] = useState("");
    const [selectedSetting, setSelectedSetting] = useState("");
    const [exposure, setExposure] = useState(0);
    const [zoom, setZoom] = useState(Platform.OS === "ios" ? 0.1 : 0.175)
    const [focusDepth, setFocusDepth] = useState(0.3)
    const [timer, setTimer] = useState("0");
    const [duration, setDuration] = useState("00:00");
    const [processing, setProcessing] = useState(false);
    const [captureMode, setCaptureMode] = useState(CAPTURE_MODE.AUTO);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
    const [isRecording, setIsRecording] = useState(false);
    const [videoURL, setVideoURL] = useState("");
    const [resultReady, setResultReady] = useState(false);
    const [showProcessedResult, setShowProcessedResult] = useState(false);
    const [downloadFileName, setDownloadFileName] = useState("");
    const [resultImageURI, setResultImageURI] = useState("");
    const [fps, setFps] = useState(30);

    useEffect(() => {
        setTimeout(() => checkStoragePermission(), 3000);
    }, [])

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

    const toggleSettings = (setting) => {
        setSelectedSetting(setting === selectedSetting ? "" : setting);
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

        const recordOptions = { mute: true, quality: RNCamera.Constants.VideoQuality['1080p'] };
        // const recordOptions = { mute: true, quality: RNCamera.Constants.VideoQuality['1080p'], videoBitrate: 30, codec: RNCamera.Constants.VideoCodec['H264'] };

        camera.recordAsync(recordOptions).then(async (data) => {
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

            /* const deviceModel = await DeviceInfo.getModel();

            let screenWidth = 1080;
            const paddingValue = screenWidth * (60 / width);
            let options = {
                cropWidth: screenWidth,
                cropHeight: parseInt((screenWidth + paddingValue) / 2),
                cropOffsetX: 0,
                cropOffsetY: parseInt((screenWidth - ((screenWidth + paddingValue) / 2)) / 2) + (100) + (deviceModel === "iPhone 7 Plus" ? 195 : 0),
            }

            if (Platform.OS === "ios") {
                options.quality = "1920x1080"
            }

            console.log("screen width: ", screenWidth)
            console.log("cropOptions: ", options); */

            setShowSpinner(true);
            setSpinnerMessage("Cropping...");

            try {
                const videoType = data.uri.substring(data.uri.lastIndexOf(".") + 1, data.uri.length);
                if (videoType.toLowerCase() !== "mp4") {
                    let convertedVideoPath = `${data.uri.substring(0, data.uri.lastIndexOf("."))}_conv.mp4`
                    if(Platform.OS === 'ios'){
                       cropVideo(data.uri, true)
                    } else {
                        RNFFmpeg.execute(`-i ${data.uri} -qscale 0 ${convertedVideoPath}`).then(async res => {
                            console.log("RNFFmpeg Conversion Success")
                            cropVideo(convertedVideoPath)
                        }).catch(err => {
                            console.log("RNFFmpeg Conversion Error")
                            cropVideo(data.uri)
                        })
                    }
                }  else {
                cropVideo(data.uri)
            }
            } catch (error) {
                console.log('error', error);
                setShowSpinner(false);
                setSpinnerMessage("");
                setIsRecording(false);
                setVideoURL(data.uri);
            }
        }).catch(err => {
            setIsRecording(false);
        })
    }

    const cropVideo = async (videoURI, convert) => {
        const deviceModel = await DeviceInfo.getModel();

        let screenWidth = 1080;
        const paddingValue = screenWidth * (60 / width);
        let options = {
            cropWidth: screenWidth,
            cropHeight: parseInt((screenWidth + paddingValue) / 2),
            cropOffsetX: 0,
            cropOffsetY: parseInt((screenWidth - ((screenWidth + paddingValue) / 2)) / 2) + (100) + (deviceModel === "iPhone 7 Plus" ? 195 : 0),
        }

        if (Platform.OS === "ios") {
            options.quality = "1920x1080"
        }

        try {
            let croppedResultPath = `${videoURI.substring(0, videoURI.lastIndexOf("."))}_crop.mp4`;
            const startTime = new Date()
            if(Platform.OS === 'ios'){
                console.log('vedio cropper', VideoCropper)
                VideoCropper.crop(videoURI, options, (error, croppedData) => {
                    if(!error){
                        const endDate = new Date()
                        const time = `${(endDate.getMinutes() - startTime.getMinutes())} : ${endDate.getSeconds() - startTime.getSeconds()}`
                        console.log("RNFFmpeg Crop Success", time);
                        let resultPath = `${croppedData.substring(0, croppedData.lastIndexOf("."))}_2.mp4`
                        RNFFmpeg.execute(`-i ${croppedData} -filter:v fps=30 ${resultPath}`).then(async res => {

                            const filename = `VID_${Date.now().toString()}`;
                            if(convert) {
                                MovToMp4.convertMovToMp4(resultPath, filename)
                                    .then((results) => {
                                        setShowSpinner(false);
                                        setSpinnerMessage("");
                                        setIsRecording(false);
                                        setVideoURL(results);
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                        setShowSpinner(false);
                                        setSpinnerMessage("");
                                        setIsRecording(false);
                                        setVideoURL(resultPath);
                                    })
                            } else {
                                setShowSpinner(false);
                                setSpinnerMessage("");
                                setIsRecording(false);
                                setVideoURL(resultPath);
                            }

                            console.log("RNFFmpeg success", res);
                        }).catch(err => {
                            console.log("RNFFmpeg err", err);
                            setShowSpinner(false);
                            setSpinnerMessage("");
                            setIsRecording(false);
                            setVideoURL(croppedData);
                        })
                    } else {
                        console.log('error', error);
                        setShowSpinner(false);
                        setSpinnerMessage("");
                        setIsRecording(false);
                        setVideoURL(data.uri);
                    }
                })
                return
            }
            // RNFFmpeg.execute(`-i ${videoURI} -filter:v "crop=${options.cropWidth}:${options.cropHeight}:${options.cropOffsetX}:${options.cropOffsetY}" ${croppedResultPath}`).then( async result => {
            RNFFmpeg.execute(`-y -i ${videoURI} -vf "crop=${options.cropWidth}:${options.cropHeight}:${options.cropOffsetX}:${options.cropOffsetY}" -preset ultrafast -c:a copy -strict -2 ${croppedResultPath}`).then( async result => {
                
                const endDate = new Date()
                const time = `${(endDate.getMinutes() - startTime.getMinutes())} : ${endDate.getSeconds() - startTime.getSeconds()}`
                console.log("RNFFmpeg Crop Success", time);

                setSpinnerMessage("Converting FrameRate...");

                let resultPath = `${croppedResultPath.substring(0, croppedResultPath.lastIndexOf("."))}_2.mp4`
                // RNFFmpeg.execute(`-i ${croppedResultPath} -filter:v fps=${fps} ${resultPath}`).then(async res => {
                RNFFmpeg.execute(`-i ${croppedResultPath} -filter:v fps=${fps} ${resultPath}`).then(async res => {
                    console.log("RNFFmpeg fps success", resultPath, time);
                    setShowSpinner(false);
                    setSpinnerMessage("");
                    setIsRecording(false);
                    setVideoURL(resultPath);
                }).catch(err => {
                    console.log("RNFFmpeg fps error", err);
                    setShowSpinner(false);
                    setSpinnerMessage("");
                    setIsRecording(false);
                    setVideoURL(croppedResultPath);
                })
            }).catch(error => {
                console.log("RNFFmpeg Crop Error", error);
                setShowSpinner(false);
                setSpinnerMessage("");
                setIsRecording(false);
                setVideoURL(videoURI);
            })
        } catch (error) {
            console.log('error', error);
            setShowSpinner(false);
            setSpinnerMessage("");
            setIsRecording(false);
            setVideoURL(videoURI);
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

    const onDownloadPress = () => {
        if (false && Platform.OS === "ios") {
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
                // resetStates();
            }).catch(err => {
                Alert.alert("Error", "Download Failed!");
                // resetStates();
            })
        }
    }

    const onUploadPress = async () => {

        setShowSpinner(true);
        setSpinnerMessage("Uploading...");

        try {
            const s3bucket = new S3({
                accessKeyId: ACCESS_ID,
                secretAccessKey: ACCESS_KEY,
                Bucket: BUCKET_NAME,
                signatureVersion: 'v4',
            });

            const filename = `VID_${Date.now().toString()}.mp4`;
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
                    ACL: "public-read"
                };
                s3bucket.upload(params, (err, data) => {
                    if (err) {
                        console.log('error in callback', err);
                        Alert.alert("Error", "Error in uploading the video");
                        setShowSpinner(false);
                        setSpinnerMessage("");
                        resetStates();
                    } else {
                        console.log('success', data);
                        console.log("Respomse URL : " + data.Location);

                        setSpinnerMessage("Processing...");
                        initiateVideoProcessingAPI(filename).then((result) => {
                            console.log("initiateVideoProcessingAPI: ", result);
                            if(result && result.data === "Retake") {
                                Alert.alert("Error", "Please retake the video");
                                setShowSpinner(false);
                                setSpinnerMessage("");
                                resetStates(""); 
                                return;
                            } 
                            setTimeout(() => {
                                let pngFileName = `${filename.substring(0, filename.lastIndexOf("."))}_Dilation_Plot.png`
                                setDownloadFileName(pngFileName);
                                setResultReady(true);
                                setShowSpinner(false);
                                setSpinnerMessage("");
                            }, 100);
                        }).catch(err => {
                            Alert.alert("Error", "Error in processing the video");
                            setShowSpinner(false);
                            setSpinnerMessage("");
                            resetStates("");
                        })
                    }
                });
            });
        } catch (err) {
            Alert.alert("Error", "Error in uploading the video");
            setShowSpinner(false);
            setSpinnerMessage("");
            resetStates();
        }
    }

    const onGetResultPress = () => {

        setShowSpinner(true);
        setSpinnerMessage("Retriving Result...");

        const params = {
            Bucket: BUCKET_NAME,
            Key: `${BUCKET_FOLDER_FOR_PUPIL_RESULT}${downloadFileName}`
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
                Alert.alert("Error", "Error in retriving the result");
                setShowSpinner(false);
                setSpinnerMessage("");
                setResultReady(false);
                setDownloadFileName("");
                resetStates();
            } else {
                let base64Str = encode(data.Body);
                setShowProcessedResult(true);
                setResultImageURI(`data:${data.ContentType};base64,${base64Str}`);
                setShowSpinner(false);
                setSpinnerMessage("");
                setResultReady(false);
                setDownloadFileName("");
                resetStates();
            }
        })
    }

    const onCaptureAgainPress = () => {
        setResultReady(false);
        setDownloadFileName("");
        setShowProcessedResult(false);
        setResultImageURI("");
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
                    autoFocus={Platform.OS === "ios" ? RNCamera.Constants.AutoFocus.off : RNCamera.Constants.AutoFocus.on}
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
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>1. Find a well-lit environment.</Text>
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>2. Position one eye within the circular frame.</Text>
                {/* <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>3. Turn your device  horizontally if needed.</Text> */}
                <Text style={{ marginBottom: 14, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>3. Get ready to not blink for 10 seconds.</Text>
                <Text style={{ marginBottom: 0, fontSize: 16, fontWeight: '400', color: COLORS.GRAY_90 }}>4. Record the eye for at least 10 seconds.</Text>

                <View style={{ width: width - 40, height: 30, marginTop: 20, marginBottom: 30, flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
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

                <View style={{ width: width - 40, height: 30, marginBottom: 30 }}>
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

            {(!isRecording && selectedSetting !== "") && <View style={{ flexDirection: "row", position: "absolute", top: (width - 50 - 25), left: 20, width: width - 40, height: 50, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: `${COLORS.WHITE}70` }}>
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
                    <CustomTouchableOpacity style={{ marginBottom: 20 }} disabled={captureMode === CAPTURE_MODE.AUTO} onPress={() => stopRecordingVideo()}>
                        <View style={{ width: 54, height: 54, borderRadius: 54 / 2, backgroundColor: captureMode === CAPTURE_MODE.AUTO ? "#C9414150" : "#C94141", borderWidth: 5, borderColor: COLORS.WHITE }}></View>
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
                    resizeMode={"contain"}
                    style={{ position: 'absolute', top: 20, left: 20, bottom: 0, right: 0, width: width - 40, height: width - 40 }} />
            </View>
            <View style={{ width: width, justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                {!resultReady && <>
                    <CustomTouchableOpacity disabled={processing}
                    style={{ backgroundColor: COLORS.PRIMARY_MAIN, borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, width: width - 80, paddingHorizontal: 28, marginBottom: 12 }}
                    onPress={onDownloadPress}
                >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.WHITE, textAlign: "center" }}>{"DOWNLOAD"}</Text>
                </CustomTouchableOpacity>
                    <CustomTouchableOpacity disabled={processing}
                        style={{ backgroundColor: COLORS.PRIMARY_MAIN, borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, width: width - 80, paddingHorizontal: 28, marginBottom: 12 }}
                        onPress={onUploadPress}
                    >
                        <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.WHITE, textAlign: "center" }}>{"CONFIRM"}</Text>
                    </CustomTouchableOpacity>
                    <CustomTouchableOpacity disabled={processing}
                        style={{ backgroundColor: COLORS.WHITE, borderRadius: 10, borderColor: COLORS.PRIMARY_MAIN, borderWidth: 2, alignItems: "center", justifyContent: "center", height: 48, width: width - 80, paddingHorizontal: 28 }}
                        onPress={onRetakePress}
                    >
                        <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.GRAY_90, textAlign: "center" }}>{"RETAKE"}</Text>
                    </CustomTouchableOpacity>
                </>}

                {resultReady && <CustomTouchableOpacity disabled={processing}
                    style={{ backgroundColor: COLORS.PRIMARY_MAIN, borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, width: width - 80, paddingHorizontal: 28, marginBottom: 12 }}
                    onPress={onGetResultPress}
                >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.WHITE, textAlign: "center" }}>{"GET RESULT"}</Text>
                </CustomTouchableOpacity>}
            </View>
        </>)
    }

    const getResultScreen = () => {
        return (
            <View style={{ width: width, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
                {resultImageURI !== "" && <Image style={{ width: width - 60, height: width - 60, resizeMode: "contain" }} source={{ uri: resultImageURI }} />}
                <CustomTouchableOpacity disabled={processing}
                    style={{ backgroundColor: COLORS.PRIMARY_MAIN, borderRadius: 10, alignItems: "center", justifyContent: "center", height: 48, width: width - 80, paddingHorizontal: 28, marginBottom: 12, marginTop: 30 }}
                    onPress={onCaptureAgainPress}
                >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.WHITE, textAlign: "center" }}>{"CAPTURE AGAIN"}</Text>
                </CustomTouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.body}>
            {!showProcessedResult && <>
                {videoURL === "" && getCameraComponent()}
                {videoURL !== "" && getVideoPlayerComponent()}
            </>}
            {showProcessedResult && getResultScreen()}
            <Spinner
                visible={showSpinner}
                textContent={spinnerMessage}
                textStyle={{ color: COLORS.WHITE }}
            />
        </View>
    );
};

export default PupillaryDilationScreen;
