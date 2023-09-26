import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Provider, useSelector } from "react-redux";
import ControlSong from "./src/components/ControlSong";
import { store } from "./src/redux/store";
import Feed from "./src/screens/Feed";
import Home from "./src/screens/Home";
import Library from "./src/screens/Library";
import Search from "./src/screens/Search";
import SignIn from "./src/screens/SignIn";
import SignUp from "./src/screens/SignUp";
import DetailSong from "./src/screens/DetailSong";
import ModalSong from "./src/components/ModalSong";
import Song from "./src/components/Song";
import { AudioProvider } from "./src/common/AudioProvider";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabStack(component, name) {
  return (
    <Stack.Navigator
      initialRouteName={name}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={name} component={component} />
      {/* Thêm các màn hình khác của tab Home vào đây nếu cần */}
    </Stack.Navigator>
  );
}

function SoundCloudTabs() {
  const playSongStore = useSelector((state) => state.playSong);
  const modal = useSelector((state) => state.modal);
  return (
    <AudioProvider>
      <StatusBar translucent={true}></StatusBar>
      <SafeAreaView style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Feed") {
                iconName = focused ? "ios-list" : "ios-list-outline";
              } else if (route.name === "Search") {
                iconName = focused ? "search" : "search-outline";
              } else if (route.name === "Library") {
                iconName = focused ? "library" : "library-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Feed" component={Feed} />
          <Tab.Screen name="Search" component={Search} />
          <Tab.Screen name="Library" component={Library} />
          <Tab.Screen name="DetailSong" component={DetailSong} />
        </Tab.Navigator>
        <Song></Song>
        {playSongStore.nameSong && !modal.display ? (
          <ControlSong></ControlSong>
        ) : (
          <></>
        )}
        {/* {false ? <ControlSong></ControlSong> : <></>} */}
        {modal.display ? <ModalSong></ModalSong> : <></>}
      </SafeAreaView>
    </AudioProvider>
  );
}

export default function App() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tinyLogo: {
      width: 50,
      height: 50,
    },
    logo: {
      width: 66,
      height: 58,
    },
  });

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignIn"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SoundCloudTabs" component={SoundCloudTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
