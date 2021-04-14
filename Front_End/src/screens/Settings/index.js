import React from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import Footer from '../../components/Footer';
import {COLORS} from '../../constants/colors';
import Account from '../../components/SettingComponents/Account';
import Notification from '../../components/SettingComponents/Notification';
import Others from '../../components/SettingComponents/Others';
import CustomButton from '../../components/shared/CustomButton';
import {
  ACCOUNT_DATA,
  NOTIFICATIONS_DATA,
  OTHER_DATA,
} from '../../constants/settingsConstants';
import styles from './styles';

const Settings = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.mainView}>
        <Text style={styles.labelStyle}>Settings</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 40,
          }}>
          <Account data={ACCOUNT_DATA} />
          <Notification data={NOTIFICATIONS_DATA} />
          <Others data={OTHER_DATA} />
        </ScrollView>
        <View style={styles.btnView}>
          <CustomButton
            onPress={() => {}}
            title="Logout"
            type="tertiary"
            textStyle={styles.textStyle}
            style={{
              backgroundColor: COLORS.WHITE,
            }}
          />
        </View>
      </View>
      <Footer marginBottom={-5} />
    </SafeAreaView>
  );
};

export default Settings;
