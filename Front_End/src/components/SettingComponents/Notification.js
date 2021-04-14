import React from 'react';
import {View, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS} from '../../constants/colors';
import NotificationDetails from './NotificationDetails';
import styles from '../../screens/Settings/styles';

const Notification = ({data}) => {
  const length = data.length;
  return (
    <View style={styles.settinsView}>
      <View style={styles.item}>
        <Feather name={'bell'} size={20} color={COLORS.BLACK} />
        <Text style={styles.text}>Notification</Text>
      </View>
      <View style={styles.componentView}>
        {data.map((item, index) => {
          return (
            <NotificationDetails
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
export default Notification;
