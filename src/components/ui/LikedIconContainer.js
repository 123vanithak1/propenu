import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { userServices } from "../../services/userServices";
import { useAuth } from "../../context/AuthContext";
import { ToastSuccess } from "../../utils/Toast";
import { useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

const LikedIconContainer = ({ slug, id, type }) => {
  const [liked, setLiked] = useState(false);
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  let route;
  try {
    route = useRoute();
  } catch (e) {
    route = null;
  }
  const isDelete = route?.name === "ShortListedProperties" || route?.name === "ShortListed";

  useEffect(() => {
    checkInitialStatus();
  }, [slug]);

  const checkInitialStatus = async () => {
    try {
      const res = await userServices.getShortlistedProperties();

      const exists = res?.data?.some((item) => item?.property?.slug === slug);
      setLiked(exists);
    } catch (error) {
      console.log("Error fetching shortlist:", error);
    }
  };

  const postShortlisted = async () => {
    const payload = {
      propertyId: id,
      propertyType: type,
    };

    return await userServices.postShortlistedProperties(payload);
  };

  const deleteShortlisted = async () => {
    return await userServices.deleteShortlistedProperty(id);
  };

  const handleToggle = async () => {
    if (!isLoggedIn) return;

    const previous = liked;

    try {
      setLiked(!previous);

      let res;

      if (previous) {
        res = await deleteShortlisted();
      } else {
        res = await postShortlisted();
      }

      if (res?.success) {
        ToastSuccess(
          previous ? "Property removed from shortlist" : "Property shortlisted",
        );
        queryClient.invalidateQueries({ queryKey: ["shortlistedProperties"] });
      } else {
        setLiked(previous);
      }
    } catch (error) {
      console.log("Shortlist error:", error);
      setLiked(previous);
    }
  };

  return (
    <Pressable
      onPress={handleToggle}
      hitSlop={6}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {isDelete ? (
        <Entypo name="trash" size={16} color="#DD3355" />
      ) : (
        <Entypo name="heart" size={18} color={liked ? "#DD3355" : "#575555"} />
      )}
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
