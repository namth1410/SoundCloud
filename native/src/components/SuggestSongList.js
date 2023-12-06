import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { useSelector, useDispatch } from "react-redux";
import CardSongSwipeableRow from "./CardSongSwipeableRow";
import { updateDataSuggestSongList } from "../redux/suggestSongSlice";

export default function SuggestSongList() {
  const dispatch = useDispatch();
  const suggestSongRedux = useSelector((state) => state.suggestSongRedux);
  const [data, setData] = useState(suggestSongRedux.suggestSongList);

  useEffect(() => {
    setData(suggestSongRedux.suggestSongList);
  }, [suggestSongRedux.suggestSongList]);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity onLongPress={drag} disabled={isActive}>
          <CardSongSwipeableRow props={item}></CardSongSwipeableRow>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={({ data }) => {
        dispatch(updateDataSuggestSongList(data));
      }}
      keyExtractor={(item) => item.nameSong}
      renderItem={renderItem}
      style={{ paddingHorizontal: 10, marginVertical: 5 }}
    />
  );
}
