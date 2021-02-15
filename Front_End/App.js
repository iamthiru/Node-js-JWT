/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useReducer, useMemo, useState, useEffect } from 'react';
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
import STORAGE_KEYS from './src/constants/storage';
import { AUTH_ACTIONS } from './src/constants/actions';
import asyncStorage from './src/utils/asyncStorage';
import { updateAuthData } from './src/actions/user';
import AuthContext from './src/components/shared/AuthContext';
import SplashScreen from './src/screens/SplashScreen';
import PainAssessmentScreen from './src/screens/PainAssessmentScreen';
import { COLORS } from './src/constants/colors';

const Stack = createStackNavigator();

const initialState = {
  isLoading: true,
  isSignout: false,
  authToken: null,
  showOnboarding: false
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.RESTORE_TOKEN:
      return {
        ...prevState,
        authToken: action.token,
        userId: action.userId,
        isLoading: false,
        showOnboarding: false
      };
    case AUTH_ACTIONS.SIGN_IN:
      return {
        ...prevState,
        isSignout: false,
        authToken: action.token,
        userId: action.userId,
        showOnboarding: false
      };
    case AUTH_ACTIONS.SIGN_OUT:
      return {
        ...prevState,
        isSignout: true,
        authToken: null,
        userId: null,
        showOnboarding: false
      };
    case AUTH_ACTIONS.SKIP_ONBOARDING:
      return {
        ...prevState,
        isLoading: false,
        showOnboarding: false
      };
    case AUTH_ACTIONS.SHOW_ONBOARDING:
      return {
        ...prevState,
        isLoading: false,
        showOnboarding: true
      }
  }
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {

    const checkToShowOnBoarding = () => {
      asyncStorage.getItem(STORAGE_KEYS.HAS_LOGGED_IN_BEFORE)
        .then((result) => {
          if (result) {
            dispatch({ type: AUTH_ACTIONS.SKIP_ONBOARDING })
          }
          else {
            dispatch({ type: AUTH_ACTIONS.SHOW_ONBOARDING })
          }
        }).catch(error => {
          dispatch({ type: AUTH_ACTIONS.SHOW_ONBOARDING })
        })
    }

    const checkForUserToken = () => {
      asyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        .then((result) => {
          if (result) {
            let token = result;
            asyncStorage.getItem(STORAGE_KEYS.USER_ID).then((res) => {
              let userId = res;
              dispatch({ type: AUTH_ACTIONS.RESTORE_TOKEN, token: token, userId: userId });
              store.dispatch(updateAuthData({ authToken: token, userId: userId }));
            }).catch(err => {
              dispatch({ type: AUTH_ACTIONS.SKIP_ONBOARDING });
            })
          } else {
            dispatch({ type: AUTH_ACTIONS.SKIP_ONBOARDING });
          }
        }).catch(error => { 
          dispatch({ type: AUTH_ACTIONS.SKIP_ONBOARDING });
        })
    }

    checkForUserToken();

  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        asyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.authToken)
          .then((res) => {
            asyncStorage.setItem(STORAGE_KEYS.USER_ID, data.userId)
              .then((res) => {
                asyncStorage.setItem(STORAGE_KEYS.HAS_LOGGED_IN_BEFORE, 'true')
                  .then((res) => {
                    dispatch({ type: AUTH_ACTIONS.SIGN_IN, token: data.authToken, userId: data.userId });
                  }).catch(err => {

                  })
              }).catch(err => {

              })
          }).catch(err => {

          })
      },
      signOut: () => {
        asyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_ID]);
        dispatch({ type: AUTH_ACTIONS.SIGN_OUT })
      },
      signUp: async data => {
        asyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.authToken)
          .then((res) => {
            asyncStorage.setItem(STORAGE_KEYS.USER_ID, data.userId)
              .then((res) => {
                asyncStorage.setItem(STORAGE_KEYS.HAS_LOGGED_IN_BEFORE, 'true')
                  .then((res) => {
                    dispatch({ type: AUTH_ACTIONS.SIGN_IN, token: data.authToken, userId: data.userId });
                  }).catch(err => {

                  })
              }).catch(err => {

              })
          }).catch(err => {

          })
      },
    }), []);

  return (
    <Provider store={store}>
      <AuthContext.Provider value={authContext}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={SCREEN_NAMES.LOGIN}
              screenOptions={({ navigation, route }) => ({
                headerTitleContainerStyle: { alignItems: "center" },
                animationEnabled: false,
                headerBackTitleVisible: false,
                headerStyle: { backgroundColor: COLORS.PRIMARY_MAIN, borderBottomWidth: 2, borderBottomColor: COLORS.SECONDARY_DARKER },
                headerTintColor: COLORS.WHITE,
                headerTitleStyle: { fontWeight: '700', fontSize: 20, color: COLORS.WHITE },
              })}
            >
              {state.isLoading && <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }} />}
              {(!state.isLoading && state.authToken === null) ? (<>
                <Stack.Screen
                  name={SCREEN_NAMES.LOGIN}
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
              </>) : (<>
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
                <Stack.Screen
                  name={SCREEN_NAMES.PAIN_ASSESSMENT}
                  component={PainAssessmentScreen}
                  options={{ headerShown: false }}
                />
              </>)}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthContext.Provider>
    </Provider>
  );
};

export default App;
