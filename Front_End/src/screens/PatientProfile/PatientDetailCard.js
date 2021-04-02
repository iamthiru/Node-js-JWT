import { useRoute } from '@react-navigation/core';
import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Dimensions,
    Platform,
    StatusBar
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import CustomButton from '../../components/shared/CustomButton';
import { COLORS } from '../../constants/colors';
import { SCREEN_NAMES } from '../../constants/navigation';
import styles from './styles'
import Footer from '../../components/Footer';
import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';

const { width, height } = Dimensions.get("window");


const PatientDetailCard = ({ profile }) => {

    return (
        <View
            style={{
                width: width-60,
                marginHorizontal: 30,
                marginBottom: 20
            }}
        >
            <Text>
                {profile?.name}
            </Text>
            <Text>
                {(new Date().getFullYear()) - (new Date(profile.dob).getFullYear())}
                {" year old, "+ profile.gender}
            </Text>
            <Text>
                {"Medical Number: "+profile.medicalNumber}
            </Text>
            <View
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10
                }}
            >
                <CustomTouchableOpacity>
                    <Text>
                        Edit
                    </Text>
                </CustomTouchableOpacity>
            </View>
        </View>
    );
};

export default PatientDetailCard;
