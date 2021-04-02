import { useNavigation } from '@react-navigation/core';
import React from 'react'
import {
    View,
    Text
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import CustomTouchableOpacity from '../../components/shared/CustomTouchableOpacity';
import { COLORS } from '../../constants/colors';
import { SCREEN_NAMES } from '../../constants/navigation';
import styles from './styles';
// import { View } from 'react-native'

const PatientListItem = ({
    item
}) => {
    const navigation = useNavigation()

    return (
        <CustomTouchableOpacity
            style={styles.patientItemContainer}
            onPress={() => {
                navigation.navigate(SCREEN_NAMES.PATIENT_PROFILE, {
                    item: {
                        ...item
                    }
                })
            }}
        >
            <Text
                style={[styles.h2Label, {
                    width: undefined
                }]}
            >
                {item?.name}
            </Text>
            <View
                style={{
                    flexDirection: 'row'
                }}
            >
                <Text
                    style={[styles.h3Label,
                    {
                        width: undefined
                    }
                    ]}
                >
                    {item?.time}
                </Text>
                <AntDesignIcon name={"arrowright"} size={20} color={COLORS.GRAY_90}/>
            </View>
        </CustomTouchableOpacity>
    )
}

export default PatientListItem;
