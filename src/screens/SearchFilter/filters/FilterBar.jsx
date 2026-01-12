import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../redux/store/store";
import { useNavigation } from "@react-navigation/native";
import {
  setListingType,
  setCategory,
  setSearchText,
  categoryOption,
} from "../../../redux/slice/FilterSlice";

const FilterBar = () => {
  const dispatch = useDispatch();
  const { listingTypeValue } = useAppSelector((s) => s.filters);
  const navigation = useNavigation();

  const LISTING_TYPES = [
    { label: "Buy", value: "buy" },
    { label: "Rent", value: "rent" },
  ];

  const onClear = () => {
    navigation.navigate("Drawer");
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        {LISTING_TYPES.map((item) => {
          const isActive = listingTypeValue === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() =>
                dispatch(
                  setListingType({
                    label: item.label,
                    value: item.value,
                  })
                )
              }
              style={[styles.toggleBtn, isActive && styles.activeBtn]}
            >
              <Text style={[styles.toggleText, isActive && styles.activeText]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={onClear} style={styles.clearBtn}>
        <Ionicons name="close" size={22} color="#555" />
      </Pressable>
    </View>
  );
};

export default FilterBar;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1FCF5",
    padding: 10,
  },

  toggleContainer: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },

  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 26,
    borderRadius: 6,
  },

  activeBtn: {
    backgroundColor: "#27AE60",
  },

  toggleText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },

  activeText: {
    color: "#fff",
  },

  clearBtn: {
    padding: 6,
    marginLeft: 6,
  },
});
