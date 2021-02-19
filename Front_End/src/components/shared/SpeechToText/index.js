import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableHighlight,

} from 'react-native';
import Voice from '@react-native-community/voice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { COLORS } from '../../../constants/colors';


const SpeechToText = ({ setPartialResults }) => {

    const [recognitionStarted, setRecognitionStarted] = useState(false);

    useEffect(() => {
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechPartialResults = (e) => {
        setPartialResults(e.value);
    };

    const startRecognizing = async () => {
        await Voice.start('en-Us');
        setPartialResults([]);
        setRecognitionStarted(true);
    };

    const stopRecognizing = async () => {
        await Voice.stop();
        setRecognitionStarted(false);
    };

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Text style={{
                textAlign: 'center',
                marginBottom: 10
            }}>Press and hold the mic to enter notes by voice </Text>
            <TouchableHighlight
                underlayColor={COLORS.SECONDARY_MAIN}
                activeOpacity={0.5}
                onPressIn={startRecognizing}
                onPressOut={stopRecognizing}
                style={{ width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name={"keyboard-voice"} size={40} color={COLORS.PRIMARY_MAIN} />
            </TouchableHighlight>
        </View>
    )
}

export default SpeechToText

