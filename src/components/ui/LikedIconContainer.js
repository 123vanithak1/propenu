import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

const LikedIconContainer = () => {
  const [liked, setLiked] = useState(false);

  return (
    <Pressable
      onPress={() => setLiked(!liked)}
      hitSlop={6}
      style={({ pressed }) => [
        styles.container,
        liked && styles.likedContainer,
        pressed && styles.pressed,
      ]}
    >
      <Entypo name="heart" size={22} color={liked ? "#DD3355" : "#575555ff"} />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "rgba(241, 237, 237, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },

  likedContainer: {
    backgroundColor: "rgba(241, 237, 237, 0.85)",
  },

  pressed: {
    opacity: 0.7,
  },
});
export default LikedIconContainer;
