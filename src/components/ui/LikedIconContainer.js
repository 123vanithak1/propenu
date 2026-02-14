import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { userServices } from "../../services/userServices";
import { useAuth } from "../../context/AuthContext";
import { ToastSuccess } from "../../utils/Toast";

const LikedIconContainer = ({ id, type }) => {
  const [liked, setLiked] = useState(false);
  const { isLoggedIn, userDetails } = useAuth();

  // ✅ get initial liked state when card loads
  useEffect(() => {
    checkInitialStatus();
  }, [id]);

  const checkInitialStatus = async () => {
    try {
      const res = await userServices.getShortlistedProperties();
      const exists = res?.data?.some((item) => item._id === id);
      setLiked(exists);
    } catch (error) {
      console.log("Error fetching shortlist:", error);
    }
  };

  const PostShortlisted = async () => {
    const payload = {
      userId: userDetails.id,
      propertyId: id,
      propertyType: type,
    };

    return await userServices.postShortlistedProperties(payload);
  };

  // ✅ MAIN LOGIC
  const handleToggle = async () => {
    if (!isLoggedIn) return;

    try {
      const previous = liked;

      // optimistic
      setLiked(!previous);

      const res = await PostShortlisted();

      if (res?.success) {
        console.log("res:", res)
        ToastSuccess(
          previous ? "Property removed from shortlist" : "Property shortlisted",
        );
      } else {
        // rollback
        setLiked(previous);
      }
    } catch (error) {
      setLiked((prev) => !prev);
      console.log(error);
    }
  };

  return (
    <Pressable
      onPress={handleToggle}
      hitSlop={6}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Entypo name="heart" size={18} color={liked ? "#DD3355" : "#575555"} />
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
  pressed: {
    opacity: 0.7,
  },
});

export default LikedIconContainer;
