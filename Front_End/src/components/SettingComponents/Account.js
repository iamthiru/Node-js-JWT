import React from 'react';
import {View, Text} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../../constants/colors';
import styles from '../../screens/Settings/styles';
import AccountDetails from './AccountDetails';

const Account = ({data}) => {
  const length = data.length;
  return (
    <View style={styles.settinsView}>
      <View style={styles.item}>
        <FontAwesome5 name={'user'} size={20} color={COLORS.BLACK} />
        <Text style={styles.text}>Account</Text>
      </View>
      <View style={styles.componentView}>
        {data.map((item, index) => {
          return <AccountDetails  key={'index'+index} item={item} length={length} index={index} />;
        })}
      </View>
    </View>
  );
};
export default Account;
