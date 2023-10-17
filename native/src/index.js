import { registerRootComponent } from "expo";
import { AppRegistry, Platform } from "react-native";
import App from "../App";
import { name as appName } from "../app.json";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately

// import { registerRootComponent } from 'expo';
// import { View } from 'react-native';
// import App from '../App';

// registerRootComponent(App);
if (Platform.OS == "android") {
  registerRootComponent(App);
} else {
  registerRootComponent(App);

  // AppRegistry.registerComponent(appName, () => App);
}
