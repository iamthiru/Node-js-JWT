import React from 'react';
import {View, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS} from '../../constants/colors';
import OthersDetails from './OthersDetails';
import styles from '../../screens/Settings/styles';

const Others = ({data}) => {
  const length = data.length;

  return (
    <View style={styles.settinsView}>
      <View style={styles.item}>
        <Feather name={'bell'} size={20} color={COLORS.BLACK} />
        <Text style={styles.text}>Others</Text>
      </View>
      <View style={styles.componentView}>
        {data.map((item, index) => {
          return (
            <OthersDetails
              key={'index' + index}
              item={item}
              length={length}
              index={index}
            />
          );
        })}
      </View>
    </View>
  );
};
export default Others;
