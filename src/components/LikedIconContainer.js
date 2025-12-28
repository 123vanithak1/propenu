import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

const LikedIconContainer = () => {
  const [liked, setLiked] = useState(false);

  return (
    <Pressable
      onPress={() => setLiked(!liked)}
      style={({ pressed }) => [
        styles.container,
        liked && styles.likedContainer,
        pressed && styles.pressed,
      ]}
    >
      <Entypo name="heart" size={22 } color={liked ? "#2ecc71" : "#575555ff"}  />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(241, 237, 237, 0.85)",

    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },

  likedContainer: {
    backgroundColor: "rgba(241, 237, 237, 0.85)",
  },

  pressed: {
    opacity: 0.7,
  },
});

export default LikedIconContainer;
