import React from 'react';
import {
    Text,
    View
} from 'react-native';
import styles from './styles';

const SplashScreen = (props) => {
    return (
        <View style={styles.slide}>
            <Text style={styles.header}>IMPACT</Text>
        </View>
    );
}

export default SplashScreen;

