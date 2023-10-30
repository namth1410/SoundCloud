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
import Author from "./src/screens/Author";
import Feed from "./src/screens/Feed";
import History from "./src/screens/History";
import Home from "./src/screens/Home";
import ManageStorage from "./src/screens/ManageStorage";
import Playlist from "./src/screens/Playlist";
import PlaylistDetail from "./src/screens/PlaylistDetail";
import Search from "./src/screens/Search";
import SignIn from "./src/screens/SignIn";
import SignUp from "./src/screens/SignUp";
import SongAuthor from "./src/screens/SongAuthor";
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
      <Stack.Screen name="Author" component={Author} />
      <Stack.Screen name="SongAuthor" component={SongAuthor} />

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

function HomeCombine() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Author" component={Author} />
      <Stack.Screen name="SongAuthor" component={SongAuthor} />
    </Stack.Navigator>
  );
}

function FeedCombine() {
  return (
    <Stack.Navigator
      initialRouteName="Feed"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Feed" component={Feed} />
    </Stack.Navigator>
  );
}

function SearchCombine() {
  return (
    <Stack.Navigator
      initialRouteName="Search"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Search" component={Search} />
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

            if (route.name === "Nhà") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "FeedCombine") {
              iconName = focused ? "ios-list" : "ios-list-outline";
            } else if (route.name === "Tìm kiếm") {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === "Cá nhân") {
              iconName = focused ? "person-circle" : "person-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen name="Nhà" component={HomeCombine} />
        <Tab.Screen name="FeedCombine" component={FeedCombine} />
        <Tab.Screen name="Tìm kiếm" component={SearchCombine} />
        <Tab.Screen name="Cá nhân" component={UserCombine} />
      </Tab.Navigator>

      {playSongStore.infoSong.nameSong ? <ControlSong></ControlSong> : <></>}
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
