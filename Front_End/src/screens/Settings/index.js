import { useRoute } from '@react-navigation/core';
import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Dimensions
} from 'react-native';
import Footer from '../../components/Footer';

const { width, height } = Dimensions.get("window");


const Settings = ({ navigation }) => {

    return (
            <View
                style={{
                    flex: 1,
                    width: width,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
               <View
                style={{
                    flex: 1
                }}
               >
               <Text>
                    Settings
                </Text>
                <Text>
                    Welcome,
                </Text>
                <Text>
                </Text>
               </View>
                <Footer
                />
            </View>
    );
};

export default Settings;
