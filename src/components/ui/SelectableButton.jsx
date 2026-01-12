import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // For check / plus icons

const SelectableButton = ({
  label,
  active = false,
  onClick,
  disabled = false,
  error = false,
  selectionType = "single", // "single" | "multiple"
  style = {},
}) => {
  const isMultiple = selectionType === "multiple";

  const getBackgroundColor = () => {
    if (error) return "#FEE2E2"; // red-50
    if (active) return "#D1FAE5"; // green-50
    return "#FFFFFF"; // default
  };

  const getBorderColor = () => {
    if (error) return "#DC2626"; // red-500
    if (active) return "#16A34A"; // green-600
    return "#D1D5DB"; // gray-300
  };

  const getTextColor = () => {
    if (error) return "#B91C1C"; // red-600
    if (active) return "#15803D"; // green-700
    return "#374151"; // gray-700
  };

  return (
    <Pressable
      onPress={onClick}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {isMultiple && (
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: active ? "#16A34A" : "#FFFFFF",
              borderColor: active ? "#16A34A" : "#9CA3AF",
            },
          ]}
        >
          {active ? (
            <FontAwesome name="check" size={12} color="#FFFFFF" />
          ) : (
            <FontAwesome name="plus" size={12} color="#9CA3AF" />
          )}
        </View>
      )}
      <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
    </Pressable>
  );
};

export default SelectableButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // spacing between icon and text
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
  },
  iconWrapper: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
