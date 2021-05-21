import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
    View,
    ScrollView,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { updateAuthData } from '../../actions/user';
import AuthContext from '../../components/shared/AuthContext';
import CustomButton from '../../components/shared/CustomButton';
import CustomCheckBox from '../../components/shared/CustomCheckBox';
import CustomTextInput from '../../components/shared/CustomTextInput';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import { COLORS } from '../../constants/colors';
import { SCREEN_NAMES } from '../../constants/navigation';
import styles from './styles';
import { loginAPI } from '../../api/auth';

const { width, height } = Dimensions.get("window");


const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberDevice, setRememberDevice] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const { signIn } = React.useContext(AuthContext);
    
    const handleSignIn = () => {
        setIsLoggingIn(true);
         loginAPI({ email: email, password: password }).then(res => {
             console.log(res);
            if (res.data.isError) {
                Alert.alert("Invalid Login", "Please enter correct username and password", [{ text: "Ok", onPress: () => { } }], { cancelable: false });
                setIsLoggingIn(false);
                return;
            }
            updateAuthData({ 
                authToken: res.data.result.token,
                 userId: res.data.result.id,
                 userName:res.data.result.first_name
                 })
            signIn({ authToken: res.data.result.token, userId: res.data.result.id,userName:res.data.result.first_name });
            setIsLoggingIn(false);
        }).catch(err => {
            console.log(err);
            Alert.alert("Invalid Login", "Please enter correct username and password", [{ text: "Ok", onPress: () => { } }], { cancelable: false });
            setIsLoggingIn(false);
        }) 

    }

    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);

    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={{ height: height, width: width, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 48, lineHeight: 58, fontWeight: "700", textAlign: "center", color: COLORS.PRIMARY_MAIN, paddingBottom: 16 }}>IMPACT</Text>
                    <Text style={{ fontSize: 24, lineHeight: 29, textAlign: "center", color: COLORS.PRIMARY_DARKER, paddingBottom: 50 }}>Login</Text>

                    <CustomTextInput placeholder="Enter Your Work Email" value={email} onChangeText={value => setEmail(value)} inputStyle={{ width: width - 60 }} />
                    <CustomTextInput placeholder="Password" value={password} secureTextEntry={true} onChangeText={value => setPassword(value)} containerStyle={{ paddingBottom: 0 }} inputStyle={{ width: width - 60 }} />
                    <CustomCheckBox
                        label={"Remember this device"}
                        value={rememberDevice}
                        onValueChange={value => setRememberDevice(value)}
                        containerStyle={{ flexDirection: "row", width: width, marginTop: 21, marginBottom: 28, paddingHorizontal: 30 }} />

                    <CustomButton
                        disabled={email.trim() === "" || password.trim() == "" || isLoggingIn}
                        title="Login"
                        style={{
                            ...{
                                paddingHorizontal: 50,
                                backgroundColor: (email.trim() === "" || password.trim() == "" || isLoggingIn) ? `${COLORS.PRIMARY_MAIN}50` : COLORS.PRIMARY_MAIN
                            }, 
                            ...(email.trim() === "" || password.trim() == "" || isLoggingIn) ? { elevation: 0 } : {}
                        }}
                        onPress={() => handleSignIn()}
                    />

                    <CustomTouchableOpacity style={{ marginTop: 21 }}>
                        <Text style={{ fontSize: 14, lineHeight: 20, textAlign: 'center', color: COLORS.GRAY_90 }}>Forgot Password?</Text>
                    </CustomTouchableOpacity>
                </View>
            </ScrollView>
            <Spinner
                visible={isLoggingIn}
                textContent={'Logging In...'}
                textStyle={{ color: COLORS.WHITE }}
            />
        </KeyboardAvoidingView>

    );
};

const mapDispatchToProps = (dispatch) => ({
    updateAuthData: (data) => dispatch(updateAuthData(data))
});

export default connect(null, mapDispatchToProps)(LoginScreen);
