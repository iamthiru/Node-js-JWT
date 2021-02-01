/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { typography } from './src/components/shared/typography';

typography();

AppRegistry.registerComponent(appName, () => App);
