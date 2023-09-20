import React, { useEffect } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { continuePlaySound, pauseSound, playSound } from "../common/appSong";
import { TYPE_ACTION } from "../common/typeAction";
import { continuePlaySong, pauseSong } from "../redux/playSongSlice";

export default function Song() {
  const playSongStore = useSelector((state) => state.playSong);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  useEffect(() => {
    if (playSongStore.playing) {
      if (playSongStore.typeAction === TYPE_ACTION.CHANGE) {
        playSound({ uri: playSongStore.linkSong });
      } else if (playSongStore.typeAction === TYPE_ACTION.CONTINUE) {
        continuePlaySound();
      }
    } else {
      pauseSound();
    }
  }, [playSongStore]);

  return <></>;
}
