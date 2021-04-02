import React from 'react';
import {
    View,
    Text
} from 'react-native';

import { COLORS } from '../../constants/colors';
import styles from './styles'

// const { width, height } = Dimensions.get("window");


const NoEntryCard = ({  }) => {

    return (
        <View
           style={[
               styles.patientCardContainer,
               {
                   height: 140
               }
           ]}
        >
            
        </View>
    );
};

export default NoEntryCard;
