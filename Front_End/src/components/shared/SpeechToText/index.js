import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Voice from '@react-native-community/voice';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../../constants/colors';

const SpeechToText = ({setPartialResults}) => {
  const [startRecording, setStartRecording] = useState(false);

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
  };

  const stopRecognizing = async () => {
    await Voice.stop();
  };

  const handleVoiceRecord = (start = false) => {
    if (start) {
      startRecognizing();
    } else {
      stopRecognizing();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginBottom: 10,
        }}>
        Press and hold the mic to enter notes by voice{' '}
      </Text>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          setStartRecording((value) => {
            handleVoiceRecord(!value);
            return !value;
          });
        }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Boolean(startRecording)
            ? COLORS.SECONDARY_MAIN
            : COLORS.WHITE,
        }}>
        <MaterialIcons
          name={'keyboard-voice'}
          size={40}
          color={COLORS.PRIMARY_MAIN}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SpeechToText;
