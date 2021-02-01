import { Platform, ToastAndroid } from "react-native";
import Toast from 'react-native-simple-toast';

export const showToast = (message, duration = Toast.LONG, gravity = Toast.TOP) => {
    const commonToast = Platform.OS === 'android' ? ToastAndroid : Toast;

    commonToast.showWithGravity(message, duration, gravity);
};