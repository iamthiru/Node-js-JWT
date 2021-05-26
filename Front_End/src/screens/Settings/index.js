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
import AuthContext from '../../components/shared/AuthContext';
import { APP_VERSION } from '../../constants';

const Settings = ({navigation}) => {
  const { signOut } = React.useContext(AuthContext);

  const handleLogout = () => {
    signOut()
  }

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
            onPress={() => handleLogout()}
            title="Logout"
            type="tertiary"
            textStyle={styles.logoutTextStyle}
            style={{
              backgroundColor: COLORS.WHITE,
            }}
          />
          <Text style={{ fontSize: 12, textAlign: "center", color: COLORS.PRIMARY_DARKER, paddingTop: 10 }}>{APP_VERSION}</Text>
        </View>
        
      </View>
      <Footer marginBottom={-5} />
    </SafeAreaView>
  );
};

export default Settings;
