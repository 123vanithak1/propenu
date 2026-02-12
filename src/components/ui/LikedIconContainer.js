import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { userServices } from "../../services/userServices";
import * as Keychain from "react-native-keychain";
import { useAuth } from "../../context/AuthContext";
import { ToastSuccess } from "../../utils/Toast";

const LikedIconContainer = ({ id, type }) => {
  const [liked, setLiked] = useState(false);
  const { isLoggedIn, userDetails } = useAuth();

  const GetShortlistedProperties = async () => {
    try {
      const response = await userServices.getShortlistedProperties();

      if (response?.success) {
        const isShortlisted = response?.data?.some((item) => {
          (console.log("IIIIIIIIIIIIIIDDDDDDDDDDDDDDDDDDDDDDD", item._id),
            item._id === id);
        });
        console.log(isShortlisted, response, "shortlisted@@@@@@@@@@");
        ToastSuccess(
          response?.data?.message || "Property removed from shortlisted",
        );
      }
    } catch (error) {
      console.log("Error when shortlist the property:", error);
    }
  };
  const PostShortlisted = async () => {
    if (isLoggedIn) {
      let payload = {
        userId: userDetails.id,
        propertyId: id,
        propertyType: type,
      };
      try {
        const response = await userServices.postShortlistedProperties(payload);
        // console.log(response, "post shortlistedddddddddddddd");
        if (response.success) {
          ToastSuccess(response.message || "Property shortlisted successfully");
        }
      } catch (error) {
        console.log("Error when shortlist the property:", error);
      }
    }
  };

  const handleToggle = async () => {
    try {
      setLiked((prev) => !prev);
      console.log(id, liked, "OO");

      if (liked) {
        console.log("Removed>>>>>>>>>");
        GetShortlistedProperties();
      } else {
        console.log("Posted>>>>>>>>>");
        PostShortlisted();
      }
    } catch (error) {
      setLiked((prev) => !prev);
      console.log("Error updating shortlist:", error);
    }
  };
  return (
    <Pressable
      onPress={handleToggle}
      hitSlop={6}
      style={({ pressed }) => [
        styles.container,
        liked && styles.likedContainer,
        pressed && styles.pressed,
      ]}
    >
      <Entypo name="heart" size={18} color={liked ? "#DD3355" : "#575555ff"} />
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 4,
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
