import React from 'react';
import {
    View,
    Text
} from 'react-native';

import { COLORS } from '../../constants/colors';
import styles from './styles'

// const { width, height } = Dimensions.get("window");


const LatestEntryCard = ({  }) => {

    return (
        <View
           style={[
               styles.patientCardContainer,
               {
                   height: 220
               }
           ]}
        >
            
        </View>
    );
};

export default LatestEntryCard;
