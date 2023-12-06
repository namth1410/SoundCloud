import React from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Touchable,
} from "react-native";
import CardSong from "./CardSong";

export default function Group({ props }) {
  const { title, data, type } = props;

  const CardAuthor = (item) => {
    return (
      <TouchableOpacity>
        <View>
          <Image
            style={{
              resizeMode: "contain",
              width: 120,
              height: 120,
              borderRadius: 500,
              zIndex: 2,
            }}
            src={item.img ?? require("../../assets/musique.jpg")}
          />
          <View style={{ alignItems: "center", marginTop: 10, width: 120 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: "white", fontWeight: "bold", fontSize: 12 }}
            >
              {item.nameAuthor}
            </Text>

            <TouchableOpacity
              style={{
                width: "70%",
                height: 30,
                backgroundColor: "white",
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 13 }}>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontWeight: "700",
          fontSize: 20,
          marginBottom: 15,
          paddingLeft: 12,
          color: "white",
        }}
      >
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        nestedScrollEnabled={true}
        
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 15,
            paddingLeft: 12,
          }}
        >
          {data.map((item, index) =>
            type === "song" ? (
              <CardSong key={index} props={item}></CardSong>
            ) : type === "author" ? (
              <CardAuthor key={index} {...item}></CardAuthor>
            ) : (
              <></>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}
