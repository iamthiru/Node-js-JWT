import React, { useState } from 'react';
import {View, Text, useWindowDimensions} from 'react-native';
import {COLORS} from '../../constants/colors';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import assignPatientStyles from '../../screens/AssignPatient/styles';
import CustomTouchableOpacity from '../shared/CustomTouchableOpacity';
import {useNavigation} from '@react-navigation/native';
import { SCREEN_NAMES } from '../../constants/navigation';


const Section = ({props,setShowPatient,painAssessment,setPatientData}) => {
  const {width, height} = useWindowDimensions();
  const [patientModalOpen,setPatientModalOpen] = useState(false)
  const styles = assignPatientStyles({width, height, COLORS});
  const navigation = useNavigation()
  const lastIndex = props.index === props.section.data.length - 1

  return (
    <CustomTouchableOpacity onPress ={()=>{
      if(painAssessment){
      setShowPatient(true)
      setPatientData(props?.item)
      }
      else{
      navigation.navigate(SCREEN_NAMES.PATIENT_PROFILE,props.item)
    }
    }}>

    <View style={[styles.sectionMainView, {
      marginBottom:lastIndex ? 20 : 0
    }]}>
      <Text style={styles.name}>{props.item?.firstName+" "+ props?.item?.lastName}</Text>
      <AntDesignIcon
        name={'arrowright'}
        color={COLORS.GRAY_90}
        style={{
          fontSize:10
        }}
        />
    </View>
        </CustomTouchableOpacity>
        
  );
};
export default Section;
