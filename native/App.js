import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MenuProvider } from "react-native-popup-menu";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Provider, useSelector } from "react-redux";
import { AudioProvider } from "./src/common/AudioProvider";
import ControlSong from "./src/components/ControlSong";
import ModalSongV3 from "./src/components/ModalSongV3";
import { store } from "./src/redux/store";
import Feed from "./src/screens/Feed";
import History from "./src/screens/History";
import Home from "./src/screens/Home";
import ManageStorage from "./src/screens/ManageStorage";
import Playlist from "./src/screens/Playlist";
import PlaylistDetail from "./src/screens/PlaylistDetail";
import Search from "./src/screens/Search";
import SignIn from "./src/screens/SignIn";
import SignUp from "./src/screens/SignUp";
import Suggest from "./src/screens/Suggest";
import UploadFromUser from "./src/screens/UploadFromUser";
import User from "./src/screens/User";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function UserCombine() {
  return (
    <Stack.Navigator
      initialRouteName="User"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="UploadFromUser" component={UploadFromUser} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="ManageStorage" component={ManageStorage} />
      <Stack.Screen name="Playlist" component={Playlist} />
      <Stack.Screen
        options={{
          presentation: "modal",
          animationTypeForReplace: "pop",
          animation: "fade",
        }}
        name="PlaylistDetail"
        component={PlaylistDetail}
      />
    </Stack.Navigator>
  );
}

function Main() {
  const playSongStore = useSelector((state) => state.playSongRedux);
  return (
    <MenuProvider
      customStyles={{
        backdrop: {
          backdrop: {
            backgroundColor: "red",
            opacity: 0.5,
          },
        },
      }}
    >
      <AudioProvider>
        <Stack.Navigator
          initialRouteName="SoundCloudTabs"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SoundCloudTabs" component={SoundCloudTabs} />
          <Stack.Screen
            options={{
              presentation: "modal",
              animationTypeForReplace: "pop",
              animation: "fade_from_bottom",
            }}
            name="Suggest"
            component={Suggest}
          />
          <Stack.Screen
            options={{
              presentation: "modal",
              animationTypeForReplace: "push",
              animation: "slide_from_bottom",
            }}
            name="ModalSongV3"
            component={ModalSongV3}
          />
          <Stack.Screen name="UploadFromUser" component={UploadFromUser} />
        </Stack.Navigator>
      </AudioProvider>
    </MenuProvider>
  );
}

function SoundCloudTabs() {
  const playSongStore = useSelector((state) => state.playSongRedux);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={true}></StatusBar>
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
            } else if (route.name === "UserCombine") {
              iconName = focused ? "person-circle" : "person-circle-outline";
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
        <Tab.Screen name="UserCombine" component={UserCombine} />
      </Tab.Navigator>
      {/* <Song></Song> */}
      {/**

        */}
      {playSongStore.nameSong ? <ControlSong></ControlSong> : <></>}
      {/* {false ? <ControlSong></ControlSong> : <></>} */}
    </SafeAreaView>
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="SignIn"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Main" component={Main} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}
