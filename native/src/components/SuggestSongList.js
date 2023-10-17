import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useSelector } from "react-redux";
import CardSongSwipeableRow from "./CardSongSwipeableRow";

export default function SuggestSongList() {
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);
  const [data, setData] = useState(suggestSongRedux.suggestSongList);

  useEffect(() => {
    setData(suggestSongRedux.suggestSongList);
  }, [suggestSongRedux.suggestSongList]);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        {/* <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.rowItem,
          ]}
        >
          <Text style={styles.text}>{item.nameSong}</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onLongPress={drag} disabled={isActive}>
          <CardSongSwipeableRow props={item}></CardSongSwipeableRow>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => setData(data)}
      keyExtractor={(item) => item.nameSong}
      renderItem={renderItem}
      style={{ paddingHorizontal: 10 }}
    />
  );
}

const styles = StyleSheet.create({
  rowItem: {
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
