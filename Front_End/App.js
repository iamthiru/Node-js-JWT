/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './src/store';
import PupillaryDilationScreen from './src/screens/PupillaryDilationScreen';
import { SCREEN_NAMES } from './src/constants/navigation';
import HomeScreen from './src/screens/HomeScreen';
import FacialExpressionScreen from './src/screens/FacialExpressionScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={SCREEN_NAMES.LOGIN}
            screenOptions={({ navigation, route }) => ({
              headerTitleContainerStyle: { alignItems: "center" },
              animationEnabled: false,
              headerBackTitleVisible: false,
              headerStyle: { backgroundColor: '#0E5F81', borderBottomWidth: 2, borderBottomColor: '#94C24D' },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: { fontWeight: '700', fontSize: 20, color: '#FFFFFF' },
            })}
          >
            <Stack.Screen
              name={SCREEN_NAMES.LOGIN}
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={SCREEN_NAMES.HOME}
              component={HomeScreen}
              options={{ title: "Home" }}
            />
            <Stack.Screen
              name={SCREEN_NAMES.PUPILLARY_DILATION}
              component={PupillaryDilationScreen}
              options={{ title: "Pupillary Dilation" }}
            />
            <Stack.Screen
              name={SCREEN_NAMES.FACIAL_EXPRESSION}
              component={FacialExpressionScreen}
              options={{ title: "Facial Expression" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
